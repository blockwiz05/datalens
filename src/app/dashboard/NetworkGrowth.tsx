"use client";
import MomGraph from "@/components/graph/momGraph";
import OperatorsOverTime from "@/components/graph/OperatorsOverTime";
import QoqGraph from "@/components/graph/qoqGraph";
import React, { useEffect, useState } from "react";
import ValueCard from "./ValueCard";

const SkeletonLoader = ({
  className = "h-[200px]",
}: {
  className?: string;
}) => (
  <div
    className={`animate-pulse bg-black opacity-40 rounded-lg ${className}`}
  />
);
export default function NetworkGrowth() {
  const [operators, setOperators] = useState<any>(null);
  const [validators, setValidators] = useState<any>(null);
  const [operatorOvertime, setOperatorovertime] = useState<any>(null);
  const [validatorOvertime, setValidatorovertime] = useState<any>(null);

  const getdata = async () => {
    try {
      const [growthData, overtimeData] = await Promise.all([
        fetch("/api/get-dune-growthdata").then((res) => res.json()),
        fetch("/api/get-dune-overtime").then((res) => res.json()),
      ]);

      setOperators(growthData.operators);
      setValidators(growthData.validator);
      setOperatorovertime(
        overtimeData.operators_overtime.result.rows.reverse()
      );
      setValidatorovertime(
        overtimeData.validator_overtime.result.rows.reverse()
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getdata();
  }, []);
  return (
    <div className="space-y-6">
      <ValueCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-[25px]">
        <div className="p-4">
         
          {validators && validators.validator_qoq?.result?.rows ? (
            <QoqGraph
              data={validators.validator_qoq.result.rows}
              title="Validators"
            />
          ) : (
            <SkeletonLoader />
          )}
        </div>
        <div className="p-4 ">
         
          {operators && operators.operators_qoq?.result?.rows ? (
            <QoqGraph
              data={operators.operators_qoq.result.rows}
              title="Operators"
            />
          ) : (
            <SkeletonLoader />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-[25px]">
        <div className="p-4">
           
          {validators && validators.validator_mom?.result?.rows ? (
            <MomGraph
              data={validators.validator_mom.result.rows}
              title="Validators"
            />
          ) : (
            <SkeletonLoader />
          )}
        </div>
        <div className="p-4 ">
         
          {operators && operators.operators_mom?.result?.rows ? (
            <MomGraph
              data={operators.operators_mom.result.rows}
              title="Operators"
            />
          ) : (
            <SkeletonLoader />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-[25px]">
        <div className="p-4 ">
        
          {validatorOvertime ? (
            <OperatorsOverTime data={validatorOvertime} title="Validators" />
          ) : (
            <SkeletonLoader className="h-[300px]" />
          )}
        </div>
        <div className="p-4 ">
          
          {operatorOvertime ? (
            <OperatorsOverTime data={operatorOvertime} title="Operators" />
          ) : (
            <SkeletonLoader className="h-[300px]" />
          )}
        </div>
      </div>
    </div>
  );
}
