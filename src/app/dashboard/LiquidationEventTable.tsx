import React, { useState, useEffect, useMemo } from 'react';

interface LiquidationEvent {
  evt_block_number: number;
  evt_block_time: string;
  liquidator_address: string;
  operatorIds: string[];
  owner_link: string;
  transaction_link: string;
  value_in_ssv: number;
}

export default function LiquidationEventsTable() {
  const [data, setData] = useState<LiquidationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof LiquidationEvent>('evt_block_number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

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
      const result = await response.json();
      setData(result.liquidation.result.rows);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const handleSort = (column: keyof LiquidationEvent) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Skeleton loader function
  const renderSkeleton = () => {
    const skeletonRows = Array.from({ length: itemsPerPage }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        <td className="p-2 border-b border-gray-700">
          <div className="h-4 bg-gray-600 rounded w-24"></div>
        </td>
        <td className="p-2 border-b border-gray-700">
          <div className="h-4 bg-gray-600 rounded w-24"></div>
        </td>
        <td className="p-2 border-b border-gray-700">
          <div className="h-4 bg-gray-600 rounded w-32"></div>
        </td>
        <td className="p-2 border-b border-gray-700">
          <div className="h-4 bg-gray-600 rounded w-16"></div>
        </td>
        <td className="p-2 border-b border-gray-700">
          <div className="h-4 bg-gray-600 rounded w-24"></div>
        </td>
        <td className="p-2 border-b border-gray-700">
          <div className="h-4 bg-gray-600 rounded w-16"></div>
        </td>
        <td className="p-2 border-b border-gray-700">
          <div className="h-4 bg-gray-600 rounded w-24"></div>
        </td>
      </tr>
    ));
    return skeletonRows;
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-purple-900 bg-opacity-30 text-gray-100 rounded-lg shadow-xl w-[90%] ml-[5%]">
        <h2 className="text-2xl font-bold mb-4">Loading Liquidation Events...</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left border-b border-gray-700">Block Number</th>
                <th className="p-2 text-left border-b border-gray-700">Block Time</th>
                <th className="p-2 text-left border-b border-gray-700">Liquidator Address</th>
                <th className="p-2 text-left border-b border-gray-700">Operator IDs</th>
                <th className="p-2 text-left border-b border-gray-700">Owner Link</th>
                <th className="p-2 text-left border-b border-gray-700">Transaction Link</th>
                <th className="p-2 text-left border-b border-gray-700">Value in SSV</th>
              </tr>
            </thead>
            <tbody>{renderSkeleton()}</tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-purple-900 bg-opacity-30 text-gray-100 rounded-lg shadow-xl w-[90%] ml-[5%]">
      <h2 className="text-2xl font-bold mb-4">Liquidation Events</h2>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 bg-grey-400 text-black  border border-gray-700 rounded"
      />

      <div className="overflow-x-auto ">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {Object.keys(data[0] || {}).map((key) => (
                <th
                  key={key}
                  className="p-2 text-left border-b border-gray-700 cursor-pointer"
                  onClick={() => handleSort(key as keyof LiquidationEvent)}
                >
                  {key.replace(/_/g, ' ').toUpperCase()}
                  {sortColumn === key && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-800">
                <td className="p-2 border-b border-gray-700">{item.evt_block_number}</td>
                <td className="p-2 border-b border-gray-700">{item.evt_block_time}</td>
                <td className="p-2 border-b border-gray-700 font-mono">{item.liquidator_address}</td>
                <td className="p-2 border-b border-gray-700">{item.operatorIds.join(', ')}</td>
                <td
                  className="p-2 border-b border-gray-700 hover:underline w-full"
                  dangerouslySetInnerHTML={{ __html: item.owner_link }}
                />
                <td
                  className="p-2 border-b border-gray-700 hover:underline"
                  dangerouslySetInnerHTML={{ __html: item.transaction_link }}
                />
                <td className="p-2 border-b border-gray-700">{item.value_in_ssv.toFixed(8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-gray-700 text-gray-100 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-2 px-2 py-1 bg-gray-700 text-gray-100 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
