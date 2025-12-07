'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FaHome, FaChartLine, FaUsers } from 'react-icons/fa'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FREEPPLE
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <FaHome />
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <FaChartLine />
              Dashboard
            </Link>
            <Link href="/presale" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <FaUsers />
              Presale
            </Link>
          </div>

          {/* Wallet Connect */}
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}


