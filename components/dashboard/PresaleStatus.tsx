'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCoins, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/api/auth'
import { getUserPresaleStatus } from '@/lib/api/presale'

export default function PresaleStatus() {
  const [presaleData, setPresaleData] = useState({
    hasParticipated: false,
    contribution: 0,
    tokens: 0,
    bonus: 0,
    status: 'not_participated' as 'not_participated' | 'pending' | 'confirmed' | 'failed'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPresaleStatus()
  }, [])

  const loadPresaleStatus = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return

      const contribution = await getUserPresaleStatus(user.id)
      if (contribution) {
        setPresaleData({
          hasParticipated: true,
          contribution: contribution.amount_usdt,
          tokens: contribution.amount_frp,
          bonus: contribution.bonus_frp,
          status: contribution.status
        })
      }
    } catch (error) {
      console.error('Error loading presale status:', error)
    } finally {
      setLoading(false)
    }
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
      ) : presaleData.status === 'failed' ? (
        <div className="text-center py-8">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-2 font-semibold">Transazione Fallita</p>
          <p className="text-gray-400 mb-6">La tua transazione non è andata a buon fine. Riprova.</p>
          <Link
            href="/presale"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform"
          >
            Riprova
          </Link>
        </div>
      ) : presaleData.status === 'pending' ? (
        <div className="space-y-6">
          <div className="bg-black/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaClock className="text-yellow-400 text-2xl" />
              <span className="text-white font-semibold text-lg">In Attesa di Conferma</span>
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

          <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
            <p className="text-sm text-yellow-300">
              La tua transazione è in attesa di conferma sulla blockchain. Aggiorneremo automaticamente lo stato quando sarà confermata.
            </p>
          </div>
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

