// 创建PNT数据服务模块
import createDataJson from '../data/created.json';

export interface CreatedPNT {
  id: string;
  tokenId: string;
  contractAddress: string;
  saleAddress: string;
  transactionHash: string;
  blockNumber: number;
  creator: string;
  name: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  totalSupply: string;
  pricePerPNT: string;
  minGoal: string;
  createdAt: string;
  status: 'pending' | 'deployed' | 'failed';
  category: string;
  gasUsed: string;
  platformFee: string;
}

export interface CreateData {
  created: CreatedPNT[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalCreated: number;
    deployedCount: number;
    pendingCount: number;
    categories: string[];
    averageGasUsed: string;
    totalTokensCreated: string;
    nextTokenId: string;
  };
}

export interface CreateFormData {
  name: string;
  description: string;
  totalSupply: string;
  pricePerPNT: string;
  minGoal: string;
  category?: string;
}

export interface BlockchainTransaction {
  transactionHash: string;
  blockNumber: number;
  contractAddress: string;
  saleAddress: string;
  tokenId: string;
  gasUsed: string;
  timestamp: string;
}

// 模拟API响应延迟
const API_DELAY = 2000; // 2秒模拟区块链部署时间

/**
 * 生成假的区块链交易数据
 */
function generateFakeTransaction(): BlockchainTransaction {
  const randomHex = (length: number) => {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  const currentTime = new Date().toISOString();
  const blockNumber = 18745000 + Math.floor(Math.random() * 10000);
  const gasUsed = (2500000 + Math.floor(Math.random() * 500000)).toString();
  
  return {
    transactionHash: randomHex(64),
    blockNumber: blockNumber,
    contractAddress: randomHex(40),
    saleAddress: randomHex(40),
    tokenId: (parseInt((createDataJson as CreateData).metadata.nextTokenId) + Math.floor(Math.random() * 100)).toString(),
    gasUsed: gasUsed,
    timestamp: currentTime
  };
}

/**
 * 模拟创建PNT流程
 * 包含区块链交易和合约部署仿真
 */
export async function simulateCreatePNT(): Promise<{
  success: boolean;
  transaction?: BlockchainTransaction;
  error?: string;
}> {
  // 模拟区块链部署延迟
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  
  // 随机模拟成功/失败（95%成功率）
  const isSuccess = Math.random() > 0.05;
  
  if (!isSuccess) {
    return {
      success: false,
      error: '区块链网络拥堵，请稍后重试'
    };
  }
  
  const transaction = generateFakeTransaction();
  
  // 在真实环境中，这里会调用API保存新创建的PNT数据
  // 当前仅作为演示，实际返回交易信息给前端展示
  // TODO: 在生产环境中实现真实的数据持久化
  
  return {
    success: true,
    transaction: transaction
  };
}

/**
 * 获取用户创建的所有PNT
 */
export async function fetchUserCreatedPNTs(userAddress: string): Promise<CreatedPNT[]> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data = createDataJson as CreateData;
  return data.created.filter(pnt => pnt.creator === userAddress);
}

/**
 * 获取创建统计数据
 */
export async function fetchCreateStats(): Promise<{
  totalCreated: number;
  deployedCount: number;
  pendingCount: number;
  averageGasUsed: string;
  totalTokensCreated: string;
}> {
  const data = createDataJson as CreateData;
  
  return {
    totalCreated: data.metadata.totalCreated,
    deployedCount: data.metadata.deployedCount,
    pendingCount: data.metadata.pendingCount,
    averageGasUsed: data.metadata.averageGasUsed,
    totalTokensCreated: data.metadata.totalTokensCreated
  };
}

/**
 * 根据交易哈希查找PNT
 */
export async function fetchPNTByTxHash(txHash: string): Promise<CreatedPNT | null> {
  const data = createDataJson as CreateData;
  const pnt = data.created.find(pnt => pnt.transactionHash === txHash);
  return pnt || null;
}

/**
 * 模拟获取区块链网络状态
 */
export async function getNetworkStatus(): Promise<{
  status: 'online' | 'congested' | 'offline';
  gasPrice: string;
  blockTime: string;
  lastBlock: number;
}> {
  // 模拟网络状态检查延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const statuses = ['online', 'congested'] as const;
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    status: randomStatus,
    gasPrice: (15 + Math.random() * 10).toFixed(2) + ' gwei',
    blockTime: (12 + Math.random() * 3).toFixed(1) + 's',
    lastBlock: 18745000 + Math.floor(Math.random() * 10000)
  };
}

// 模拟API错误处理
export class CreateApiError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'CreateApiError';
  }
}

/**
 * 将来替换为真实API的配置
 */
export const CREATE_API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  endpoints: {
    create: '/create',
    userPNTs: '/create/user/:address',
    stats: '/create/stats',
    transaction: '/transaction/:hash'
  }
}; 