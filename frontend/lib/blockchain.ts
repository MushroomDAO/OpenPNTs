// 区块链相关工具函数

export type Network = 'mainnet' | 'sepolia' | 'localhost';

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  explorerName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// 网络配置
export const NETWORKS: Record<Network, NetworkConfig> = {
  mainnet: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io',
    explorerName: 'Etherscan',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/',
    explorerUrl: 'https://sepolia.etherscan.io',
    explorerName: 'Sepolia Etherscan',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  localhost: {
    name: 'Anvil Local',
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    explorerUrl: '', // 本地没有区块浏览器
    explorerName: 'Local Explorer',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

// 从环境变量获取当前网络
export function getCurrentNetwork(): Network {
  const network = process.env.NEXT_PUBLIC_NETWORK as Network;
  return network && network in NETWORKS ? network : 'localhost';
}

// 获取当前网络配置
export function getNetworkConfig(): NetworkConfig {
  return NETWORKS[getCurrentNetwork()];
}

// 生成交易链接
export function getTransactionUrl(txHash: string, network?: Network): string | null {
  const net = network || getCurrentNetwork();
  const config = NETWORKS[net];
  
  if (!config.explorerUrl) {
    return null; // 本地网络没有区块浏览器
  }
  
  return `${config.explorerUrl}/tx/${txHash}`;
}

// 生成地址链接
export function getAddressUrl(address: string, network?: Network): string | null {
  const net = network || getCurrentNetwork();
  const config = NETWORKS[net];
  
  if (!config.explorerUrl) {
    return null;
  }
  
  return `${config.explorerUrl}/address/${address}`;
}

// 生成代币链接
export function getTokenUrl(tokenAddress: string, network?: Network): string | null {
  const net = network || getCurrentNetwork();
  const config = NETWORKS[net];
  
  if (!config.explorerUrl) {
    return null;
  }
  
  return `${config.explorerUrl}/token/${tokenAddress}`;
}

// 格式化交易哈希（显示缩短版本）
export function formatTxHash(txHash: string): string {
  if (!txHash || txHash.length < 10) return txHash;
  return `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;
}

// 格式化地址（显示缩短版本）
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// 检查是否为有效的交易哈希
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

// 检查是否为有效的以太坊地址
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// 模拟交易哈希生成（用于演示）
export function generateMockTxHash(): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 模拟合约地址生成（用于演示）
export function generateMockAddress(): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 40; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 交易状态类型
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

// 交易信息接口
export interface TransactionInfo {
  hash: string;
  status: TransactionStatus;
  blockNumber?: number;
  timestamp?: number;
  gasUsed?: string;
  gasPrice?: string;
  from?: string;
  to?: string;
  value?: string;
}

// 模拟获取交易信息（生产环境中应该调用实际的RPC）
export async function getTransactionInfo(txHash: string): Promise<TransactionInfo | null> {
  if (!isValidTxHash(txHash)) {
    return null;
  }
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 模拟交易信息
  return {
    hash: txHash,
    status: 'confirmed',
    blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
    timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600),
    gasUsed: '21000',
    gasPrice: '20000000000',
    from: generateMockAddress(),
    to: generateMockAddress(),
    value: '0',
  };
}

// React组件请使用 components/BlockchainLinks.tsx 