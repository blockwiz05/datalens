'use client';
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Marquee from "../lib/CardUtil";
import NumberTickerDemo from "./NumberTickerDemo";
import { url } from "inspector";
import CountUp from 'react-countup'; // Import the CountUp component for number animation

const DataCard = ({
  type,
  value,
  days,
}: {
  type: string;
  value: number;
  days: string;
}) => {
  return (
    <figure
    className={cn(
      "relative w-64 h-[160px] cursor-pointer overflow-hidden rounded-xl p-4 bg-[rgba(0,0,0,0.5)]",
      "transition-all duration-300 ease-in-out",
      "border border-transparent",
      // Subtle glow effect by default
      "shadow-[0_0_5px_2px_rgba(21,193,225,0.3)]",
      // Enhanced glow effect on hover
      "hover:shadow-[0_0_15px_5px_rgba(21,193,225,0.7)]"
    )}
    style={{
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    }}
    >
     
      <div className="flex justify-center items-center h-full w-full flex-col">
      <h1
          className="text-white text-bold text-md"
          style={{
            fontSize: "36px", // Adjust size as per your preference
            fontWeight: "bold",
            color: "#15C1E1",
          }}
        >
          {/* Smooth number animation */}
          <CountUp start={0} end={value} duration={2.5} separator="," />
        </h1>        <h1
          className="text-green-300  text-bold text-md"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {type}
        </h1>
      </div>
    </figure>
  );
};

export default function MarqueeDemo() {
  const [validatorData, setValidatorData] = useState<any>();
  const [operatorData, setOperatorData] = useState<any>();
  const getdata = async (retryCount = 3, delay = 2000) => {
    try {
      const response = await fetch('/api/get-dune-data');
      if (response.status === 500) {
        if (retryCount > 0) {
          console.warn(`Rate limit hit, retrying after ${delay}ms...`);
          setTimeout(() => getdata(retryCount - 1, delay * 2), delay);
        } else {
          console.error('Exceeded retry limit. Please try again later.');
        }
        return;
      }
      const data = await response.json();
      console.log('Data:', data);
      if (data.validator && data.operators) {``
        setValidatorData(data.validator);
        setOperatorData(data.operators);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    getdata()
  }, []);
console.log(validatorData)

  const data = [
    { type: "Registered Validators", value: validatorData?.total_validator.result.rows[0].cumulative_net_additions , days:""},
    { type: "7d Validators Growth", value: validatorData?.sevenDay_validator.result.rows[0]['7d Validator'] , days:"7d"},
    { type: "30d Validators Growth", value: validatorData?.sevenDay_validator.result.rows[0]['30d Validator'],days:"30d" },
    { type: "Operators", value: operatorData?.total_operators.result.rows[0].cumulative_net_additions , days:""},
    { type: "7d Operator  Growth", value: validatorData?.sevenDay_validator.result.rows[0]['7d Operator'] ,days:"7d"},
    { type: "30d Operator Growth", value: validatorData?.sevenDay_validator.result.rows[0]['30d Operator'],days:"30d" },
  ];
  
  return (
    <div className="relative flex h-[250px] w-[100%] ml-[0%] items-center mt-[30px] overflow-hidden bg-background ">
    <Marquee pauseOnHover className="[--duration:20s]">
      {data.map((item) => (
        <DataCard key={item.type} {...item} />
      ))}
    </Marquee>
    {/* Uncomment if you want to add the second row */}
    {/* <Marquee reverse pauseOnHover className="[--duration:20s]">
      {secondRow.map((item) => (
        <DataCard key={item.type} {...item} />
      ))}
    </Marquee> */}
    {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div> */}
   </div>

  );
}
