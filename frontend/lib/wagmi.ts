import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, walletConnect } from '@wagmi/connectors';

// 定义本地Anvil链配置
export const anvil = {
  id: 31337,
  name: 'Anvil',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: { name: 'Local', url: 'http://localhost:8545' },
  },
  testnet: true,
} as const;

// 配置支持的链
const chains = [anvil, sepolia] as const;

// 创建Wagmi配置
export const config = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'd0a8709ac267c538f3836a20d4aa96fd',
      showQrModal: true,
    }),
  ],
  transports: {
    [anvil.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 
      'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    ),
  },
  ssr: true,
}); 