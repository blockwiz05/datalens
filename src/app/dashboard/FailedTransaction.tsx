import FailTxRadarGraph from "@/components/graph/FailTxRadarGraph";
import React from "react";

export default function FailedTransaction() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 mx-[25px]">
        <div className="p-4">
          <FailTxRadarGraph />
        </div>
      </div>
    </div>
  );
}
