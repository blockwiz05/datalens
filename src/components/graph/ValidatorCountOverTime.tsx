'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { format, parseISO, addDays } from 'date-fns'

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Type for the data point
interface DataPoint {
  date: string
  validators: number
  added: number
  removed: number
}

// Generate mock data function
const generateData = (startDate: Date, days: number): DataPoint[] => {
  let data: DataPoint[] = []
  let validators = 1000
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i)
    const added = Math.floor(Math.random() * 20)
    const removed = Math.floor(Math.random() * 5)
    validators += added - removed
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      validators,
      added,
      removed,
    })
  }
  return data
}

const startDate = parseISO('2023-06-01')
const graphData = generateData(startDate, 365)

export default function ValidatorCountOverTime({data}:{data:any[]}): JSX.Element {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null)
  const [animationProgress, setAnimationProgress] = useState<number>(0)
  const chartRef = useRef<any>(null)

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Chart data
  const chartData = {
    labels: graphData.map(d => d.date),
    datasets: [
      {
        label: 'Validator Count',
        data: graphData.map(d => d.validators),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'Added Validators',
        data: graphData.map(d => d.added),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.1,
        yAxisID: 'y1',
      },
      {
        label: 'Removed Validators',
        data: graphData.map(d => d.removed),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  }

  // Chart options
  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.5)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.5)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    animation: {
      duration: 2000,
      easing: 'linear' as const,
    },
  }

  // Handle hover on chart
  const handleHover = (event: any, elements: any) => {
    if (elements && elements.length > 0) {
      const dataIndex = elements[0].index
      setHoveredPoint(graphData[dataIndex])
    } else {
      setHoveredPoint(null)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-blue-400 mb-4">Validator Count Over Time</h2>
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Line
            ref={chartRef}
            data={{
              ...chartData,
              datasets: chartData.datasets.map(dataset => ({
                ...dataset,
                data: dataset.data.map((value, index) =>
                  index <= graphData.length * animationProgress ? value : null
                ),
              })),
            }}
            options={options}
            onMouseMove={(event) => {
              const chart = chartRef.current
              if (chart) {
                const elements = chart.getElementsAtEventForMode(event, 'index', { intersect: false }, false)
                handleHover(event, elements)
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        </motion.div>
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-800 p-4 rounded-lg shadow-lg text-white z-10"
            >
              <p className="font-bold">{hoveredPoint.date}</p>
              <p className="text-blue-400">Validator Count: {hoveredPoint.validators.toLocaleString()}</p>
              <p className="text-green-400">Added Validators: {hoveredPoint.added}</p>
              <p className="text-red-400">Removed Validators: {hoveredPoint.removed}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
