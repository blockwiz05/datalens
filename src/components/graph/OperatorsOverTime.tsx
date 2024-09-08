'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
  ChartOptions
} from 'chart.js'
import { format, parseISO } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface DataPoint {
  event_date: string;
  cumulative_net_additions: number;
  added_count: number;
  removed_count: number;
}

export default function OperatorsOverTime({ data, title }: { data: DataPoint[], title: string }): JSX.Element {
  const chartData = {
    labels: data.map(d => format(parseISO(d.event_date), 'MMM dd, yyyy')),
    datasets: [
      {
        label: 'Amount Of Operators',
        data: data.map(d => d.cumulative_net_additions),
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.5)',
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: 'Added',
        data: data.map(d => d.added_count),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.1,
        borderWidth: 1,
        pointRadius: 0,
      },
      {
        label: 'Removed',
        data: data.map(d => d.removed_count),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.1,
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(55, 65, 81, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: 'rgb(243, 244, 246)',
        bodyColor: 'rgb(243, 244, 246)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1,
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-opacity-30 bg-opacity-30  bg-purple-900 p-6 rounded-lg shadow-xl backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-teal-300 mb-4">Amount of {title} Over Time</h2>
      <div className="relative h-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          <Line
            data={chartData}
            options={options}
          />
        </motion.div>
      </div>
    </div>
  )
}