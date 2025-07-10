'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import ClientOnly from '../../components/ClientOnly';

interface SalePageParams {
  [key: string]: string | string[] | undefined;
  saleAddress: string;
}

interface SaleData {
  name: string;
  description: string;
  status: string;
  tokenId: string;
  price: string;
  pointsAvailable: string;
  pointsSold: string;
  beneficiary: string;
}

function SaleContent() {
  const params = useParams<SalePageParams>();
  const { isConnected } = useAccount();
  const [saleData, setSaleData] = useState<SaleData | null>(null);
  const [loading, setLoading] = useState(true);

  const saleAddress = params?.saleAddress;

  useEffect(() => {
    // Simulate loading sale data
    const timer = setTimeout(() => {
      setSaleData({
        name: 'Demo Loyalty Points Sale',
        description: 'This is a demo sale for testing purposes',
        status: 'Active',
        tokenId: '0',
        price: '0.001',
        pointsAvailable: '1000',
        pointsSold: '200',
        beneficiary: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Remove saleAddress dependency as it's not used in the effect

  if (!saleAddress) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-500">错误</h1>
          <p>未提供销售地址</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold">加载中...</h1>
          <p>正在获取销售详情</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{saleData?.name || '忠诚积分预售'}</h1>
      <p className="text-lg mb-4">销售地址：{saleAddress}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">销售详情</h2>
          <div className="space-y-2">
            <p><strong>状态：</strong> <span className="text-green-600">{saleData?.status}</span></p>
            <p><strong>代币 ID:</strong> {saleData?.tokenId}</p>
            <p><strong>价格：</strong> {saleData?.price} ETH / 积分</p>
            <p><strong>可用积分：</strong> {saleData?.pointsAvailable}</p>
            <p><strong>已售积分：</strong> {saleData?.pointsSold}</p>
            <p><strong>受益人：</strong> {saleData?.beneficiary}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">积分信息</h2>
          <div className="space-y-2">
            <p><strong>名称：</strong> Demo 积分</p>
            <p><strong>符号：</strong> DPT</p>
            <p><strong>描述：</strong> 演示用的忠诚积分</p>
          </div>
        </div>
      </div>

      {isConnected ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">购买积分</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="purchaseAmount" className="block text-sm font-medium text-gray-700 mb-2">
                购买数量
              </label>
              <input
                id="purchaseAmount"
                type="number"
                placeholder="输入要购买的积分数量"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              购买积分
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">您的活动</h3>
            <p>您购买的积分：0</p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">请连接钱包以参与此次销售</p>
        </div>
      )}
    </div>
  );
}

export default function SalePage() {
  return (
    <ClientOnly fallback={
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold">加载中...</h1>
          <p>正在获取销售详情</p>
        </div>
      </div>
    }>
      <SaleContent />
    </ClientOnly>
  );
}

                <p className="text-sm text-gray-600">{pnt.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 参与记录 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">参与记录</h2>
        {participations.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">您还没有参与任何预售</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">预售名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">投入金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">获得积分</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {participations.map((participation) => (
                    <tr key={participation.id} className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm">{participation.saleName}</td>
                      <td className="px-4 py-3 text-sm">{participation.amount} ETH</td>
                      <td className="px-4 py-3 text-sm">{participation.tokens}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(participation.status)}`}>
                          {participation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ClientOnly fallback={
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">用户仪表板</h1>
          <p>正在加载...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </ClientOnly>
  );
}     <SalesContent />
    </ClientOnly>
  );
}