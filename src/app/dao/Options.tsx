'use client'

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import NetworkGrowth from "../dashboard/NetworkGrowth"
import FailedTransaction from "../dashboard/FailedTransaction"
import NetworkDistribution from "../dashboard/NetworkDistribution"
import Liquidation from "../dashboard/Liquidation"

interface Option {
  id: number
  name: string
}

export default function Options() {
  const optionsArray: Option[] = [
    { id: 1, name: "Network Growth" },
    { id: 2, name: "Failed Transaction" },
    { id: 3, name: "Network Distribution" },
    { id: 4, name: "Liquidation" },
  ]

  const [selectedOption, setSelectedOption] = useState<number>(optionsArray[0].id)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleOptionClick = (id: number) => {
    setSelectedOption(id)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 1:
        return <NetworkGrowth />
      case 2:
        return <FailedTransaction />
      case 3:
        return <NetworkDistribution />
      case 4:
        return <Liquidation />
      default:
        return null
    }
  }

  return (
    <>
      <div className="w-full flex justify-end p-4">
        <div className="relative inline-block text-left w-64" ref={dropdownRef}>
          <motion.div
            className="w-full py-2 px-4 bg-opacity-20 bg-purple-900 border border-purple-600 rounded-lg shadow-lg focus:outline-none focus:ring focus:border-teal-300 transition-all duration-300 ease-in-out cursor-pointer flex justify-between items-center"
            onClick={toggleDropdown}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white">{optionsArray.find(option => option.id === selectedOption)?.name}</span>
            <ChevronDown className={`ml-2 h-5 w-5 text-teal-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </motion.div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 right-0 mt-1 w-full bg-purple-900 border border-purple-600 rounded-lg shadow-lg overflow-hidden"
              >
                {optionsArray.map((option) => (
                  <motion.div
                    key={option.id}
                    className="px-4 py-2 hover:bg-purple-800 cursor-pointer transition-colors duration-200 text-white"
                    onClick={() => handleOptionClick(option.id)}
                    whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.3)" }}
                  >
                    {option.name}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        key={selectedOption}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8"
      >
        {renderSelectedComponent()}
      </motion.div>
    </>
  )
}