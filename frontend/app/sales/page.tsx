'use client';

import { useState, useEffect } from 'react';
import { useAirAccount } from '../providers';
import { formatPNTs } from '../../lib/airaccount';
import Link from 'next/link';
import ClientOnly from '../components/ClientOnly';

interface PNTSale {
  id: string;
  address: string;
  name: string;
  issuer: string;
  description: string;
  status: 'Active' | 'Pending' | 'Successful' | 'Failed' | 'Closed';
  pricePerPNT: string;
  totalSupply: string;
  soldAmount: string;
  targetAmount: string;
  endTime: string;
  participants: number;
  category: string;
}

function SalesContent() {
  const { user } = useAirAccount();
  const [sales, setSales] = useState<PNTSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: '全部', icon: '🌟' },
    { id: 'food', name: '餐饮', icon: '🍽️' },
    { id: 'fitness', name: '健身', icon: '💪' },
    { id: 'beauty', name: '美容', icon: '💄' },
    { id: 'retail', name: '零售', icon: '🛍️' },
    { id: 'entertainment', name: '娱乐', icon: '🎮' }
  ];

  useEffect(() => {
    // 模拟加载预售数据
    const timer = setTimeout(() => {
      setSales([
        {
          id: '1',
          address: '0x1234...5678',
          name: 'Alice咖啡积分',
          issuer: 'alice.coffee.eth',
          description: '精品咖啡店积分，可兑换饮品、享受折扣，支持多种咖啡豆和甜点选择。每消费100泰铢可获得10积分。',
          status: 'Active',
          pricePerPNT: '0.001',
          totalSupply: '10000',
          soldAmount: '7500',
          targetAmount: '5000',
          endTime: '2024-07-20',
          participants: 156,
          category: 'food'
        },
        {
          id: '2',
          address: '0x2345...6789',
          name: 'Bob健身俱乐部积分',
          issuer: 'bob.fitness.eth',
          description: '现代化健身房积分，可兑换私教课程、团体课程、营养咨询和健身装备租赁服务。',
          status: 'Active',
          pricePerPNT: '0.002',
          totalSupply: '5000',
          soldAmount: '3200',
          targetAmount: '2000',
          endTime: '2024-07-25',
          participants: 89,
          category: 'fitness'
        },
        {
          id: '3',
          address: '0x3456...7890',
          name: 'Charlie美食积分',
          issuer: 'charlie.restaurant.eth',
          description: '泰式料理餐厅积分，可享受招牌菜品折扣、免费开胃菜和节日特别套餐优惠。',
          status: 'Successful',
          pricePerPNT: '0.0015',
          totalSupply: '8000',
          soldAmount: '8000',
          targetAmount: '4000',
          endTime: '2024-07-15',
          participants: 203,
          category: 'food'
        },
        {
          id: '4',
          address: '0x4567...8901',
          name: 'Diana美容SPA积分',
          issuer: 'diana.beauty.eth',
          description: '高端美容SPA积分，包含面部护理、身体护理、美甲美睫和专业化妆服务。',
          status: 'Pending',
          pricePerPNT: '0.003',
          totalSupply: '3000',
          soldAmount: '800',
          targetAmount: '1500',
          endTime: '2024-08-01',
          participants: 34,
          category: 'beauty'
        },
        {
          id: '5',
          address: '0x5678...9012',
          name: 'Eve电子产品积分',
          issuer: 'eve.electronics.eth',
          description: '电子产品零售积分，可用于购买手机、电脑、游戏设备和智能家居产品。',
          status: 'Failed',
          pricePerPNT: '0.0025',
          totalSupply: '12000',
          soldAmount: '2400',
          targetAmount: '6000',
          endTime: '2024-07-10',
          participants: 67,
          category: 'retail'
        },
        {
          id: '6',
          address: '0x6789...0123',
          name: 'Frank游戏中心积分',
          issuer: 'frank.gaming.eth',
          description: '游戏娱乐中心积分，可用于街机游戏、VR体验、桌游和电竞比赛报名。',
          status: 'Active',
          pricePerPNT: '0.0018',
          totalSupply: '6000',
          soldAmount: '4200',
          targetAmount: '3000',
          endTime: '2024-07-30',
          participants: 128,
          category: 'entertainment'
        }
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filteredSales = selectedCategory === 'all' 
    ? sales 
    : sales.filter(sale => sale.category === selectedCategory);

  const getStatusColor = (status: PNTSale['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Successful': return 'bg-blue-100 text-blue-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: PNTSale['status']) => {
    switch (status) {
      case 'Active': return '进行中';
      case 'Pending': return '等待中';
      case 'Successful': return '成功';
      case 'Failed': return '失败';
      case 'Closed': return '已关闭';
      default: return '未知';
    }
  };

  const calculateProgress = (sold: string, target: string) => {
    const soldNum = parseInt(sold);
    const targetNum = parseInt(target);
    return Math.min((soldNum / targetNum) * 100, 100);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PNTs 预售市场
        </h1>
        <p className="text-gray-600 mb-6">
          发现优质积分卡预售，以极低价格获得商家忠诚度积分，享受折扣和特殊优惠
        </p>

        {/* User Status */}
        {user ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-green-600">已登录:</span>
                <span className="font-semibold text-green-800 ml-2">{user.ens}</span>
              </div>
              <div>
                <span className="text-sm text-green-600">余额:</span>
                <span className="font-semibold text-green-800 ml-2">{formatPNTs(user.pntsBalance)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              登录AirAccount以参与预售和查看更多详情 
              <a href="https://airaccount.aastar.io" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:text-blue-800">
                立即注册 →
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">分类筛选</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">正在加载预售信息...</p>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{sales.length}</div>
              <div className="text-gray-600">总预售项目</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {sales.filter(s => s.status === 'Active').length}
              </div>
              <div className="text-gray-600">进行中</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {sales.reduce((sum, sale) => sum + sale.participants, 0)}
              </div>
              <div className="text-gray-600">总参与者</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1.5%</div>
              <div className="text-gray-600">平台手续费</div>
            </div>
          </div>

          {/* Sales Grid */}
          {filteredSales.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">该分类暂无预售项目</h2>
              <p className="text-gray-500 mb-6">选择其他分类或等待更多项目上线</p>
              {user && (
                <Link href="/create">
                  <button type="button" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    发行您的积分卡
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSales.map((sale) => (
                <div key={sale.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {categories.find(c => c.id === sale.category)?.icon || '⭐'}
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-800">{sale.name}</h3>
                        <p className="text-sm text-gray-500">{sale.issuer}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                      {getStatusText(sale.status)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{sale.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">销售进度</span>
                      <span className="font-semibold">
                        {formatPNTs(parseInt(sale.soldAmount))} / {formatPNTs(parseInt(sale.targetAmount))}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${calculateProgress(sale.soldAmount, sale.targetAmount)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {calculateProgress(sale.soldAmount, sale.targetAmount).toFixed(1)}% 完成
                    </div>
                  </div>

                  {/* Price & Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">价格:</span>
                      <p className="font-semibold">{sale.pricePerPNT} ETH/PNT</p>
                    </div>
                    <div>
                      <span className="text-gray-600">参与者:</span>
                      <p className="font-semibold">{sale.participants} 人</p>
                    </div>
                    <div>
                      <span className="text-gray-600">总量:</span>
                      <p className="font-semibold">{formatPNTs(parseInt(sale.totalSupply))}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">截止:</span>
                      <p className="font-semibold">{sale.endTime}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/sale/${sale.address}`}>
                    <button 
                      type="button"
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        sale.status === 'Active'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : sale.status === 'Successful'
                          ? 'bg-green-600 text-white'
                          : sale.status === 'Failed'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-400 text-gray-700'
                      }`}
                      disabled={sale.status !== 'Active'}
                    >
                      {sale.status === 'Active' && '立即参与'}
                      {sale.status === 'Successful' && '查看详情'}
                      {sale.status === 'Failed' && '预售失败'}
                      {sale.status === 'Pending' && '等待开始'}
                      {sale.status === 'Closed' && '已关闭'}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Call to Action */}
      {user && (
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">想要发行自己的积分卡？</h2>
          <p className="text-gray-600 mb-6">
            只需1.5%手续费，即可为您的业务创建透明、安全的积分预售
          </p>
          <Link href="/create">
            <button type="button" className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              立即发行 PNTs
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SalesPage() {
  return (
    <ClientOnly fallback={
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">PNTs 预售市场</h1>
          <p>正在加载...</p>
        </div>
      </div>
    }>
      <SalesContent />
    </ClientOnly>
  );
}