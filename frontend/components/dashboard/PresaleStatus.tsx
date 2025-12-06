'use client'

import { motion } from 'framer-motion'
import { FaCoins, FaCheckCircle, FaClock } from 'react-icons/fa'
import Link from 'next/link'

export default function PresaleStatus() {
  // TODO: Fetch from API/Contract
  const presaleData = {
    hasParticipated: false,
    contribution: 0,
    tokens: 0,
    bonus: 0,
    status: 'not_participated' // not_participated, pending, confirmed
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30"
    >
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
        <FaCoins className="text-purple-400" />
        Il Tuo Status Presale
      </h2>

      {presaleData.status === 'not_participated' ? (
        <div className="text-center py-8">
          <FaClock className="text-6xl text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">Non hai ancora partecipato alla presale</p>
          <Link
            href="/presale"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform"
          >
            Partecipa Ora
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-black/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-green-400 text-2xl" />
              <span className="text-white font-semibold text-lg">Partecipazione Confermata</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Contributo</div>
                <div className="text-2xl font-bold text-white">€{presaleData.contribution.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Token Base</div>
                <div className="text-2xl font-bold text-purple-400">{presaleData.tokens.toLocaleString()} FRP</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Bonus</div>
                <div className="text-2xl font-bold text-green-400">+{presaleData.bonus.toLocaleString()} FRP</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Totale</div>
                <div className="text-2xl font-bold text-yellow-400">{(presaleData.tokens + presaleData.bonus).toLocaleString()} FRP</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
            <p className="text-sm text-gray-300">
              I tuoi token verranno distribuiti al momento del lancio. Riceverai una notifica quando saranno disponibili.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

