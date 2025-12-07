'use client'

import { useAccount } from 'wagmi'
import { FaCoins, FaChartLine, FaGift } from 'react-icons/fa'

export default function DashboardStats() {
  const { address } = useAccount()

  // TODO: Fetch from API/Contract
  const stats = {
    totalFRP: 0,
    presaleFRP: 0,
    airdropFRP: 0,
    stakingFRP: 0,
    totalValue: 0,
    referrals: 0
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <FaCoins className="text-3xl text-purple-400" />
          <span className="text-sm text-gray-400">Totale FRP</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {stats.totalFRP.toLocaleString()}
        </div>
        <div className="text-sm text-gray-400">
          ≈ €{(stats.totalValue).toFixed(2)}
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <FaChartLine className="text-3xl text-green-400" />
          <span className="text-sm text-gray-400">Referral</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {stats.referrals}
        </div>
        <div className="text-sm text-gray-400">
          Attivi
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <FaGift className="text-3xl text-yellow-400" />
          <span className="text-sm text-gray-400">Airdrop</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {stats.airdropFRP.toLocaleString()}
        </div>
        <div className="text-sm text-gray-400">
          FRP ricevuti
        </div>
      </div>
    </div>
  )
}


