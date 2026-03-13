import React from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { sepolia } from 'wagmi/chains'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID as string | undefined

const metadata = {
  name: 'ME.ai ZK Demo',
  description: 'Small zk demo for client meeting',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

const networks = [sepolia]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: projectId ?? 'missing-project-id',
  ssr: false,
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: projectId ?? 'missing-project-id',
  metadata,
  features: {
    analytics: false,
  },
  themeVariables: {
    "--apkt-accent": "#ff0000",
    "--apkt-color-mix": "#ff0000",
    "--apkt-color-mix-strength": 0
  }
})

const queryClient = new QueryClient()

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WagmiProvider>
)

