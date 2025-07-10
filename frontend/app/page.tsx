'use client';

import Link from 'next/link';
import { useLanguage } from '../lib/i18n';
import { useAirAccount } from './providers';
import { useState } from 'react';
import { formatPNTs, getAirAccountUrl } from '../lib/airaccount';
import ClientOnly from './components/ClientOnly';

// AirAccount登录组件
function AirAccountLogin() {
  const { user, login, logout } = useAirAccount();
  const [email, setEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoginLoading(true);
    try {
      await login(email);
    } finally {
      setLoginLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">{user.ens}</span>
          </div>
          <div className="text-xs text-green-600">{formatPNTs(user.pntsBalance)}</div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          退出
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <form onSubmit={handleLogin} className="flex items-center space-x-2">
        <input
          type="email"
          placeholder="Email 或 ENS"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loginLoading}
        />
        <button
          type="submit"
          disabled={loginLoading || !email.trim()}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loginLoading ? '登录中...' : '登录'}
        </button>
      </form>
      
      <a
        href={getAirAccountUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
      >
        获取免费50 PNTs →
      </a>
    </div>
  );
}

function HomeContent() {
  const { toggleLanguage, t } = useLanguage();
  const { user } = useAirAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OpenPNTs Platform
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {t('switch.language')}
          </button>
          
          <AirAccountLogin />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
                     <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
             {t('home.title')}
           </h1>
           <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
             {t('home.subtitle')}
           </p>
                     <div className="flex justify-center space-x-4">
             <Link href="/sales">
               <button type="button" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                 {t('nav.browse')}
               </button>
             </Link>
             
             {user ? (
               <Link href="/create">
                 <button type="button" className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                   {t('nav.launch')}
                 </button>
               </Link>
             ) : (
               <button 
                 type="button"
                 className="bg-gray-300 text-gray-500 px-8 py-4 rounded-xl font-semibold cursor-not-allowed"
                 title={t('nav.login_required')}
               >
                 {t('nav.launch')}
               </button>
             )}
           </div>
        </div>

        {/* 三大核心卖点 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl mb-6 flex items-center justify-center mx-auto">
              <span className="text-2xl">🎮</span>
            </div>
                         <h3 className="text-xl font-bold mb-4 text-gray-800">{t('features.play2earn.title')}</h3>
             <p className="text-gray-600">
               {t('features.play2earn.desc')}
             </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl mb-6 flex items-center justify-center mx-auto">
              <span className="text-2xl">💳</span>
            </div>
                         <h3 className="text-xl font-bold mb-4 text-gray-800">{t('features.cps.title')}</h3>
             <p className="text-gray-600">
               {t('features.cps.desc')}
             </p>
           </div>

           <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
             <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl mb-6 flex items-center justify-center mx-auto">
               <span className="text-2xl">₿</span>
             </div>
             <h3 className="text-xl font-bold mb-4 text-gray-800">{t('features.crypto.title')}</h3>
             <p className="text-gray-600">
               {t('features.crypto.desc')}
             </p>
          </div>
        </div>

        {/* 平台价值主张 */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">核心竞争力</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-700">Play2B2E + CPS + Crypto</h3>
                <p className="text-gray-700">
                  游戏化获取积分 + 按效果付费 + 加密货币支付，三重创新模式重新定义商业忠诚度体系。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-purple-700">智能合约 + 去中心化计算 + AI优化</h3>
                <p className="text-gray-700">
                  区块链技术保证透明度，AI算法优化推荐，去中心化计算确保平台去中心化运营。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 使用示例 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">使用场景</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-700">💰 购买积分卡</h3>
              <p className="text-gray-600 mb-4">
                商家Alice发行咖啡积分，100 THB市场价的咖啡可以用80 THB + 20积分购买。
                20积分的购买成本仅需2 THB（10%），为用户节省巨大成本。
              </p>
              
              <h3 className="text-xl font-semibold text-blue-700">🎯 获得积分</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• 低价购买：2 THB = 20积分</li>
                <li>• 转发Twitter：免费获得50积分</li>
                <li>• 参与游戏：娱乐中赚取积分</li>
                <li>• 完成任务：多种活动获得奖励</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-purple-700">🏪 商家收益</h3>
              <p className="text-gray-600 mb-4">
                平台仅收取1.5%手续费，销售积分的收入全部归商家。相比传统平台30-60%的佣金，
                获客成本降低20-40倍。
              </p>
              
              <h3 className="text-xl font-semibold text-orange-700">🎁 Coupon系统</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• 面值折扣：满300减30 coupon</li>
                <li>• 兑换模式：100积分换一杯拿铁</li>
                <li>• 赠送活动：买3杯送1杯 coupon</li>
                <li>• 直接支付：积分抵扣现金</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">体验演示</h3>
          <p className="text-gray-600 mb-6">
            无需钱包连接，使用本地测试数据快速体验Alice咖啡店和Bob客户的完整交互流程
          </p>
          
          <Link href="/demo">
            <button type="button" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              立即体验 Demo
            </button>
          </Link>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>🔧 本地 Anvil 网络 | 🚫 无需 MetaMask</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-6">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2024 OpenPNTs Platform. 全球统一积分系统 - 让忠诚度更有价值</p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">OpenPNTs Platform</h1>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <HomeContent />
    </ClientOnly>
  );
}
