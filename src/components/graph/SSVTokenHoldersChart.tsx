import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SSVTokenHoldersChart = () => {
  const [holderData, setHolderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async (retryCount = 3, delay = 2000) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/get-dune-herodao');
      if (response.status === 429) {
        if (retryCount > 0) {
          console.warn(`Rate limit hit, retrying after ${delay}ms...`);
          setTimeout(() => getData(retryCount - 1, delay * 2), delay);
        } else {
          throw new Error('Exceeded retry limit. Please try again later.');
        }
        return;
      }
      const data = await response.json();
      if (data.ssv_holders && data.ssv_holders.result && data.ssv_holders.result.rows) {
        setHolderData(data.ssv_holders.result.rows);
      } else {
        throw new Error('Invalid data format.');
      }
    } catch (error:any) {
      setError(error.message);
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <div>Loading chart...</div>;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={holderData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="SSV Token Holders" stroke="#8884d8" />
        <Line type="monotone" dataKey="Change in 1 Day" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Rolling 7 day" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SSVTokenHoldersChart;
