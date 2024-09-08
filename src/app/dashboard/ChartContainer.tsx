'use client'

import { useState, useEffect } from 'react'
import QoqGraph from '@/components/graph/qoqGraph'
import MomGraph from '@/components/graph/momGraph'
import OperatorsOverTime from '@/components/graph/OperatorsOverTime'
import ClusterGraph from '@/components/graph/ClusterGraph'
import ValidatorRadarChart from '@/components/graph/ValidatorMetricsRadarChart'
import FailTxRadarGraph from '@/components/graph/FailTxRadarGraph'

const SkeletonLoader = ({ className = "h-[200px]" }: { className?: string }) => (
  <div className={`animate-pulse bg-black opacity-40 rounded-lg ${className}`} />
)

export default function ChartContainer() {
  const [operators, setOperators] = useState<any>(null)
  const [validators, setValidators] = useState<any>(null)
  const [operatorOvertime, setOperatorovertime] = useState<any>(null)
  const [validatorOvertime, setValidatorovertime] = useState<any>(null)
  const getdata = async (retryCount = 3, delay = 2000) => {
    try {
      const [growthDataResponse, overtimeDataResponse] = await Promise.all([
        fetch('/api/get-dune-growthdata'),
        fetch('/api/get-dune-overtime')
      ]);
  
      // If the first response is 429, retry after delay
      if (growthDataResponse.status === 429 || overtimeDataResponse.status === 429) {
        if (retryCount > 0) {
          console.warn(`Rate limit hit, retrying after ${delay}ms...`);
          setTimeout(() => getdata(retryCount - 1, delay * 2), delay);  // Exponential backoff
          return;
        } else {
          console.error('Exceeded retry limit. Please try again later.');
          return;
        }
      }
  
      const growthData = await growthDataResponse.json();
      const overtimeData = await overtimeDataResponse.json();
  
      setOperators(growthData.operators);
      setValidators(growthData.validator);
      setOperatorovertime(overtimeData.operators_overtime.result.rows.reverse());
      setValidatorovertime(overtimeData.validator_overtime.result.rows.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    getdata();
  }, []);
  

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-black bg-opacity-25 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Validators QoQ</h2>
          {validators && validators.validator_qoq?.result?.rows ? (
            <QoqGraph data={validators.validator_qoq.result.rows} title='Validators' />
          ) : (
            <SkeletonLoader />
          )}
        </div>
        <div className="p-4 bg-black bg-opacity-25 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Operators QoQ</h2>
          {operators && operators.operators_qoq?.result?.rows ? (
            <QoqGraph data={operators.operators_qoq.result.rows} title='Operators' />
          ) : (
            <SkeletonLoader />
            
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-black bg-opacity-25 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Validators MoM</h2>
          {validators && validators.validator_mom?.result?.rows ? (
            <MomGraph data={validators.validator_mom.result.rows} title='Validators' />
          ) : (
            <SkeletonLoader />
          )}
        </div>
        <div className="p-4 bg-black bg-opacity-25 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Operators MoM</h2>
          {operators && operators.operators_mom?.result?.rows ? (
            <MomGraph data={operators.operators_mom.result.rows} title='Operators' />
          ) : (
            <SkeletonLoader />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-black bg-opacity-25 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Validators Over Time</h2>
          {validatorOvertime ? (
            <OperatorsOverTime data={validatorOvertime} title='Validators'/>
          ) : (
            <SkeletonLoader className="h-[300px]" />
          )}
        </div>
        <div className="p-4 bg-black bg-opacity-25 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Operators Over Time</h2>
          {operatorOvertime ? (
            <OperatorsOverTime data={operatorOvertime} title='Operators' />
          ) : (
            <SkeletonLoader className="h-[300px]" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-black bg-opacity-25 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Cluster Graph</h2>
          <ClusterGraph />
        </div>
        <div className="p-4 bg-black bg-opacity-25 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Validator Radar Chart</h2>
          <ValidatorRadarChart />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="p-4 bg-black bg-opacity-25 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-white">Failed Transaction Radar Graph</h2>
          <FailTxRadarGraph />
        </div>
      </div>
    </div>
  )
}