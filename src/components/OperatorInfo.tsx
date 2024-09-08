import React, { useEffect, useState } from 'react'
import { ExternalLink, Copy, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import copy from 'clipboard-copy'

// Fetch data from API and pass it to the component
const fetchOperatorData = async () => {
  // Replace with your API endpoint
  const response = await fetch('/api/operator')
  const data: any = await response.json()
  return data
}

function formatPerformance(value: any) {
  // Ensure value is a number and is not undefined or null
  return (typeof value === 'number' && !isNaN(value)) ? value.toFixed(2) : '0.00'
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copy(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
    </button>
  )
}

interface InfoItemProps {
  label: string
  value: string
  link?: boolean
  valueClassName?: string
  copyable?: boolean
  fullValue?: string
  logo?: string
}

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  link = false,
  valueClassName = "",
  copyable = false,
  fullValue = "",
  logo,
}) => {
  return (
    <div className="mb-4">
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className={`${valueClassName} text-gray-100 flex items-center flex-wrap`}>
        {link ? (
          <>
            <Link
              href={value}
              target="_blank"
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 underline hover:no-underline break-all"
            >
              {value} <ExternalLink size={14} />
            </Link>
            {logo && (
              <Image
                src={logo}
                alt={`${label} logo`}
                width={24}
                height={24}
                className="ml-2 rounded-full"
              />
            )}
          </>
        ) : (
          <span className="bg-gray-800 rounded-md px-2 py-1 break-all">{value}</span>
        )}
        {copyable && <CopyButton text={fullValue || value} />}
      </div>
    </div>
  )
}

const OperatorInfo = ({
  name,
  owner_address,
  location,
  eth1_node_client,
  eth2_node_client,
  mev_relays,
  website_url,
  twitter_url,
  linkedin_url,
  public_key,
  status,
  description,
  performance,
  fee,
  logo
}: any) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm mb-6">
          <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
            Overview
          </Link>{" "}
          /{" "}
          <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
            Operators
          </Link>{" "}
          / <span className="text-gray-400">{name}</span>
        </nav>

        <div className="flex items-center gap-4 mb-8">
          <Image
            src={logo}
            alt={`${name} logo`}
            width={48}
            height={48}
            className="rounded-full border-2"
          />
          <h1 className="text-4xl font-bold ">{name}</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div>
              <InfoItem
                label="Description"
                value={description}
              />
              <InfoItem label="Location" value={location} />
              <InfoItem label="Eth1 node client" value={eth1_node_client} />
              <InfoItem label="Eth2 node client" value={eth2_node_client} />
              <InfoItem
                label="MEV relays"
                value={mev_relays}
              />
            </div>
            <div>
              <InfoItem label="Website" value={website_url || "-"} link />
              <InfoItem label="Twitter" value={twitter_url || "-"} link />
              <InfoItem label="Linkedin" value={linkedin_url || "-"} link />
              <InfoItem 
                label="Owner" 
                value={`${owner_address?.slice(0, 6)}...${owner_address?.slice(-4)}`} 
                copyable 
                fullValue={owner_address}
              />
              <InfoItem 
                label="Public Key" 
                value={`${public_key?.slice(0, 6)}...${public_key.slice(-4)}`} 
                copyable 
                fullValue={public_key}
              />
              <InfoItem 
                label="Fee (yearly normalized)" 
                value={formatPerformance(fee)} 
              />
            </div>
          
            <InfoItem
              label="Status"
              value={status}
              valueClassName={status === "Inactive" ? "text-red-500" : "text-gray-100"}
            />
            <InfoItem label="Performance 1H" value={formatPerformance(performance["1h"])} />
            <InfoItem label="Performance 24H" value={formatPerformance(performance["24h"])} />
            <InfoItem label="Performance 30D" value={formatPerformance(performance["30d"])} />
          </div>
        </div>
      </div>
    </div>
  )
}

const OperatorInfoContainer = () => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      const operatorData = await fetchOperatorData()
      setData(operatorData)
    }

    loadData()
  }, [])

  if (!data) {
    return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">Loading...</div>
  }

  return <OperatorInfo {...data} />
}

export default OperatorInfo
export { OperatorInfoContainer }