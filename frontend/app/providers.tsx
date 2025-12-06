'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { polygon, polygonAmoy } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const { wallets } = getDefaultWallets({
  appName: 'Freepple',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || 'freepple',
})

const config = createConfig({
  chains: [polygon, polygonAmoy],
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
  connectors: wallets.map((wallet) => wallet.connector),
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

