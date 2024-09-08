"use client"
import React from 'react'
import Header from './ui/Header'
import ClusterGraph from './graph/ClusterGraph'
import ValidatorRadarChart from './graph/ValidatorMetricsRadarChart'
import ValidatorsTable from './ValidatorsTable'
import { motion } from 'framer-motion';
import Link from 'next/link';
import DataTable from './OperatorTable'

export default function SsvAnalysis() {
  return (
    <div className='mt-[50px]'>
      <Header title={'Analysis of SSV Network'}/>
      <div className='flex mt-[50px] mr-[25px]'>
      <ClusterGraph/>
      <ValidatorRadarChart/>
      </div>
      <div className="container mx-auto px-4 py-8 mt-[30px]">
        <div className="flex flex-col lg:flex-row gap-8 ">
          <div className="w-full lg:w-1/2">
            <DataTable />
          </div>
          <div className="w-full  lg:w-1/2">
            <ValidatorsTable />
          </div>
        </div>
      </div>

      <div className='ml-[45%]'>


      <Link href="/dashboard" passHref>
      <div className="relative h-[50px] w-[180px] rounded-full">
        <motion.button
          className="h-full w-full cursor-pointer border  border-[#91C9FF] bg-transparent text-white transition-colors duration-1000 ease-in-out hover:bg-[rgba(249,250,251,0.1)]"
          whileHover="hover"
        >
          <motion.svg
            width="180"
            height="50"
            viewBox="0 0 180 50"
            className="absolute left-0 top-0"
            initial={{
              fill: "none",
              stroke: "#fff",
              strokeDasharray: "150 480",
              strokeDashoffset: 150,
            }}
            variants={{
              hover: {
                strokeDashoffset: -480,
                transition: { duration: 1, ease: "easeInOut" },
              },
            }}
          >
            <motion.polyline points="179,1 179,59 1,59 1,1 179,1" />
          </motion.svg>
          <span className="relative z-10 text-lg font-bold">View More</span>
        </motion.button>
      </div>
    </Link>
      </div>

     
    </div>
  )
}
