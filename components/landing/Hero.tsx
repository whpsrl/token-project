'use client'

import { motion } from 'framer-motion'
import { FaRocket, FaCoins } from 'react-icons/fa'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo/Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 mb-8"
          >
            <FaCoins className="text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Presale Aperta - €500 per tutti
            </span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            FREEPPLE
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-4">
            La Crypto con un Motore Reale
          </p>
          
          <p className="text-xl md:text-2xl text-purple-300 mb-8 font-semibold">
            €10.000/mese di attività produttiva
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">€500</div>
              <div className="text-gray-400">Presale per tutti</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">€10K</div>
              <div className="text-gray-400">Al mese di attività</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">200-300</div>
              <div className="text-gray-400">Fondatori cercati</div>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/presale"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white hover:scale-105 transition-transform duration-200 shadow-lg shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaRocket />
                Partecipa alla Presale
              </span>
            </Link>
            
            <Link
              href="/whitepaper"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Leggi Whitepaper
            </Link>
            
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Vai alla Dashboard
            </Link>
          </div>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-xl text-gray-400 italic"
          >
            "Free the People. Free the Future."
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}


