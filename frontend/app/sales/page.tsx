'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import ClientOnly from '../components/ClientOnly';

interface Sale {
  id: string;
  address: string;
  name: string;
  description: string;
  status: 'Active' | 'Pending' | 'Successful' | 'Failed' | 'Closed';
  pricePerPoint: string;
  pointsAvailable: string;
  pointsSold: string;
  endTime: string;
  beneficiary: string;
}

function SalesContent() {
  const { isConnected } = useAccount();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading sales data
    const timer = setTimeout(() => {
      setSales([
        {
          id: '1',
          address: '0x1234567890123456789012345678901234567890',
          name: 'Alice咖啡店积分',
          description: '优质咖啡积分，每10积分可兑换一杯免费咖啡',
          status: 'Active',
          pricePerPoint: '0.001',
          pointsAvailable: '1000',
          pointsSold: '250',
          endTime: '2024-02-15',
          beneficiary: 'Alice Coffee Shop'
        },
        {
          id: '2',
          address: '0x2345678901234567890123456789012345678901',
          name: 'Bob书店积分',
          description: '读书爱好者专属积分，可兑换书籍和文具',
          status: 'Active',
          pricePerPoint: '0.002',
          pointsAvailable: '500',
          pointsSold: '100',
          endTime: '2024-02-20',
          beneficiary: 'Bob Book Store'
        },
        {
          id: '3',
          address: '0x3456789012345678901234567890123456789012',
          name: '健身房会员积分',
          description: '健身积分系统，促进健康生活方式',
          status: 'Pending',
          pricePerPoint: '0.005',
          pointsAvailable: '300',
          pointsSold: '0',
          endTime: '2024-03-01',
          beneficiary: 'Fitness Center'
        }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: Sale['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Successful':
        return 'bg-blue-100 text-blue-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (sold: string, available: string) => {
    const soldNum = parseInt(sold);
    const availableNum = parseInt(available);
    return availableNum > 0 ? (soldNum / availableNum) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">所有预售</h1>
          <p>正在加载预售信息...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">所有预售</h1>
        <p className="text-gray-600">浏览并参与各种数字积分预售</p>
      </div>

      {!isConnected && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">连接钱包以参与预售和查看更多详情</p>
        </div>
      )}

      {sales.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">暂无活跃预售</h2>
          <p className="text-gray-500 mb-6">成为第一个创建积分预售的商家！</p>
          <Link href="/create">
            <button type="button" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              创建积分卡
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale) => (
            <div key={sale.id} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{sale.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                    {sale.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{sale.description}</p>
                <p className="text-xs text-gray-500">by {sale.beneficiary}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>价格:</span>
                  <span className="font-medium">{sale.pricePerPoint} ETH/积分</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>销售进度:</span>
                    <span>{sale.pointsSold}/{sale.pointsAvailable}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${calculateProgress(sale.pointsSold, sale.pointsAvailable)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>结束时间:</span>
                  <span>{sale.endTime}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/sale/${sale.address}`} className="flex-1">
                  <button type="button" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    查看详情
                  </button>
                </Link>
                {isConnected && sale.status === 'Active' && (
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    立即购买
                  </button>
                )}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                合约: {sale.address.slice(0, 6)}...{sale.address.slice(-4)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/create">
          <button type="button" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            创建您的积分卡
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function SalesPage() {
  return (
    <ClientOnly fallback={
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">所有预售</h1>
          <p>正在加载预售信息...</p>
        </div>
      </div>
    }>
      <SalesContent />
    </ClientOnly>
  );
}