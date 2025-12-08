'use client'

import { useState, useEffect } from 'react'
import { FaCopy, FaShareAlt, FaUsers, FaCoins } from 'react-icons/fa'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { getCurrentUser } from '@/lib/api/auth'
import { getReferralStats } from '@/lib/api/referral'

export default function ReferralSection() {
  const [referralCode, setReferralCode] = useState<string>('')
  const [referralLink, setReferralLink] = useState<string>('')
  const [stats, setStats] = useState({
    totalReferrals: 0,
    level1: 0,
    level2: 0,
    totalEarned: 0,
    rank: 'none'
  })

  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return

      setReferralCode(user.referral_code)
      setReferralLink(`${window.location.origin}/presale?ref=${user.referral_code}`)

      const referralStats = await getReferralStats(user.id)
      setStats({
        totalReferrals: referralStats.total,
        level1: referralStats.level1,
        level2: referralStats.level2,
        totalEarned: referralStats.totalEarned,
        rank: referralStats.rank
      })
    } catch (error) {
      console.error('Error loading referral data:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiato!')
  }

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Unisciti a Freepple! ${referralLink}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Unisciti a Freepple! ${referralLink}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
        <FaUsers className="text-purple-400" />
        Programma Referral
      </h2>

      {/* Referral Link */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Il tuo link referral
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          />
          <button
            onClick={() => copyToClipboard(referralLink)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors flex items-center gap-2"
          >
            <FaCopy />
            Copia
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Condividi
        </label>
        <div className="flex gap-3">
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors text-center"
          >
            WhatsApp
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors text-center"
          >
            Twitter
          </a>
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-semibold transition-colors text-center"
          >
            Telegram
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Referral L1</div>
          <div className="text-2xl font-bold text-white">{stats.level1}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Referral L2</div>
          <div className="text-2xl font-bold text-white">{stats.level2}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Guadagnato</div>
          <div className="text-2xl font-bold text-purple-400">{stats.totalEarned.toLocaleString()} FRP</div>
        </div>
        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Rank</div>
          <div className="text-2xl font-bold text-yellow-400">
            {stats.rank === 'none' ? '-' : stats.rank.charAt(0).toUpperCase() + stats.rank.slice(1)}
          </div>
        </div>
      </div>

      {/* Commissioni */}
      <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30 mb-6">
        <h3 className="font-semibold text-white mb-2">Commissioni</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Livello 1 (tuoi referral):</span>
            <span className="font-semibold text-purple-400">3%</span>
          </div>
          <div className="flex justify-between">
            <span>Livello 2 (referral dei tuoi referral):</span>
            <span className="font-semibold text-purple-400">1%</span>
          </div>
        </div>
      </div>

      {/* Sistema Rank */}
      <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-lg p-6 border border-yellow-500/30 mb-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Sistema Rank
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {[
            { name: 'Bronze', req: '5 L1', icon: '🥉' },
            { name: 'Silver', req: '20 L1 + 50 L2', icon: '🥈' },
            { name: 'Gold', req: '50 L1 + 150 L2', icon: '🥇' },
            { name: 'Diamond', req: '150 L1 + 500 L2', icon: '💎' },
            { name: 'Ambassador', req: '500 L1 + 2000 L2', icon: '👑' },
          ].map((tier, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border ${
                stats.rank.toLowerCase() === tier.name.toLowerCase()
                  ? 'bg-yellow-500/20 border-yellow-500/50'
                  : 'bg-black/30 border-gray-700'
              }`}
            >
              <div className="text-xl mb-1">{tier.icon}</div>
              <div className="font-bold text-white mb-1">{tier.name}</div>
              <div className="text-gray-400 text-[10px]">{tier.req}</div>
            </div>
          ))}
        </div>
        {stats.rank !== 'none' && (
          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <div className="text-sm text-gray-300">
              Il tuo rank attuale: <span className="font-bold text-yellow-400 capitalize">{stats.rank}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Ricevi bonus dalla pool rank (30% delle sell tax)
            </div>
          </div>
        )}
      </div>

      {/* Lista Referral */}
      {stats.totalReferrals > 0 && (
        <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FaUsers className="text-purple-400" />
            I Tuoi Referral ({stats.totalReferrals})
          </h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-400 mb-2">
              I tuoi referral di livello 1: <span className="text-white font-bold">{stats.level1}</span>
            </div>
            <div className="text-sm text-gray-400 mb-4">
              I tuoi referral di livello 2: <span className="text-white font-bold">{stats.level2}</span>
            </div>
            <div className="p-4 bg-purple-900/10 rounded-lg border border-purple-500/20">
              <div className="text-xs text-gray-400 mb-2">Guadagni Totali</div>
              <div className="text-2xl font-bold text-purple-400">
                {stats.totalEarned.toLocaleString()} FRP
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ≈ €{(stats.totalEarned * 0.001).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

