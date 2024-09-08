'use client'

import React, { useState, useRef, useEffect } from 'react'
import { gql } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { motion } from 'framer-motion'

const client = new ApolloClient({
  uri: `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_SUBGRAPH_ENV}/subgraphs/id/7V45fKPugp9psQjgrGsfif98gWzCyC6ChN7CW98VyQnr`,
  cache: new InMemoryCache()
})

const GET_CLUSTERS = gql`
  query GetClusters($first: Int!, $skip: Int!) {
    clusters(first: $first, skip: $skip) {
      active
      balance
      operatorIds
    }
  }
`;

interface ClusterGroup {
  id: number
  operatorCount: number
  clusterCount: number
  x: number
  y: number
}

async function fetchAllClusters() {
  const pageSize = 1000
  let skip = 0
  let allClusters: any[] = []
  let hasMore = true

  while (hasMore) {
    try {
      const { data } = await client.query({
        query: GET_CLUSTERS,
        variables: { first: pageSize, skip: skip }
      })

      if (data.clusters.length > 0) {
        allClusters = allClusters.concat(data.clusters)
        skip += pageSize
      } else {
        hasMore = false
      }
    } catch (error) {
      console.error('Error fetching clusters:', error)
      hasMore = false
    }
  }
  return allClusters
}

function groupClustersByOperatorIdsLength(clusters: any[]) {
  const groups: any = {
    4: [],
    7: [],
    10: [],
    13: []
  }

  clusters.forEach(cluster => {
    const length = cluster.operatorIds.length
    if (groups.hasOwnProperty(length)) {
      groups[length].push(cluster)
    }
  })
  return groups
}

const colors = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3']

const SkeletonClusterGraph: React.FC = () => (
  <div className="w-[700px] h-[700px] bg-[rgba(249,250,251,0.1)] mx-auto p-4 animate-pulse">
    <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
    <div className="relative aspect-square h-[580px] rounded-lg overflow-hidden bg-gray-300">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-gray-400"
          style={{
            width: '30%',
            height: '30%',
            left: `${25 + (index % 2) * 50}%`,
            top: `${25 + Math.floor(index / 2) * 50}%`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>
      ))}
    </div>
    <div className="mt-4 flex flex-wrap justify-center">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="flex items-center mr-4 mb-2">
          <div className="w-4 h-4 mr-2 bg-gray-300"></div>
          <div className="w-20 h-4 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function ClusterGraph() {
  const [data, setData] = useState<ClusterGroup[]>([]);
  const [selectedBubble, setSelectedBubble] = useState<ClusterGroup | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [clusterGroups, setClusterGroups] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const fetchedClusters = await fetchAllClusters();
      const groups = groupClustersByOperatorIdsLength(fetchedClusters);
      setClusterGroups(groups);
      setIsLoading(false);
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (clusterGroups) {
      const newData: ClusterGroup[] = [
        { id: 1, operatorCount: 4, clusterCount: clusterGroups[4].length, x: 25, y: 25 },
        { id: 2, operatorCount: 7, clusterCount: clusterGroups[7].length, x: 75, y: 25 },
        { id: 3, operatorCount: 10, clusterCount: clusterGroups[10].length, x: 25, y: 75 },
        { id: 4, operatorCount: 13, clusterCount: clusterGroups[13].length, x: 75, y: 75 },
      ]
      setData(newData)
    }
  }, [clusterGroups])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging !== null && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setData(prevData => 
          prevData.map(item => 
            item.id === dragging ? { ...item, x, y } : item
          )
        )
      }
    }

    const handleMouseUp = () => {
      setDragging(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  if (isLoading) {
    return <SkeletonClusterGraph />;
  }

  const maxClusterCount = Math.max(...data.map(d => d.clusterCount))

  return (
    <div className="w-[700px] h-[700px] bg-opacity-30 bg-purple-900 mx-auto p-4 rounded-lg shadow-xl backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-teal-300 text-center">Interactive Cluster Distribution</h2>
      <div ref={containerRef} className="relative aspect-square h-[580px] rounded-lg overflow-hidden">
        {data.map((item, index) => {
          const size = (item.clusterCount / maxClusterCount) * 40 + 10
          return (
            <motion.div
              key={item.id}
              className="absolute rounded-full flex items-center justify-center cursor-move transition-shadow duration-300 hover:shadow-lg"
              style={{
                width: `${Math.max(size, 20)}%`, // Ensure a minimum size of 20% for the bubble
                height: `${Math.max(size, 20)}%`, // Ensure a minimum size of 20% for the bubble
                left: `${item.x}%`,
                top: `${item.y}%`,
                backgroundColor: colors[index % colors.length],
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              onMouseDown={(e) => {
                e.preventDefault()
                setDragging(item.id)
              }}
              onClick={() => setSelectedBubble(item)}
            >
              <div className="text-white text-center flex justify-center items-center flex-col">
                <div className="font-bold text-xs sm:text-sm md:text-base">{item.operatorCount} ops</div>
                <div className="text-xs sm:text-sm md:text-base">{item.clusterCount} clusters</div>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-4 flex flex-wrap justify-center">
        {data.map((item, index) => (
          <div key={item.id} className="flex items-center mr-4 mb-2">
            <div
              className="w-4 h-4 mr-2 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm text-gray-300">{item.operatorCount} Operators</span>
          </div>
        ))}
      </div>
    </div>
  )
}