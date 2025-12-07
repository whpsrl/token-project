'use client'

import { WagmiProvider } from 'wagmi'
import { polygon, polygonAmoy } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

// getDefaultConfig include già:
// - MetaMask
// - Coinbase Wallet
// - WalletConnect (che supporta Trust Wallet e molti altri wallet mobile)
// - Rainbow Wallet
// - E altri wallet popolari
const config = getDefaultConfig({
  appName: 'Freepple',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || 'freepple',
  chains: [polygon, polygonAmoy],
  ssr: true,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

