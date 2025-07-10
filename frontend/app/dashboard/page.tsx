'use client';

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import ClientOnly from '../components/ClientOnly';

interface UserPNT {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  totalSupply: string;
  description: string;
}

interface UserParticipation {
  id: string;
  saleName: string;
  amount: string;
  tokens: string;
  status: 'Pending' | 'Successful' | 'Failed';
}

function DashboardContent() {
  const { address, isConnected } = useAccount();
  const [userPNTs, setUserPNTs] = useState<UserPNT[]>([]);
  const [participations, setParticipations] = useState<UserParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      // Simulate loading user data
      const timer = setTimeout(() => {
        setUserPNTs([
          {
            id: '1',
            name: '咖啡积分',
            symbol: 'COFFEE',
            balance: '150',
            totalSupply: '1000',
            description: '可在Alice咖啡店兑换饮品'
          },
          {
            id: '2',
            name: '健身积分',
            symbol: 'FITNESS',
            balance: '80',
            totalSupply: '500',
            description: '健身房会员积分'
          }
        ]);

        setParticipations([
          {
            id: '1',
            saleName: 'Alice咖啡店积分',
            amount: '0.15',
            tokens: '150',
            status: 'Successful'
          },
          {
            id: '2',
            saleName: '健身房会员积分',
            amount: '0.4',
            tokens: '80',
            status: 'Successful'
          }
        ]);

        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  const getStatusColor = (status: UserParticipation['status']) => {
    switch (status) {
      case 'Successful':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">用户仪表板</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-yellow-800 mb-4">请连接钱包以查看您的积分和参与记录</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">用户仪表板</h1>
          <p>正在加载您的数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">用户仪表板</h1>
        <p className="text-gray-600">钱包地址: {address}</p>
      </div>

      {/* 用户拥有的积分 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">我的积分</h2>
        {userPNTs.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">您还没有任何积分</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPNTs.map((pnt) => (
              <div key={pnt.id} className="bg-white p-4 rounded-lg shadow-md border">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold">{pnt.name}</h3>
                  <p className="text-sm text-gray-600">{pnt.symbol}</p>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">余额</span>
                    <span className="font-semibold">{pnt.balance}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(parseInt(pnt.balance) / parseInt(pnt.totalSupply)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    总供应量: {pnt.totalSupply}
                  </div>
                </div>

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
}