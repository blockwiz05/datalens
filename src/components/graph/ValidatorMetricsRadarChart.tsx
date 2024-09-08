"use client"
import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

interface ValidatorData {
  entity: string;
  entity_category: string;
  validators: number;
}

const SkeletonRadarChart: React.FC = () => (
  <div className="animate-pulse w-[700px] h-[700px] mr-[20px] p-4 bg-[rgba(249,250,251,0.1)] rounded-lg shadow-xl">
    <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="h-[600px] w-[600px] bg-gray-300 rounded-full mx-auto"></div>
  </div>
);

const ValidatorRadarChart: React.FC = () => {
  const [chartData, setChartData] = useState<ValidatorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetch('/api/get-dune-growthdata');
        const response = await data.json();
        
        if (response.network_entities && response.network_entities.result && response.network_entities.result.rows) {
          const sortedData = response.network_entities.result.rows
            .sort((a: ValidatorData, b: ValidatorData) => b.validators - a.validators)
            .slice(0, 10);  // Get top 5 entities
          
          setChartData(sortedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to transform the data for the radar chart
  const transformData = (data: ValidatorData[]) => {
    const maxValidators = Math.max(...data.map(d => d.validators));
    return data.map(item => ({
      subject: item.entity,
      validators: item.validators,
      fullMark: maxValidators
    }));
  };

  const radarChartData = transformData(chartData);

  if (isLoading) {
    return <SkeletonRadarChart />;
  }

  return (
    <div className="w-[700px] h-[700px] mr-[20px] p-4 bg-[rgba(249,250,251,0.1)] rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">Top 10 Entities by Validator Count</h2>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
          <Radar name="Validators" dataKey="validators" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ValidatorRadarChart;