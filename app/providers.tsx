'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { polygon, polygonAmoy } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { 
  trustWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
  safeWallet,
  okxWallet,
  zerionWallet,
} from '@rainbow-me/rainbowkit/wallets'
import '@rainbow-me/rainbowkit/styles.css'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || 'freepple'

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        trustWallet({ projectId }),
        metaMaskWallet({ projectId }),
        coinbaseWallet({ appName: 'Freepple' }),
        rainbowWallet({ projectId }),
      ],
    },
    {
      groupName: 'More',
      wallets: [
        walletConnectWallet({ projectId }),
        safeWallet({ projectId }),
        okxWallet({ projectId }),
        zerionWallet({ projectId }),
      ],
    },
  ],
  {
    appName: 'Freepple',
    projectId,
  }
)

const config = createConfig({
  chains: [polygon, polygonAmoy],
  connectors,
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
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

