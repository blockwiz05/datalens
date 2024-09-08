'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

// PriceCard Component
const PriceCard = ({ productName, price }: { productName: string; price: number }) => {
  const [animatedPrice, setAnimatedPrice] = useState(0)

  useEffect(() => {
    const animation = setInterval(() => {
      setAnimatedPrice((prevPrice) => {
        if (prevPrice === null) return 0
        if (prevPrice < price) {
          return prevPrice + Math.ceil((price - prevPrice) / 10)
        } else {
          clearInterval(animation)
          return price
        }
      })
    }, 50)

    return () => clearInterval(animation)
  }, [price])

  const formatPrice = (value: number | null) => {
    if (value === null) return '0'
    return value?.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  return (
    <div className="p-4 bg-[rgba(249,250,251,0.1)] rounded-lg shadow-lg flex h-[120px] min-w-[250px] flex-col items-center">
      <h2 className="text-md font-bold text-green-300  mb-2">{productName}</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl text-white font-semibold"
      >
        {productName === "SSV Holders" 
          ? formatPrice(animatedPrice)
          : `$${formatPrice(animatedPrice)}`}
      </motion.div>
    </div>
  )
}

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="p-4 bg-[rgba(249,250,251,0.1)] rounded-lg shadow-lg flex h-[120px] min-w-[250px] flex-col items-center animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-10 bg-gray-300 rounded w-1/2"></div>
  </div>
)

const PriceDashboard = () => {
  const [prices, setPrices] = useState({
    price: 0,
    sevenDayVolume: 0,
    valuation: 0,
    supply: 0,
  })
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
      if (data) {
        setPrices({
          price: data.ssv_price.result.rows[0].price,
          sevenDayVolume: data.ssv_sevenday_volume.result.rows[0]['7d_volume'],
          valuation: data.ssv_valuation.result.rows[0].FDV,
          supply: data.ssv_supply.result.rows[0]["Total Supply"],
        })
      }
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

  const products = [
    { name: "SSV Price On Uniswap", price: prices.price },
    { name: "SSV Fully Diluted Valuation", price: prices.valuation },
    { name: "7d SSV Uniswap Volume", price: prices.sevenDayVolume },
    { name: "SSV Total Supply", price: prices.supply },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-[10px] w-full max-w-[1100px] mx-auto mt-[50px] card-container">
        {Array(4).fill(0).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="flex flex-wrap gap-[10px] w-full max-w-[1100px] mx-auto mt-[50px] card-container">
      {products.map((product, index) => (
        <PriceCard
          key={index}
          productName={product.name}
          price={product.price}
        />
      ))}
    </div>
  )
}

export default PriceDashboard