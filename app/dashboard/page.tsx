'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { getCurrentUser } from '@/lib/api/auth'
import { getReferralStats } from '@/lib/api/referral'
import ReferralSection from '@/components/dashboard/ReferralSection'
import PresaleStatus from '@/components/dashboard/PresaleStatus'
import DashboardStats from '@/components/dashboard/DashboardStats'
import AirdropProgress from '@/components/dashboard/AirdropProgress'
import WalletTutorial from '@/components/dashboard/WalletTutorial'
import Navbar from '@/components/layout/Navbar'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [referralStats, setReferralStats] = useState({
    level1: 0,
    level2: 0,
    total: 0,
    totalEarned: 0,
    rank: 'none'
  })

  // Stats personali
  const [userStats, setUserStats] = useState({
    frpBalance: 0,
    stakedAmount: 0,
    stakingRewards: 0,
    referrals: 0,
    referralEarnings: 0,
    tier: 'Bronze',
    nextTier: 'Silver',
    referralsToNextTier: 50
  })

  useEffect(() => {
    if (isConnected && address) {
      loadUserData()
    } else {
      setLoading(false)
    }
  }, [isConnected, address])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        
        // Carica statistiche referral
        const stats = await getReferralStats(currentUser.id)
        setReferralStats(stats)
        
        // Aggiorna userStats con dati reali
        setUserStats({
          frpBalance: 0, // Da caricare dal contratto
          stakedAmount: 0,
          stakingRewards: 0,
          referrals: stats.total,
          referralEarnings: stats.totalEarned,
          tier: stats.rank === 'none' ? 'Bronze' : stats.rank.charAt(0).toUpperCase() + stats.rank.slice(1),
          nextTier: getNextTier(stats.rank),
          referralsToNextTier: getReferralsToNextTier(stats.rank, stats.level1, stats.level2)
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNextTier = (rank: string): string => {
    const tiers = ['none', 'bronze', 'silver', 'gold', 'diamond', 'ambassador']
    const currentIndex = tiers.indexOf(rank.toLowerCase())
    if (currentIndex < tiers.length - 1) {
      return tiers[currentIndex + 1].charAt(0).toUpperCase() + tiers[currentIndex + 1].slice(1)
    }
    return 'Max'
  }

  const getReferralsToNextTier = (rank: string, level1: number, level2: number): number => {
    const requirements: Record<string, { l1: number; l2: number }> = {
      'none': { l1: 5, l2: 0 },
      'bronze': { l1: 20, l2: 50 },
      'silver': { l1: 50, l2: 150 },
      'gold': { l1: 150, l2: 500 },
      'diamond': { l1: 500, l2: 2000 }
    }
    
    const next = requirements[rank.toLowerCase()]
    if (!next) return 0
    
    const neededL1 = Math.max(0, next.l1 - level1)
    const neededL2 = Math.max(0, next.l2 - level2)
    return neededL1 + neededL2
  }

  // Formato indirizzo breve
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 pt-32">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Caricamento...</p>
          </div>
        ) : !isConnected ? (
          /* Connect Wallet Screen */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h1 className="text-5xl font-black mb-4">Dashboard</h1>
              <p className="text-xl text-gray-400">
                Connetti il tuo wallet per accedere al tuo account Freepple
              </p>
            </div>

            <p className="mt-8 text-sm text-gray-500">
              Usa il pulsante "Connetti Wallet" in alto a destra
            </p>
          </motion.div>
        ) : !user ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="mb-8">
              <h1 className="text-5xl font-black mb-4">Registrazione Richiesta</h1>
              <p className="text-xl text-gray-400 mb-8">
                Devi registrarti per accedere alla dashboard
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-purple-600 hover:from-violet-500 hover:via-fuchsia-400 hover:to-purple-500 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
              >
                Registrati Ora
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Dashboard Content */
          <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-black mb-2">
                Benvenuto, <span className="text-violet-400">{user.nome || 'Fondatore'}</span>
              </h1>
              <p className="text-gray-400">
                Gestisci i tuoi FRP, staking e referral da qui
              </p>
            </motion.div>

            {/* Wallet Tutorial - Mostra se non ha wallet salvato */}
            <WalletTutorial 
              userId={user.id} 
              currentWalletAddress={user.wallet_address}
              onWalletUpdated={loadUserData}
            />

            {/* Presale Status */}
            <PresaleStatus />

            {/* Stats Grid */}
            <DashboardStats userStats={userStats} />

            {/* Airdrop Progress */}
            <AirdropProgress userId={user.id} />

            {/* Referral Section - Gestione Completa Affiliati */}
            <ReferralSection />

            {/* Staking Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-fuchsia-950/30 to-purple-950/20 border border-fuchsia-500/20 rounded-3xl p-8"
            >
              <h2 className="text-3xl font-black mb-6">Staking (Coming Soon)</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/30 rounded-2xl p-6">
                  <h3 className="font-bold mb-4">Info Staking</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">APY Base:</span>
                      <span className="font-bold text-fuchsia-400">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">APY Max (1 anno):</span>
                      <span className="font-bold text-fuchsia-400">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lock Period:</span>
                      <span className="font-bold">Nessuno</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Claim Rewards:</span>
                      <span className="font-bold">Ogni giorno</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-2xl p-6 flex flex-col justify-center items-center">
                  <div className="text-5xl mb-4">🔒</div>
                  <h3 className="font-bold text-xl mb-2">Staking Disponibile Presto</h3>
                  <p className="text-sm text-gray-400 text-center mb-4">
                    Lo staking sarà attivo dopo il listing DEX
                  </p>
                  <div className="text-xs text-gray-600">
                    Previsto: Marzo 2025
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid md:grid-cols-3 gap-4"
            >
              <Link
                href="/presale"
                className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
              >
                <div className="text-3xl mb-3">🎟️</div>
                <h3 className="font-bold mb-2 group-hover:text-violet-400 transition-colors">Compra Altri FRP</h3>
                <p className="text-sm text-gray-500">Presale ancora aperta</p>
              </Link>

              {address && (
              <a
                href={`https://polygonscan.com/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
              >
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-bold mb-2 group-hover:text-violet-400 transition-colors">Vedi su PolygonScan</h3>
                <p className="text-sm text-gray-500">Esplora transazioni</p>
              </a>
              )}

              <Link
                href="/whitepaper"
                className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
              >
                <div className="text-3xl mb-3">📄</div>
                <h3 className="font-bold mb-2 group-hover:text-violet-400 transition-colors">Whitepaper</h3>
                <p className="text-sm text-gray-500">Leggi la documentazione</p>
              </Link>
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-sm text-gray-600">
            © 2025 Freepple • Free the People. Free the Future.
          </div>
        </div>
      </footer>
    </div>
  )
}
