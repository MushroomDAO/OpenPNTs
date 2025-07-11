'use client';

import { useAirAccount } from '../providers';
import { useState, useEffect } from 'react';
import { formatPNTs } from '../../lib/airaccount';
import { useI18n } from '../../lib/i18n';
import ClientOnly from '../components/ClientOnly';
import { TransactionLink } from '../components/BlockchainLinks';

interface UserHolding {
  id: string;
  name: string;
  balance: number;
  issuer: string;
  status: 'active' | 'suspended';
  totalSupply: string;
  description: string;
}

interface UserTransaction {
  id: string;
  type: 'purchase' | 'reward' | 'spend' | 'transfer';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
  pointsName: string;
}

function DashboardContent() {
  const { user, isLoading } = useAirAccount();
  const { t } = useI18n();
  const [holdings, setHoldings] = useState<UserHolding[]>([]);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      // 模拟加载用户数据
      const mockHoldings: UserHolding[] = [
        {
          id: '1',
          name: t('dashboard.mock_alice_coffee'),
          balance: 250,
          issuer: 'alice.coffee.eth',
          status: 'active',
          totalSupply: '10000',
          description: t('dashboard.mock_alice_desc')
        },
        {
          id: '2', 
          name: t('dashboard.mock_bob_fitness'),
          balance: 80,
          issuer: 'bob.fitness.eth',
          status: 'active',
          totalSupply: '5000',
          description: t('dashboard.mock_bob_desc')
        },
        {
          id: '3',
          name: t('dashboard.mock_charlie_food'),
          balance: 0,
          issuer: 'charlie.restaurant.eth',
          status: 'suspended',
          totalSupply: '8000',
          description: t('dashboard.mock_charlie_desc')
        }
      ];

      const mockTransactions: UserTransaction[] = [
        {
          id: '1',
          type: 'purchase',
          amount: 100,
          description: t('dashboard.mock_tx_alice_purchase'),
          timestamp: '2024-07-10T14:30:00Z',
          status: 'completed',
          hash: '0x1234567890abcdef1234567890abcdef12345678',
          pointsName: t('dashboard.mock_alice_coffee')
        },
        {
          id: '2',
          type: 'reward',
          amount: 50,
          description: t('dashboard.mock_tx_twitter'),
          timestamp: '2024-07-09T10:15:00Z',
          status: 'completed',
          hash: '0x2345678901bcdef12345678901bcdef123456789',
          pointsName: 'PNTs'
        },
        {
          id: '3',
          type: 'spend',
          amount: -30,
          description: t('dashboard.mock_tx_alice_spend'),
          timestamp: '2024-07-08T16:45:00Z',
          status: 'completed',
          hash: '0x3456789012cdef123456789012cdef1234567890',
          pointsName: t('dashboard.mock_alice_coffee')
        },
        {
          id: '4',
          type: 'purchase',
          amount: 80,
          description: t('dashboard.mock_tx_charlie_purchase'),
          timestamp: '2024-07-07T11:20:00Z',
          status: 'completed',
          hash: '0x456789013def123456789013def12345678901a',
          pointsName: t('dashboard.mock_charlie_food')
        }
      ];

      setHoldings(mockHoldings);
      setTransactions(mockTransactions);
    }
  }, [user, t]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 模拟刷新延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getTotalBalance = () => {
    return holdings.reduce((total, holding) => total + holding.balance, 0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">{t('dashboard.title')}</h1>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">{t('dashboard.title')}</h1>
            <p className="text-yellow-800 mb-4">{t('dashboard.login_required')}</p>
            <a 
              href="https://airaccount.aastar.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              {t('dashboard.get_airaccount')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        {/* 用户信息卡片 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
              <p className="text-gray-200 mb-2">{t('dashboard.welcome')}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-300">{t('dashboard.address')}:</span>
                <span className="font-mono">{user.ens}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-200 mb-2">{t('dashboard.total_balance')}</p>
              <p className="text-2xl font-bold">{formatPNTs(getTotalBalance())}</p>
              <button 
                type="button"
                onClick={handleRefresh}
                className="mt-2 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded transition-colors"
                disabled={refreshing}
              >
                {refreshing ? t('dashboard.refreshing') : t('dashboard.refresh')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 积分持有情况 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{t('dashboard.my_points')}</h2>
              <span className="text-sm text-gray-500">
                {holdings.length} {t('dashboard.point_types')}
              </span>
            </div>
            
            {holdings.length > 0 ? (
              <div className="space-y-4">
                {holdings.map((holding) => (
                  <div key={holding.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{holding.name}</h3>
                      {holding.status === 'active' ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{t('dashboard.available')}</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('dashboard.suspended')}</span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mb-2">{formatPNTs(holding.balance)}</p>
                    <p className="text-sm text-gray-600 mb-2">{holding.description}</p>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{t('dashboard.issuer')}: {holding.issuer}</span>
                      <span>{t('dashboard.total_supply')}: {holding.totalSupply}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">{t('dashboard.no_points')}</p>
                <a href="/sales" className="text-blue-600 hover:text-blue-800">
                  {t('dashboard.buy_points_link')}
                </a>
              </div>
            )}
          </div>

          {/* 交易记录 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{t('dashboard.transactions')}</h2>
              <span className="text-sm text-gray-500">
                {t('dashboard.recent_transactions')} {transactions.length} {t('dashboard.transactions_count')}
              </span>
            </div>
            
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{tx.pointsName}</h4>
                        <p className="text-sm text-gray-600">{tx.description}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount > 0 ? '+' : ''}{formatPNTs(Math.abs(tx.amount))}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {t(`transaction.${tx.status}`)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{t('dashboard.transaction_hash')}:</span>
                      <TransactionLink 
                        txHash={tx.hash}
                        className="text-blue-600 hover:text-blue-800"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('dashboard.no_transactions')}</p>
              </div>
            )}
          </div>
        </div>

        {/* 快速操作 */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('dashboard.quick_actions')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/sales" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">🛒</div>
              <h3 className="font-semibold text-gray-800">{t('dashboard.buy_points_action')}</h3>
              <p className="text-sm text-gray-600">{t('dashboard.buy_points_desc')}</p>
            </a>
            
            <a href="/create" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-semibold text-gray-800">{t('dashboard.create_points')}</h3>
              <p className="text-sm text-gray-600">{t('dashboard.create_points_desc')}</p>
            </a>
            
            <div className="bg-white rounded-lg p-4 text-center opacity-50">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="font-semibold text-gray-800">{t('dashboard.play_to_earn')}</h3>
              <p className="text-sm text-gray-600">{t('dashboard.play_to_earn_desc')}</p>
            </div>
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
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </ClientOnly>
  );
}