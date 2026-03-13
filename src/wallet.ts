import EthereumProvider from '@walletconnect/ethereum-provider'

export type WalletType = 'metamask' | 'walletconnect'

export interface WalletConnection {
  type: WalletType
  address: string
  chainId: number
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on?: (event: string, handler: (...args: any[]) => void) => void
      removeListener?: (event: string, handler: (...args: any[]) => void) => void
    }
  }
}

export async function connectMetaMask(): Promise<WalletConnection> {
  if (!window.ethereum) {
    throw new Error('MetaMask not found. Please install MetaMask and try again.')
  }

  const accounts = (await window.ethereum.request({
    method: 'eth_requestAccounts',
  })) as string[]

  const chainIdHex = (await window.ethereum.request({
    method: 'eth_chainId',
  })) as string

  const chainId = parseInt(chainIdHex, 16)

  return {
    type: 'metamask',
    address: accounts[0],
    chainId,
  }
}

let wcProvider: EthereumProvider | null = null

export async function connectWalletConnect(
  projectId: string,
): Promise<WalletConnection> {
  if (!projectId) {
    throw new Error('Missing WalletConnect project ID.')
  }

  if (!wcProvider) {
    wcProvider = await EthereumProvider.init({
      projectId,
      showQrModal: true,
      chains: [11155111], // Sepolia
      optionalChains: [1],
      metadata: {
        name: 'ME.ai POC',
        description: 'Sovereign data vault demo',
        url: 'https://me-ai-poc.local',
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
      },
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-accent-color': '#ef4444',
          '--wcm-accent-fill-color': '#111111',
          '--wcm-background-color': '#050505',
          '--wcm-font-family': 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
          '--wcm-text-big-bold-size': '18px',
          '--wcm-z-index': '9999',
        },
      },
    })
  }

  await wcProvider.enable()

  const accounts = (await wcProvider.request({
    method: 'eth_accounts',
  })) as string[]

  const chainId = (await wcProvider.request({
    method: 'eth_chainId',
  })) as number

  return {
    type: 'walletconnect',
    address: accounts[0],
    chainId,
  }
}

