'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { IoIosHome } from "react-icons/io"
import { usePathname } from 'next/navigation'
import { BiSolidDashboard } from "react-icons/bi"
import { FaUsers } from "react-icons/fa"

export default function Navbar() {
  const [scrolling, setScrolling] = useState(false)
  const [isHomePage, setIsHomePage] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true)
      } else {
        setScrolling(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsHomePage(pathname === "/")
  }, [pathname])

  return (
    <motion.nav
      initial={isHomePage ? { y: -100 } : { y: 0 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`px-4 sm:px-6 lg:px-8 py-4 fixed top-0 left-0 w-full transition-all duration-300 z-50 ${
        scrolling ? "bg-opacity-90 bg-purple-900 backdrop-blur-sm shadow-xl" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" passHref>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 cursor-pointer shadow-2xl rounded-full"
            >
              <Image
                className="rounded-full shadow-2xl "
                src="/icons/logo.jpg"
                alt="Logo"
                width={60}
                height={60}
              />
            </motion.div>
          </Link>

          <div className="flex items-center justify-center space-x-1 sm:space-x-4 bg-opacity-20 bg-white rounded-full py-2 px-3 sm:px-4">
            <NavLink href="/" icon={<IoIosHome />} text="Home" isActive={pathname === "/"} />
            <NavLink href="/dashboard" icon={<BiSolidDashboard />} text="Dashboard" isActive={pathname === "/dashboard"} />
            <NavLink href="/dao" icon={<FaUsers />} text="DAO" isActive={pathname === "/dao"} />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  text: string
  isActive: boolean
}

function NavLink({ href, icon, text, isActive }: NavLinkProps) {
  return (
    <Link href={href} passHref>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`cursor-pointer flex items-center space-x-1 px-3 py-2 rounded-full transition-colors duration-200 ${
          isActive 
            ? "bg-[#15C1E1] text-purple-900 font-bold" 
            : "text-gray-300 hover:bg-purple-800 hover:text-white"
        }`}
      >
        {icon}
        <span className="hidden sm:inline">{text}</span>
      </motion.div>
    </Link>
  )
}
