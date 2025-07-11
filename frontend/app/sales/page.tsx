'use client';

import { useState, useEffect } from 'react';
import { useAirAccount } from '../providers';
import { useLanguage } from '../../lib/i18n';
import { formatPNTs } from '../../lib/airaccount';
import { PNTSale, fetchSalesData, fetchSalesStats } from '../../lib/salesData';
import Link from 'next/link';
import ClientOnly from '../components/ClientOnly';

function SalesContent() {
  const { user } = useAirAccount();
  const { t, toggleLanguage, language } = useLanguage();
  const [sales, setSales] = useState<PNTSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stats, setStats] = useState({ total: 0, active: 0, successful: 0, failed: 0, totalParticipants: 0 });

  const categories = [
    { id: 'all', name: t('sales.all'), icon: '🌟' },
    { id: 'food', name: t('sales.food'), icon: '🍽️' },
    { id: 'fitness', name: t('sales.fitness'), icon: '💪' },
    { id: 'beauty', name: t('sales.beauty'), icon: '💄' },
    { id: 'retail', name: t('sales.retail'), icon: '🛍️' },
    { id: 'entertainment', name: t('sales.entertainment'), icon: '🎮' }
  ];

  useEffect(() => {
    // 加载销售数据和统计信息
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 并行加载销售数据和统计信息
        const [salesResponse, statsData] = await Promise.all([
          fetchSalesData(),
          fetchSalesStats()
        ]);
        
        setSales(salesResponse.data);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load sales data:', error);
        // 可以在这里添加错误提示
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
      case 'Active': return t('status.active');
      case 'Pending': return t('status.pending');
      case 'Successful': return t('status.successful');
      case 'Failed': return t('status.failed');
      case 'Closed': return t('status.closed');
      default: return t('status.unknown');
    }
  };

  const calculateProgress = (sold: string, target: string) => {
    const soldNum = parseInt(sold);
    const targetNum = parseInt(target);
    return Math.min((soldNum / targetNum) * 100, 100);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header with Language Switch */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('sales.title')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('sales.subtitle')}
          </p>
        </div>
        
        {/* Language Switch Button */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ml-4"
        >
          {t('switch.language')}
        </button>
      </div>

      {/* User Status */}
      <div>
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
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
              <div className="text-gray-600">{t('sales.active_presales')}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.active}</div>
              <div className="text-gray-600">{t('status.active')}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalParticipants}</div>
              <div className="text-gray-600">{t('sales.total_participants')}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1.5%</div>
              <div className="text-gray-600">{t('sales.platform_fee')}</div>
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
                        <h3 className="font-bold text-gray-800">{sale.name[language]}</h3>
                        <p className="text-sm text-gray-500">{sale.issuer}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                      {getStatusText(sale.status)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{sale.description[language]}</p>

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