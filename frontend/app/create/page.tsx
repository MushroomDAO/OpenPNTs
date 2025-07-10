'use client';

import { useAccount } from 'wagmi';
import { useState } from 'react';
import ClientOnly from '../components/ClientOnly';

function CreateContent() {
  const { isConnected } = useAccount();
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating PNT with data:', formData);
    // TODO: Implement contract interaction
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">创建数字积分卡</h1>
        
        {!isConnected && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">请先连接钱包才能创建积分卡</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              积分名称
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如: 咖啡积分"
              required
            />
          </div>

          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              积分符号
            </label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如: COFFEE"
              required
            />
          </div>

          <div>
            <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700 mb-1">
              总供应量
            </label>
            <input
              type="number"
              id="totalSupply"
              name="totalSupply"
              value={formData.totalSupply}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如: 1000"
              min="1"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="描述您的积分用途..."
            />
          </div>

          <button
            type="submit"
            disabled={!isConnected}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isConnected ? '创建积分卡' : '请先连接钱包'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <ClientOnly fallback={
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">创建数字积分卡</h1>
          <p>正在加载...</p>
        </div>
      </div>
    }>
      <CreateContent />
    </ClientOnly>
  );
}
