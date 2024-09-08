'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  "Circulating Supply": number
  "Current DAO Quorum": number
  "Issued Supply": number
  "Minted Supply": number
  "New Quorum": number
  "Total Supply": number
  "day": string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-opacity-80 bg-gray-800 p-4 rounded-lg shadow-lg backdrop-blur-sm"
      >
        <p className="text-teal-300 font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-purple-300">
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </motion.div>
    )
  }
  return null
}

const SkeletonChart = () => (
  <div className="animate-pulse bg-gray-700 w-full h-[400px] rounded-lg flex justify-center items-center">
    <div className="bg-gray-600 w-10/12 h-2/3 rounded"></div>
  </div>
)

export default function DaoBarChart() {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)
  const [datat, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getdata = useCallback(async (retryCount = 3, delay = 2000) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/get-dune-dao')
      if (response.status === 429) {
        if (retryCount > 0) {
          console.warn(`Rate limit hit, retrying after ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          return getdata(retryCount - 1, delay * 2)
        } else {
          throw new Error('Exceeded retry limit. Please try again later.')
        }
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Data:', data)
      setData(data.ssv_supply.result.rows) // Setting the correct data
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getdata()
  }, [getdata])

  const barColors = {
    "Circulating Supply": "#4f46e5",
    "Current DAO Quorum": "#06b6d4",
    "Issued Supply": "#8b5cf6",
    "Minted Supply": "#10b981",
    "New Quorum": "#f59e0b",
    "Total Supply": "#ef4444"
  }

  // Make sure to only attempt to access `datat` if it's not null
  const Actualdata: DataPoint[] = datat ? [{
    "Circulating Supply": datat[0]['Circulating Supply'],
    "Current DAO Quorum":  datat[0]["Current DAO Quorum"],
    "Issued Supply": datat[0]['Issued Supply'],
    "Minted Supply": datat[0]['Minted Supply'],
    "New Quorum": datat[0]["New Quorum"],
    "Total Supply": datat[0]['TotalSupply'],
    "day": datat[0]['day']
  }] : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-opacity-30 bg-purple-900 w-[600px] p-6 rounded-lg max-w-4xl  backdrop-blur-sm"
    >
      <h2 className="text-teal-300 text-2xl font-bold mb-4">Supply and Quorum Data</h2>
      {isLoading ? (
        <SkeletonChart />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={Actualdata}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="day" stroke="#8884d8" tick={{ fill: '#8884d8' }} axisLine={{ stroke: '#8884d8' }} />
            <YAxis stroke="#8884d8" tick={{ fill: '#8884d8' }} axisLine={{ stroke: '#8884d8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} iconType="circle" />
            {Object.keys(barColors).map(key => (
              <Bar
                key={key}
                dataKey={key}
                fill={barColors[key as keyof typeof barColors]}
                radius={[4, 4, 0, 0]}
                onMouseEnter={() => setHoveredBar(key)}
                onMouseLeave={() => setHoveredBar(null)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}
