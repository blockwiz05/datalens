'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  month: string
  cumulative_validators?: number
  total_net_additions?: number
  mom_growth_percentage: number
}

export default function MomGraph({ data, title }: { data: DataPoint[], title: string }): JSX.Element {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const dataKey = title === 'Operators' ? 'cumulative_validators' : 'total_net_additions'
  
  const formattedData = data.map((item) => ({
    ...item,
    mom_growth_percentage: Number(item.mom_growth_percentage).toFixed(2),
    month: title === 'Operators' ? item.month.split(' ')[0] : item.month
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-opacity-30 bg-purple-900 p-6 rounded-lg max-w-4xl mx-auto backdrop-blur-sm"
    >
      <h2 className="text-teal-300 text-2xl font-bold mb-4">{title} Growth MoM</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="#8884d8" 
            tick={{ fill: '#8884d8' }} 
            axisLine={{ stroke: '#8884d8' }}
          />
          <YAxis 
            yAxisId="left" 
            stroke="#8884d8" 
            tick={{ fill: '#8884d8' }} 
            axisLine={{ stroke: '#8884d8' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#82ca9d" 
            tick={{ fill: '#82ca9d' }} 
            axisLine={{ stroke: '#82ca9d' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #4b5563', borderRadius: '6px' }}
            labelStyle={{ color: '#e2e8f0' }}
            itemStyle={{ color: '#a5b4fc' }}
          />
          <Legend 
            wrapperStyle={{ color: '#e2e8f0' }} 
            iconType="circle"
          />
          <Bar
            yAxisId="left"
            dataKey={dataKey}
            fill="#4f46e5"
            radius={[4, 4, 0, 0]}
            onMouseEnter={(_, index) => setHoveredBar(index)}
            onMouseLeave={() => setHoveredBar(null)}
          >
            {data.map((_, index) => (
              <motion.rect
                key={`bar-${index}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: hoveredBar === index ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="mom_growth_percentage"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={{ fill: '#06b6d4', r: 4 }}
            activeDot={{ r: 6, fill: '#22d3ee' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  )
}