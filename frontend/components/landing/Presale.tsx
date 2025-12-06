'use client'

import { motion } from 'framer-motion'
import { FaCheck, FaGift, FaUsers } from 'react-icons/fa'
import Link from 'next/link'

export default function Presale() {
  return (
    <section id="presale" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Presale Democratica
          </h2>
          <p className="text-xl text-gray-400">
            €500 per tutti. Nessun VIP. Nessun pacchetto speciale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Presale Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaGift className="text-3xl text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Cosa Ricevi</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <FaCheck className="text-green-400" />
                <span className="text-gray-300">600.000 FRP (con bonus +20%)</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheck className="text-green-400" />
                <span className="text-gray-300">Prezzo: €0.001 per FRP</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheck className="text-green-400" />
                <span className="text-gray-300">Bonus referral: +5% per ogni amico</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheck className="text-green-400" />
                <span className="text-gray-300">Status: Fondatore</span>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-400 mb-2">Investimento</div>
              <div className="text-3xl font-bold text-white">€500</div>
            </div>

            <Link
              href="/presale"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform"
            >
              Partecipa Ora
            </Link>
          </motion.div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaUsers className="text-3xl text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Progresso</h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Raccolto</span>
                  <span className="text-white font-semibold">€0 / €150.000</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full" style={{ width: '0%' }}>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Partecipanti</div>
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-xs text-gray-500">di 300</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Tempo rimasto</div>
                  <div className="text-2xl font-bold text-white">--</div>
                  <div className="text-xs text-gray-500">giorni</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

