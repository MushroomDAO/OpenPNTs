'use client';

import Link from 'next/link';
import { useLanguage } from '../lib/i18n';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import ClientOnly from './components/ClientOnly';

function HomeContent() {
  const { toggleLanguage, t } = useLanguage();
  const { isConnected } = useAccount();
  const [showStory, setShowStory] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('platform.title')}
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
          
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">{t('connect.wallet')}</span>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('home.welcome')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('home.description')}
          </p>
          
          {/* Features */}
          <div className="flex justify-center space-x-8 mb-12">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">{t('feature.transparent')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">{t('feature.secure')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">{t('feature.tradeable')}</span>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={() => setShowStory(!showStory)}
              className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors flex items-center mx-auto space-x-2"
            >
              <span>{t('story.title')}</span>
              <span className={`transform transition-transform ${showStory ? 'rotate-180' : ''}`}>
                ⬇️
              </span>
            </button>
          </div>
          
          {showStory && (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Alice's Story */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-lg">Alice - Business Owner</h3>
                    <p className="text-gray-600">☕ Coffee Shop</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{t('story.alice.intro')}</p>
                <p className="text-gray-700">{t('story.alice.action')}</p>
              </div>

              {/* Bob's Story */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    B
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-lg">Bob - Customer</h3>
                    <p className="text-gray-600">🎯 Loyal Customer</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{t('story.bob.intro')}</p>
                <p className="text-gray-700">{t('story.bob.action')}</p>
              </div>
            </div>
          )}
          
          {showStory && (
            <div className="text-center mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <p className="text-green-700 font-semibold">{t('story.win')}</p>
            </div>
          )}
        </div>

        {/* Role-based Entries */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Business Role */}
          <Link href="/create">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{t('role.business.title')}</h3>
              <p className="text-gray-600 mb-6">{t('role.business.desc')}</p>
              <div className="flex items-center text-green-600 font-semibold">
                {t('action.create')} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Customer Role */}
          <Link href="/sales">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{t('role.customer.title')}</h3>
              <p className="text-gray-600 mb-6">{t('role.customer.desc')}</p>
              <div className="flex items-center text-blue-600 font-semibold">
                {t('action.explore')} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Investor Role */}
          <Link href="/dashboard">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{t('role.investor.title')}</h3>
              <p className="text-gray-600 mb-6">{t('role.investor.desc')}</p>
              <div className="flex items-center text-purple-600 font-semibold">
                {t('action.dashboard')} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Demo/Test Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">{t('test.mode')}</h3>
          <p className="text-gray-600 mb-6">{t('test.description')}</p>
          
          <Link href="/demo">
            <button type="button" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              {t('action.demo')}
            </button>
          </Link>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>🔧 Local Anvil Network | 🚫 No MetaMask Required</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 OpenPNTs Platform. Building the future of loyalty points.</p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <a href="/docs" className="hover:text-blue-400 transition-colors">Documentation</a>
            <a href="https://github.com/yourusername/openpnts" className="hover:text-blue-400 transition-colors">GitHub</a>
            <a href="/support" className="hover:text-blue-400 transition-colors">Support</a>
          </div>
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
