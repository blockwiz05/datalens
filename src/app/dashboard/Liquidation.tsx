import React, { useState, useEffect } from 'react';
import LiquidationEventsTable from './LiquidationEventTable';

interface LiquidationData {
  liquidation_event_count: number;
  liquidator_address: string;
  total_value_ssv: number;
}

export default function LiquidationTable() {
  const [data, setData] = useState<LiquidationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getdata = async (retryCount = 3, delay = 2000) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/get-liquidation');
      if (response.status === 500) {
        if (retryCount > 0) {
          console.warn(`Rate limit hit, retrying after ${delay}ms...`);
          setTimeout(() => getdata(retryCount - 1, delay * 2), delay);
        } else {
          throw new Error('Exceeded retry limit. Please try again later.');
        }
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log('Data:', data);
      setData(data.liquidationByLiquidator.result.rows);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    getdata();
  }, []);

  if (isLoading) {
    return <LiquidationTableSkeleton />;  // Show skeleton while loading
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className="p-4 bg-purple-900 bg-opacity-30 text-gray-100 rounded-lg shadow-xl w-[90%] ml-[5%]">
        <h2 className="text-2xl font-bold mb-4">Liquidations by Liquidator</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left border-b border-gray-700">Liquidator Address</th>
                <th className="p-2 text-left border-b border-gray-700">Liquidation Event Count</th>
                <th className="p-2 text-left border-b border-gray-700">Total Value SSV</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-800">
                  <td className="p-2 border-b border-gray-700 font-mono">{item.liquidator_address}</td>
                  <td className="p-2 border-b border-gray-700">{item.liquidation_event_count}</td>
                  <td className="p-2 border-b border-gray-700">{item.total_value_ssv.toFixed(8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <LiquidationEventsTable />
      </div>
    </>
  );
}

const LiquidationTableSkeleton = () => {
  return (
    <>
      <div className="p-4 bg-purple-900 bg-opacity-30 text-gray-100 rounded-lg shadow-xl w-[90%] ml-[5%]">
        <h2 className="text-2xl font-bold mb-4">Liquidations by Liquidator</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left border-b border-gray-700">Liquidator Address</th>
                <th className="p-2 text-left border-b border-gray-700">Liquidation Event Count</th>
                <th className="p-2 text-left border-b border-gray-700">Total Value SSV</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(12)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="p-2 border-b border-gray-700">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </td>
                  <td className="p-2 border-b border-gray-700">
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </td>
                  <td className="p-2 border-b border-gray-700">
                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <LiquidationEventsTableSkeleton /> {/* Skeleton for the events table */}
      </div>
    </>
  );
};

const LiquidationEventsTableSkeleton = () => {
  return (
    <div className="bg-[rgba(249,250,251,0.1)] w-[700px] h-[800px] text-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Liquidation Events</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Block Number</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Time</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Liquidator</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Operator IDs</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Owner Link</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Transaction Link</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">SSV Value</th>
            </tr>
          </thead>
          <tbody className="block max-h-[550px] overflow-y-auto">
            {[...Array(12)].map((_, index) => (
              <tr key={index} className="border-b border-gray-800 hover:bg-gray-800 flex w-full animate-pulse">
                <td className="py-3 px-4 w-[15%]">
                  <div className="h-4 bg-gray-700 rounded"></div>
                </td>
                <td className="py-3 px-4 w-[15%]">
                  <div className="h-4 bg-gray-700 rounded"></div>
                </td>
                <td className="py-3 px-4 w-[20%]">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                </td>
                <td className="py-3 px-4 w-[15%]">
                  <div className="h-4 bg-gray-700 rounded"></div>
                </td>
                <td className="py-3 px-4 w-[15%]">
                  <div className="h-4 bg-gray-700 rounded"></div>
                </td>
                <td className="py-3 px-4 w-[15%]">
                  <div className="h-4 bg-gray-700 rounded"></div>
                </td>
                <td className="py-3 px-4 w-[15%]">
                  <div className="h-4 bg-gray-700 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
