'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FaWallet, FaCheckCircle, FaArrowRight } from 'react-icons/fa'
import { updateWalletAddress } from '@/lib/api/auth'

interface WalletTutorialProps {
  userId: string
  currentWalletAddress?: string | null
  onWalletUpdated?: () => void
}

export default function WalletTutorial({ userId, currentWalletAddress, onWalletUpdated }: WalletTutorialProps) {
  const { address, isConnected } = useAccount()
  const [isUpdating, setIsUpdating] = useState(false)
  const [showTutorial, setShowTutorial] = useState(!currentWalletAddress)

  const handleSaveWallet = async () => {
    if (!address) return

    try {
      setIsUpdating(true)
      await updateWalletAddress(userId, address)
      if (onWalletUpdated) {
        onWalletUpdated()
      }
      setShowTutorial(false)
    } catch (error) {
      console.error('Error updating wallet:', error)
      alert('Errore nel salvare il wallet. Riprova.')
    } finally {
      setIsUpdating(false)
    }
  }

  if (!showTutorial && currentWalletAddress) {
    return null
  }

  return (
    <AnimatePresence>
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-br from-violet-950/50 to-fuchsia-950/30 border-2 border-violet-500/30 rounded-3xl p-8 mb-8 shadow-2xl shadow-violet-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <FaWallet className="text-2xl text-violet-400" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-black mb-2 text-white">
                Completa il tuo Profilo
              </h2>
              <p className="text-gray-300 mb-6">
                Connetti il tuo wallet Polygon per ricevere i token FRP dopo il listing. 
                Il processo è semplice e sicuro.
              </p>

              {/* Tutorial Steps */}
              <div className="space-y-4 mb-6">
                <div className={`flex items-start gap-4 p-4 rounded-xl border ${
                  isConnected ? 'bg-green-950/20 border-green-500/30' : 'bg-black/30 border-violet-500/20'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isConnected ? 'bg-green-500/20' : 'bg-violet-500/20'
                  }`}>
                    {isConnected ? (
                      <FaCheckCircle className="text-green-400" />
                    ) : (
                      <span className="text-violet-400 font-bold">1</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">
                      {isConnected ? 'Wallet Connesso ✓' : 'Connetti il tuo Wallet'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {isConnected 
                        ? `Wallet connesso: ${address?.slice(0, 6)}...${address?.slice(-4)}`
                        : 'Clicca sul pulsante "Connetti Wallet" in alto a destra e scegli il tuo wallet preferito (MetaMask, WalletConnect, ecc.)'
                      }
                    </p>
                    {!isConnected && (
                      <div className="mt-3">
                        <ConnectButton.Custom>
                          {({ account, chain, openConnectModal, mounted }) => {
                            return (
                              <button
                                onClick={openConnectModal}
                                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white font-semibold transition-colors text-sm"
                              >
                                Connetti Wallet
                              </button>
                            )
                          }}
                        </ConnectButton.Custom>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`flex items-start gap-4 p-4 rounded-xl border ${
                  currentWalletAddress || (isConnected && address) ? 'bg-green-950/20 border-green-500/30' : 'bg-black/30 border-violet-500/20'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    currentWalletAddress || (isConnected && address) ? 'bg-green-500/20' : 'bg-violet-500/20'
                  }`}>
                    {currentWalletAddress || (isConnected && address) ? (
                      <FaCheckCircle className="text-green-400" />
                    ) : (
                      <span className="text-violet-400 font-bold">2</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">
                      {currentWalletAddress || (isConnected && address) ? 'Wallet Salvato ✓' : 'Salva il Wallet nel Profilo'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {currentWalletAddress || (isConnected && address)
                        ? 'Il tuo wallet è stato salvato con successo nel tuo profilo.'
                        : 'Dopo aver connesso il wallet, clicca sul pulsante qui sotto per salvarlo nel tuo profilo.'
                      }
                    </p>
                    {isConnected && address && !currentWalletAddress && (
                      <button
                        onClick={handleSaveWallet}
                        disabled={isUpdating}
                        className="mt-3 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors text-sm flex items-center gap-2"
                      >
                        {isUpdating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Salvataggio...
                          </>
                        ) : (
                          <>
                            Salva Wallet
                            <FaArrowRight />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className={`flex items-start gap-4 p-4 rounded-xl border ${
                  currentWalletAddress ? 'bg-green-950/20 border-green-500/30' : 'bg-black/30 border-violet-500/20'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    currentWalletAddress ? 'bg-green-500/20' : 'bg-violet-500/20'
                  }`}>
                    {currentWalletAddress ? (
                      <FaCheckCircle className="text-green-400" />
                    ) : (
                      <span className="text-violet-400 font-bold">3</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">
                      {currentWalletAddress ? 'Profilo Completo ✓' : 'Pronto per la Presale'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {currentWalletAddress
                        ? 'Ora puoi partecipare alla presale e ricevere i token FRP direttamente sul tuo wallet dopo il listing.'
                        : 'Una volta salvato il wallet, potrai partecipare alla presale e ricevere i token FRP dopo il listing.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">ℹ️</div>
                  <div className="text-sm text-gray-300 leading-relaxed">
                    <p className="font-bold text-blue-400 mb-2">Importante:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>I token FRP verranno inviati a questo indirizzo dopo il listing</li>
                      <li>Assicurati che sia un wallet su rete <span className="text-violet-400 font-bold">Polygon</span></li>
                      <li>Non usare indirizzi di exchange centralizzati</li>
                      <li>Puoi sempre aggiornare il wallet dal tuo profilo</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              {currentWalletAddress && (
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-colors"
                >
                  Chiudi Tutorial
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

