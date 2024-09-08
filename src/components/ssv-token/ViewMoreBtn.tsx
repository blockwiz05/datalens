"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ViewMoreBtn() {
  return (
    <Link href="/dao" passHref>
      <div className="relative h-[50px] w-[180px] rounded-full">
        <motion.button
          className="h-full w-full cursor-pointer border border-[#91C9FF] bg-transparent text-white transition-colors duration-1000 ease-in-out hover:bg-[rgba(249,250,251,0.1)]"
          whileHover="hover"
        >
          <motion.svg
            width="180"
            height="50"
            viewBox="0 0 180 50"
            className="absolute left-0 top-0"
            initial={{
              fill: "none",
              stroke: "#fff",
              strokeDasharray: "150 480",
              strokeDashoffset: 150,
            }}
            variants={{
              hover: {
                strokeDashoffset: -480,
                transition: { duration: 1, ease: "easeInOut" },
              },
            }}
          >
            <motion.polyline points="179,1 179,59 1,59 1,1 179,1" />
          </motion.svg>
          <span className="relative z-10 text-lg font-bold">View More</span>
        </motion.button>
      </div>
    </Link>
  );
}
