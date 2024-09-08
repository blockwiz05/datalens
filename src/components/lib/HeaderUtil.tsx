"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { cn } from "../lib/utils";
import React from "react";

interface GradualSpacingProps {
  text: React.ReactNode; // Accept JSX as well as strings
  duration?: number;
  delayMultiple?: number;
  framerProps?: Variants;
  className?: string;
}

export default function GradualSpacing({
  text,
  duration = 0.5,
  delayMultiple = 0.04,
  framerProps = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  className,
}: GradualSpacingProps) {
  // Check if text is a string or JSX element
  const isString = typeof text === "string";

  return (
    <div className="flex justify-center">
      <AnimatePresence mode="wait"> {/* Added mode='wait' for smooth transitions */}
        {isString ? (
          text.split("").map((char, i) => (
            <motion.h1
              key={i}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={framerProps}
              transition={{ duration, delay: i * delayMultiple }}
              className={cn("drop-shadow-sm", className)}
            >
              {char === " " ? <span>&nbsp;</span> : char}
            </motion.h1>
          ))
        ) : (
          <motion.div
            key="custom-text" // Added key to ensure correct re-rendering
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={framerProps}
            transition={{ duration }}
            className={cn("drop-shadow-sm", className)}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
