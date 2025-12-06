'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const { chains, publicClient } = configureChains(
  [polygon, polygonMumbai],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Freepple',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || 'freepple',
  chains
})

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

