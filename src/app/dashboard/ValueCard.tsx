'use client'
import { useState, useEffect } from "react"
import CountUp from 'react-countup'
interface Product {
  type: string
  value: number | undefined
  days: string
}

export default function ValueCard() {
  const [validatorData, setValidatorData] = useState<any>()
  const [operatorData, setOperatorData] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)

  const getdata = async (retryCount = 3, delay = 2000) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/get-dune-data')
      if (response.status === 500) {
        if (retryCount > 0) {
          console.warn(`Rate limit hit, retrying after ${delay}ms...`)
          setTimeout(() => getdata(retryCount - 1, delay * 2), delay)
        } else {
          console.error('Exceeded retry limit. Please try again later.')
        }
        return
      }
      const data = await response.json()
      console.log('Data:', data)
      if (data.validator && data.operators) {
        setValidatorData(data.validator)
        setOperatorData(data.operators)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    getdata()
  }, [])

  console.log(validatorData)

  const products: Product[] = [
    { type: "Registered Validators", value: validatorData?.total_validator.result.rows[0]?.cumulative_net_additions, days: "" },
    { type: "7d Validators Growth", value: validatorData?.sevenDay_validator.result.rows[0]?.['7d Validator'], days: "7d" },
    { type: "30d Validators Growth", value: validatorData?.sevenDay_validator.result.rows[0]?.['30d Validator'], days: "30d" },
    { type: "Operators", value: operatorData?.total_operators.result.rows[0]?.cumulative_net_additions, days: "" },
    { type: "7d Operator Growth", value: validatorData?.sevenDay_validator.result.rows[0]?.['7d Operator'], days: "7d" },
    { type: "30d Operator Growth", value: validatorData?.sevenDay_validator.result.rows[0]?.['30d Operator'], days: "30d" },
  ]

  const renderSkeletons = () => {
    return Array(6).fill(null).map((_, index) => (
      <div 
        key={`skeleton-${index}`}
        className="rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between w-[210px] h-[160px]" // Match dimensions here
      >
        <div className="skeleton-loader h-4 w-3/4 mb-2"></div>
        <div className="skeleton-loader h-6 w-1/2"></div>
      </div>
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .skeleton-loader {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }
      `}</style>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ">
        {isLoading ? renderSkeletons() : (
          products.map((product, index) => (
            <div 
              key={index}
              className="bg-[rgba(249,250,251,0.1)]  ml-[22px] rounded-lg shadow-md py-4 pl-4 w-[210px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
            >
              <h3 className="font-semibold text-white text-sm mb-2 flex-grow">{product.type}</h3>
              <p className="text-lg font-bold text-white text-primary">
              {product.value !== undefined ? (
                  <CountUp start={0} end={product.value} duration={2.5} separator="," />
                ) : '0'}              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}