'use client';

import { useAirAccount } from '../providers';
import { useState, useEffect } from 'react';
import { formatPNTs } from '../../lib/airaccount';
import ClientOnly from '../components/ClientOnly';

interface UserPNTHolding {
  id: string;
  name: string;
  issuer: string;
  balance: string;
  totalSupply: string;
  description: string;
  canUse: boolean;
}

interface UserTransaction {
  id: string;
  type: 'purchase' | 'reward' | 'spend' | 'transfer';
  amount: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

function DashboardContent() {
  const { user, isLoading, refreshBalance } = useAirAccount();
  const [holdings, setHoldings] = useState<UserPNTHolding[]>([]);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      // 模拟加载用户数据
      const timer = setTimeout(() => {
        setHoldings([
          {
            id: '1',
            name: 'Alice咖啡积分',
            issuer: 'alice.coffee.eth',
            balance: '150',
            totalSupply: '1000',
            description: '可在Alice咖啡店兑换饮品和享受折扣',
            canUse: true
          },
          {
            id: '2',
            name: 'Bob健身积分',
            issuer: 'bob.fitness.eth',
            balance: '80',
            totalSupply: '500',
            description: '健身房会员积分，可兑换课程和设备使用',
            canUse: true
          },
          {
            id: '3',
            name: 'Charlie美食积分',
            issuer: 'charlie.food.eth',
            balance: '220',
            totalSupply: '2000',
            description: '餐厅积分，可享受美食折扣和免费餐点',
            canUse: false
          }
        ]);

        setTransactions([
          {
            id: '1',
            type: 'purchase',
            amount: '+150',
            description: '购买Alice咖啡积分',
            timestamp: '2024-07-10 14:30',
            status: 'completed'
          },
          {
            id: '2',
            type: 'reward',
            amount: '+50',
            description: '转发Twitter获得奖励',
            timestamp: '2024-07-09 16:45',
            status: 'completed'
          },
          {
            id: '3',
            type: 'spend',
            amount: '-20',
            description: '在Alice咖啡店消费',
            timestamp: '2024-07-08 09:15',
            status: 'completed'
          },
          {
            id: '4',
            type: 'purchase',
            amount: '+100',
            description: '购买Charlie美食积分',
            timestamp: '2024-07-07 11:20',
            status: 'pending'
          }
        ]);

        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleRefreshBalance = async () => {
    setRefreshing(true);
    await refreshBalance();
    setRefreshing(false);
  };

  const getTransactionIcon = (type: UserTransaction['type']) => {
    switch (type) {
      case 'purchase': return '🛒';
      case 'reward': return '🎁';
      case 'spend': return '💳';
      case 'transfer': return '↔️';
      default: return '📄';
    }
  };

  const getStatusColor = (status: UserTransaction['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">用户仪表板</h1>
          <p>正在加载...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-4">用户仪表板</h1>
            <p className="text-yellow-800 mb-4">请登录AirAccount以查看您的积分和交易记录</p>
            <a 
              href="https://airaccount.aastar.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              获取AirAccount →
            </a>
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          用户仪表板
        </h1>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">欢迎回来</p>
              <p className="text-xl font-semibold text-gray-800">{user.ens}</p>
              <p className="text-sm text-gray-500">地址: {user.address}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-2">总余额</p>
              <p className="text-3xl font-bold text-purple-600">{formatPNTs(user.pntsBalance)}</p>
              <button
                type="button"
                onClick={handleRefreshBalance}
                disabled={refreshing}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {refreshing ? '刷新中...' : '🔄 刷新'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 积分持有情况 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">我的积分</h2>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              {holdings.length} 种积分
            </span>
          </div>

          <div className="space-y-4">
            {holdings.map((holding) => (
              <div key={holding.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{holding.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-blue-600">{holding.balance}</span>
                    {holding.canUse ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">可用</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">暂停</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{holding.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>发行方: {holding.issuer}</span>
                  <span>总量: {holding.totalSupply}</span>
                </div>
              </div>
            ))}
          </div>

          {holdings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">您还没有任何积分</p>
              <a href="/sales" className="text-blue-600 hover:text-blue-800">
                去购买积分 →
              </a>
            </div>
          )}
        </div>

        {/* 交易记录 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">交易记录</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              最近 {transactions.length} 笔
            </span>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTransactionIcon(tx.type)}</span>
                  <div>
                    <p className="font-medium text-gray-800">{tx.description}</p>
                    <p className="text-sm text-gray-500">{tx.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                    {tx.status === 'completed' ? '完成' : tx.status === 'pending' ? '进行中' : '失败'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">暂无交易记录</p>
            </div>
          )}
        </div>
      </div>

      {/* 快速操作 */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">快速操作</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="/sales" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="font-semibold text-gray-800">购买积分</h3>
            <p className="text-sm text-gray-600">浏览并购买商家积分</p>
          </a>
          
          <a href="/create" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-semibold text-gray-800">发行积分</h3>
            <p className="text-sm text-gray-600">创建您的积分卡</p>
          </a>
          
          <div className="bg-white rounded-lg p-4 text-center opacity-50">
            <div className="text-3xl mb-2">🎮</div>
            <h3 className="font-semibold text-gray-800">游戏赚取</h3>
            <p className="text-sm text-gray-600">敬请期待</p>
          </div>
        </div>
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