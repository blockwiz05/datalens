'use client'
import React from 'react'
import Options from './Options'
import PriceDashboard from '@/components/ssv-token/Card'
import CryptoPieChart from '@/components/ssv-token/CryptoPieChart'
import DaoBarChart from '@/components/ssv-token/DaoBarChart'
import SSVTokenHoldersChart from '@/components/graph/SSVTokenHoldersChart'

export default function page() {
  return (
    <div className='mt-[120px]'>
      <PriceDashboard/>
      <div className='flex'>
      <div className='mt-[50px] ml-[10%]'>
      <CryptoPieChart/>

      </div>
      <div className='mt-[50px] ml-[10%]'>
      <DaoBarChart/>

      </div>
      <SSVTokenHoldersChart/>
      </div>
    </div>
  )
}
