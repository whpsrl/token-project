'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance, useContractWrite, useWaitForTransactionReceipt } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { parseEther, formatEther } from 'viem'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import toast from 'react-hot-toast'
import { getCurrentUser } from '@/lib/api/auth'
import { createPresaleContribution, confirmPresaleContribution, getPresaleStats } from '@/lib/api/presale'

// TODO: Replace with actual contract ABI
const PRESALE_ABI = [
  {
    name: 'contribute',
    type: 'function',
    stateMutability: 'payable',
    inputs: [],
    outputs: []
  }
]

export default function PresalePage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [amount, setAmount] = useState('500')
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '')
  const [presaleStats, setPresaleStats] = useState({ totalRaised: 0, participants: 0 })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadUser()
    loadPresaleStats()
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/auth/login?redirect=/presale')
        return
      }
      setUser(currentUser)
      if (!referralCode && currentUser.referred_by) {
        setReferralCode(currentUser.referred_by)
      }
    } catch (error) {
      router.push('/auth/login?redirect=/presale')
    }
  }

  const loadPresaleStats = async () => {
    try {
      const stats = await getPresaleStats()
      setPresaleStats(stats)
    } catch (error) {
      console.error('Error loading presale stats:', error)
    }
  }

  // Get USDT balance
  const { data: balance } = useBalance({
    address,
    token: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' // USDT on Polygon
  })

  // Presale contribution
  const { write, data, isLoading } = useContractWrite({
    address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT as `0x${string}`,
    abi: PRESALE_ABI,
    functionName: 'contribute',
    value: amount ? parseEther(amount) : undefined,
    onSuccess: () => {
      toast.success('Transazione inviata!')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data?.hash,
  })

  const handleContribute = async () => {
    if (!isConnected) {
      toast.error('Connetti il tuo wallet')
      return
    }
    if (!user) {
      toast.error('Devi essere registrato')
      router.push('/auth/login?redirect=/presale')
      return
    }
    if (!amount || parseFloat(amount) < 500 || parseFloat(amount) > 500) {
      toast.error('Importo deve essere esattamente €500')
      return
    }
    if (!address) {
      toast.error('Wallet non connesso')
      return
    }

    try {
      // Crea record nel database
      const contribution = await createPresaleContribution(
        user.id,
        address,
        parseFloat(amount),
        referralCode || undefined
      )

      // Poi esegui transazione blockchain
      write?.()
    } catch (error: any) {
      toast.error(error.message || 'Errore nella creazione del contributo')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Presale Freepple
          </h1>
          <p className="text-xl text-gray-400">
            €500 per tutti. Diventa fondatore.
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700">
            <p className="text-gray-400 mb-6">Connetti il tuo wallet per partecipare</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contribution Form */}
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-white">Partecipa</h2>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Importo (USDT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="500"
                    step="1"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-2xl font-bold"
                    placeholder="500"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    USDT
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Minimo: €500 | Massimo: €500
                </p>
              </div>

              {/* Referral Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Codice Referral (opzionale)
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  placeholder="FRP-XXXXX"
                />
              </div>

              {/* Balance */}
              {balance && (
                <div className="mb-6 p-4 bg-black/30 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Saldo USDT:</span>
                    <span className="text-white font-semibold">
                      {parseFloat(formatEther(balance.value)).toFixed(2)} USDT
                    </span>
                  </div>
                </div>
              )}

              {/* What You Get */}
              <div className="mb-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <h3 className="font-semibold text-white mb-3">Cosa Ricevi:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Token base:</span>
                    <span className="text-purple-400 font-semibold">
                      {amount ? (parseFloat(amount) * 1000).toLocaleString() : '0'} FRP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bonus 20%:</span>
                    <span className="text-green-400 font-semibold">
                      +{amount ? (parseFloat(amount) * 200).toLocaleString() : '0'} FRP
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-purple-500/30">
                    <span className="text-white font-semibold">Totale:</span>
                    <span className="text-yellow-400 font-bold text-lg">
                      {amount ? (parseFloat(amount) * 1200).toLocaleString() : '0'} FRP
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleContribute}
                disabled={isLoading || isConfirming || !amount || parseFloat(amount) < 500}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading || isConfirming
                  ? 'Elaborazione...'
                  : isSuccess
                  ? 'Completato!'
                  : 'Partecipa alla Presale'}
              </button>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-white">Info Presale</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Prezzo: €0.001 per FRP</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Bonus: +20% per partecipanti</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Referral: +5% per ogni amico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Pagamento: USDT (Polygon)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Token distribuiti al lancio</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold mb-4 text-white">Progresso</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Raccolto</span>
                      <span className="text-white font-semibold">
                        €{presaleStats.totalRaised.toLocaleString()} / €150.000
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min((presaleStats.totalRaised / 150000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Partecipanti</div>
                      <div className="text-2xl font-bold text-white">{presaleStats.participants}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Obiettivo</div>
                      <div className="text-2xl font-bold text-white">300</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

