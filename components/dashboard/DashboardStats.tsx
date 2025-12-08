'use client'

import { motion } from 'framer-motion'
import { FaCoins, FaChartLine, FaGift, FaLock } from 'react-icons/fa'

interface DashboardStatsProps {
  userStats: {
    frpBalance: number
    stakedAmount: number
    stakingRewards: number
    referrals: number
    referralEarnings: number
    tier: string
    nextTier: string
    referralsToNextTier: number
  }
}

export default function DashboardStats({ userStats }: DashboardStatsProps) {

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-violet-950/50 to-violet-900/30 border border-violet-500/30 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400 font-medium">FRP Balance</h3>
          <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center">
            <FaCoins className="text-violet-400" />
          </div>
        </div>
        <div className="text-3xl font-black text-violet-400 mb-2">
          {userStats.frpBalance.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">
          ≈ €{(userStats.frpBalance * 0.001).toLocaleString()}
        </div>
      </motion.div>

      {/* Staking Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-fuchsia-950/50 to-fuchsia-900/30 border border-fuchsia-500/30 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400 font-medium">In Staking</h3>
          <div className="w-10 h-10 bg-fuchsia-500/20 rounded-full flex items-center justify-center">
            <FaLock className="text-fuchsia-400" />
          </div>
        </div>
        <div className="text-3xl font-black text-fuchsia-400 mb-2">
          {userStats.stakedAmount.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">
          Rewards: {userStats.stakingRewards.toLocaleString()} FRP
        </div>
      </motion.div>

      {/* Referral Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-green-950/50 to-green-900/30 border border-green-500/30 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-400 font-medium">Referral Earnings</h3>
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <FaGift className="text-green-400" />
          </div>
        </div>
        <div className="text-3xl font-black text-green-400 mb-2">
          {userStats.referralEarnings.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">
          {userStats.referrals} amici invitati
        </div>
      </motion.div>
    </div>
  )
}


