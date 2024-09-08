import React from 'react';
import MarqueeDemo from "../components/magicui/MarqueeDemo";
import NumberTicker from './lib/Count';
import NumberTickerDemo from './magicui/NumberTickerDemo';
import { GradualSpacingDemo } from './magicui/GradualSpacingDemo';
import { FlipTextDemo } from './magicui/FlipTextDemo';
import ValidatorsTable from './ValidatorsTable';
import UniqueMovingGraph from './UniqueMovingGraph';
import DataTable from './OperatorTable';

export default function Hero() {
  return (
    <div
      className='flex justify-center flex-col items-center'
      style={{
        height: "100vh",
      }}
    >
      <UniqueMovingGraph />
      
      {/* Centered container for GradualSpacingDemo and FlipTextDemo */}
      <div
        style={{
          backgroundColor: 'rgba(225, 225,225, 0.3)', // White with 30% opacity
          backdropFilter: 'blur(5px)', 
          padding: '30px 100px ', // Add padding for a cleaner look
          borderRadius: '2rem', // Optional: Rounded corners for the background
          maxWidth: '100%',
          zIndex:"11", // Limit the width of the container
        }}
        className="flex flex-col justify-center items-center mt-[100px]"
      >
        <GradualSpacingDemo />
        <FlipTextDemo />
      </div>
      
      <MarqueeDemo />
    </div>
  );
}
