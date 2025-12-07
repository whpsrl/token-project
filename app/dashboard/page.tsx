'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function DashboardPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState(0)
  const [copied, setCopied] = useState(false)

  // Stats personali (mock data)
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

  // Connect Wallet
  const connectWallet = async () => {
    setIsConnecting(true)
    
    try {
      if (typeof window.ethereum !== 'undefined') {
        // MetaMask/Wallet presente
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        
        const address = accounts[0]
        setWalletAddress(address)
        
        // Verifica network (Polygon)
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        if (chainId !== '0x89') { // 0x89 = 137 = Polygon Mainnet
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x89' }],
            })
          } catch (switchError: any) {
            // Network non aggiunta, la aggiungiamo
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x89',
                  chainName: 'Polygon Mainnet',
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18
                  },
                  rpcUrls: ['https://polygon-rpc.com/'],
                  blockExplorerUrls: ['https://polygonscan.com/']
                }]
              })
            }
          }
        }
        
        // Carica balance (mock per ora)
        loadUserData(address)
      } else {
        alert('Installa MetaMask o un wallet compatibile!')
      }
    } catch (error) {
      console.error('Errore connessione wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect Wallet
  const disconnectWallet = () => {
    setWalletAddress(null)
    setBalance(0)
    setUserStats({
      frpBalance: 0,
      stakedAmount: 0,
      stakingRewards: 0,
      referrals: 0,
      referralEarnings: 0,
      tier: 'Bronze',
      nextTier: 'Silver',
      referralsToNextTier: 50
    })
  }

  // Carica dati utente (mock - da sostituire con chiamate reali)
  const loadUserData = async (address: string) => {
    // Simulazione caricamento dati
    setTimeout(() => {
      setUserStats({
        frpBalance: 600000, // Token presale
        stakedAmount: 0,
        stakingRewards: 0,
        referrals: 3,
        referralEarnings: 18000, // 3% di 3 referral
        tier: 'Bronze',
        nextTier: 'Silver',
        referralsToNextTier: 7
      })
    }, 1000)
  }

  // Copy referral link
  const copyReferralLink = () => {
    const referralLink = `https://freepple.xyz/presale?ref=${walletAddress?.slice(0, 8)}`
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black">FREEPPLE</Link>
          
          <div className="flex items-center gap-4">
            <Link href="/whitepaper" className="text-sm text-gray-400 hover:text-white transition-colors">Whitepaper</Link>
            <Link href="/presale" className="text-sm text-gray-400 hover:text-white transition-colors">Presale</Link>
            
            {walletAddress ? (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-xl text-sm font-mono">
                  {formatAddress(walletAddress)}
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 rounded-xl text-sm transition-all"
                >
                  Disconnetti
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-gray-600 disabled:to-gray-600 rounded-xl font-bold text-sm transition-all"
              >
                {isConnecting ? 'Connessione...' : 'Connetti Wallet'}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {!walletAddress ? (
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

            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-purple-600 hover:from-violet-500 hover:via-fuchsia-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
            >
              {isConnecting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connessione...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Connetti Wallet</span>
                </>
              )}
            </button>

            <div className="mt-12 p-6 bg-white/5 rounded-2xl">
              <h3 className="font-bold mb-4">Wallet Supportati:</h3>
              <div className="flex justify-center gap-6 text-gray-400">
                <div className="text-center">
                  <div className="text-3xl mb-2">🦊</div>
                  <div className="text-sm">MetaMask</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">👛</div>
                  <div className="text-sm">WalletConnect</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌈</div>
                  <div className="text-sm">Rainbow</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-sm">Trust Wallet</div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm text-gray-500">
              Assicurati di essere connesso alla rete <span className="text-violet-400 font-bold">Polygon Mainnet</span>
            </p>
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
                Benvenuto, <span className="text-violet-400">Fondatore</span>
              </h1>
              <p className="text-gray-400">
                Gestisci i tuoi FRP, staking e referral da qui
              </p>
            </motion.div>

            {/* Stats Grid */}
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
                    <span className="text-xl">💎</span>
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
                    <span className="text-xl">🔒</span>
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
                    <span className="text-xl">🎁</span>
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

            {/* Referral Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-violet-950/30 to-fuchsia-950/20 border border-violet-500/20 rounded-3xl p-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-black mb-2">Programma Referral</h2>
                  <p className="text-gray-400">
                    Invita amici e guadagna <span className="text-violet-400 font-bold">3% + 1%</span> su ogni acquisto
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full mb-2">
                    <span className="text-2xl">🏆</span>
                    <span className="font-bold">{userStats.tier}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {userStats.referralsToNextTier} referral a {userStats.nextTier}
                  </div>
                </div>
              </div>

              {/* Referral Link */}
              <div className="bg-black/30 rounded-2xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Il Tuo Link Referral:
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={`https://freepple.xyz/presale?ref=${walletAddress.slice(0, 8)}`}
                    readOnly
                    className="flex-1 px-4 py-3 bg-black/50 border border-violet-500/30 rounded-xl font-mono text-sm text-gray-300"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold transition-all"
                  >
                    {copied ? '✓ Copiato!' : 'Copia'}
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: '💰', label: 'Livello 1', value: '3%' },
                    { icon: '🎁', label: 'Livello 2', value: '1%' },
                    { icon: '👥', label: 'Invitati', value: userStats.referrals },
                    { icon: '💎', label: 'Guadagnati', value: `${userStats.referralEarnings.toLocaleString()} FRP` },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-3 bg-violet-500/10 rounded-xl">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                      <div className="font-bold text-violet-400">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

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

              <a
                href={`https://polygonscan.com/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
              >
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-bold mb-2 group-hover:text-violet-400 transition-colors">Vedi su PolygonScan</h3>
                <p className="text-sm text-gray-500">Esplora transazioni</p>
              </a>

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
