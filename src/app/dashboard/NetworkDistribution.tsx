import ClusterGraph from "@/components/graph/ClusterGraph";
import ValidatorRadarChart from "@/components/graph/ValidatorMetricsRadarChart";
import React from "react";

export default function NetworkDistribution() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-[25px]">
        <div className="p-4">
          
          <ClusterGraph />
        </div>
        <div className="p-4">
         
          <ValidatorRadarChart />
        </div>
      </div>{" "}
    </div>
  );
}
