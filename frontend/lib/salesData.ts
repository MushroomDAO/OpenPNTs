// 销售数据服务模块
import salesDataJson from '../data/sales.json';
import createDataJson from '../data/created.json';
import { CreateData, CreatedPNT } from './createData';

export interface PNTSale {
  id: string;
  address: string;
  name: {
    zh: string;
    en: string;
  };
  issuer: string;
  description: {
    zh: string;
    en: string;
  };
  status: 'Active' | 'Pending' | 'Successful' | 'Failed' | 'Closed';
  pricePerPNT: string;
  totalSupply: string;
  soldAmount: string;
  targetAmount: string;
  endTime: string;
  participants: number;
  category: string;
}

export interface SalesData {
  sales: PNTSale[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalProjects: number;
    activeProjects: number;
    categories: string[];
  };
}

export interface SalesApiResponse {
  data: PNTSale[];
  total: number;
  activeCount: number;
  categories: string[];
}

// 模拟API响应延迟
const API_DELAY = 800;

/**
 * 将创建的PNT转换为销售格式
 */
function convertCreatedPNTToSale(created: CreatedPNT): PNTSale {
  // 模拟预售开始时间和结束时间
  const startDate = new Date(created.createdAt);
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30天后结束
  
  // 模拟销售进度
  const totalSupplyNum = parseInt(created.totalSupply);
  const soldAmount = Math.floor(totalSupplyNum * Math.random() * 0.3); // 0-30% 的销售进度
  const targetAmount = Math.floor(totalSupplyNum * 0.5); // 目标是50%的代币
  
  return {
    id: created.id,
    address: created.saleAddress,
    name: created.name,
    issuer: created.creator,
    description: created.description,
    status: created.status === 'deployed' ? 'Active' : 
            created.status === 'pending' ? 'Pending' : 'Failed',
    pricePerPNT: created.pricePerPNT,
    totalSupply: created.totalSupply,
    soldAmount: soldAmount.toString(),
    targetAmount: targetAmount.toString(),
    endTime: endDate.toLocaleDateString(),
    participants: Math.floor(Math.random() * 50) + 1, // 1-50个参与者
    category: created.category
  };
}

/**
 * 获取所有销售数据（包括静态数据和新创建的PNT）
 * 模拟API调用，为将来真实API集成做准备
 */
export async function fetchSalesData(): Promise<SalesApiResponse> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  
  const staticSalesData = salesDataJson as SalesData;
  const createdData = createDataJson as CreateData;
  
  // 转换创建的PNT为销售格式
  const createdSales = createdData.created
    .filter(created => created.status === 'deployed') // 只包含已部署的
    .map(convertCreatedPNTToSale);
  
  // 合并静态数据和动态创建的数据
  const allSales = [...staticSalesData.sales, ...createdSales];
  
  // 计算统计信息
  const activeCount = allSales.filter(sale => sale.status === 'Active').length;
  const totalCount = allSales.length;
  
  // 获取所有可能的分类
  const allCategories = [...new Set([
    ...staticSalesData.metadata.categories,
    ...createdSales.map(sale => sale.category)
  ])];
  
  return {
    data: allSales,
    total: totalCount,
    activeCount: activeCount,
    categories: allCategories
  };
}

/**
 * 根据分类过滤销售数据
 */
export async function fetchSalesByCategory(category: string): Promise<SalesApiResponse> {
  const allData = await fetchSalesData();
  
  if (category === 'all') {
    return allData;
  }
  
  const filteredSales = allData.data.filter(sale => sale.category === category);
  
  return {
    data: filteredSales,
    total: filteredSales.length,
    activeCount: filteredSales.filter(sale => sale.status === 'Active').length,
    categories: allData.categories
  };
}

/**
 * 根据ID获取单个销售数据
 */
export async function fetchSaleById(id: string): Promise<PNTSale | null> {
  const allData = await fetchSalesData();
  const sale = allData.data.find(sale => sale.id === id);
  return sale || null;
}

/**
 * 根据地址获取单个销售数据
 */
export async function fetchSaleByAddress(address: string): Promise<PNTSale | null> {
  const allData = await fetchSalesData();
  const sale = allData.data.find(sale => sale.address === address);
  return sale || null;
}

/**
 * 获取统计信息
 */
export async function fetchSalesStats(): Promise<{
  total: number;
  active: number;
  successful: number;
  failed: number;
  totalParticipants: number;
}> {
  const allData = await fetchSalesData();
  
  return {
    total: allData.data.length,
    active: allData.data.filter(sale => sale.status === 'Active').length,
    successful: allData.data.filter(sale => sale.status === 'Successful').length,
    failed: allData.data.filter(sale => sale.status === 'Failed').length,
    totalParticipants: allData.data.reduce((sum, sale) => sum + sale.participants, 0)
  };
}

// 模拟API错误处理
export class SalesApiError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'SalesApiError';
  }
}

/**
 * 将来替换为真实API的配置
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  endpoints: {
    sales: '/sales',
    saleById: '/sales/:id',
    saleByAddress: '/sales/address/:address',
    stats: '/sales/stats'
  }
};

/**
 * 为将来API集成准备的真实API调用函数（目前未使用）
 */
export async function fetchSalesFromApi(): Promise<SalesApiResponse> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.sales}`);
    
    if (!response.ok) {
      throw new SalesApiError(`API请求失败: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API调用失败，使用本地数据:', error);
    // 降级到本地数据
    return await fetchSalesData();
  }
} 