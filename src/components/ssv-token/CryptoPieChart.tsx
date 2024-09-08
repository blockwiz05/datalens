'use client'

import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// Skeleton component
const SkeletonPieChart = () => (
  <div className="animate-pulse">
    <div className="h-[300px] w-[300px] bg-gray-300 rounded-full mx-auto"></div>
  </div>
)

export default function CryptoPieChart() {
  const [treasury, setTreasury] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getdata = async (retryCount = 3, delay = 2000) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/get-dune-herodao')
      if (response.status === 429) {
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
      if (data.ssv_treasury && data.ssv_treasury.result && data.ssv_treasury.result.rows) {
        setTreasury(data.ssv_treasury.result.rows)
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

  const CustomTooltip = ({ active, payload }:any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="custom-tooltip bg-white p-2 rounded shadow">
          <p className="label">{`${data.symbol}`}</p>
          <p className="value">{`Value: $${data.balance.toLocaleString()}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="mr-[26px] p-6 bg-[rgba(249,250,251,0.1)] h-[500px] w-[600px] rounded-lg shadow-lg ">
      <h2 className="text-2xl font-bold text-center text-white mb-4">SSV Treasury</h2>
      {isLoading ? (
        <SkeletonPieChart />
      ) : treasury.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={treasury}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="balance"
              label={({ symbol, percent }) => `${symbol} ${(percent * 100).toFixed(0)}%`}
            >
              {treasury.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-white">No treasury data available.</p>
        </div>
      )}
    </div>
  )
}