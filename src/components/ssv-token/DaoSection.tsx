import React from 'react'
import Header from '../ui/Header'
import Card from './Card'
import CryptoPieChart from './CryptoPieChart'
import DaoBarChart from './DaoBarChart'
import ViewMoreBtn from './ViewMoreBtn'

export default function DaoSection() {
  return (
    <div>
      <Header title={'Analysis Of SSV Token and DAO'}/>
      <Card/>

      <div className='flex ml-[10%] mt-[30px] ' >
      <CryptoPieChart/>
      <DaoBarChart/>
      </div>
      <div className="ml-[45%] mt-[50px]">
      <ViewMoreBtn/>
      </div>
    </div>
  )
}
