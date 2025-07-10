'use client';

import { useAirAccount } from '../providers';
import { useState } from 'react';
import { formatPNTs } from '../../lib/airaccount';
import ClientOnly from '../components/ClientOnly';

interface PNTFormData {
  name: string;
  description: string;
  totalSupply: string;
  pricePerPNT: string;
  minGoal: string;
}

function CreateContent() {
  const { user, isLoading } = useAirAccount();
  const [formData, setFormData] = useState<PNTFormData>({
    name: '',
    description: '',
    totalSupply: '',
    pricePerPNT: '',
    minGoal: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitLoading(true);
    
    // 模拟创建PNT流程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Creating PNT with data:', formData);
    setSubmitted(true);
    setSubmitLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto text-center">
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Launch Your PNTs</h1>
          <p className="text-yellow-800 mb-6">
            请先登录AirAccount才能发行PNTs积分卡。新用户可获得免费50 PNTs！
          </p>
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
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-green-800">PNTs发行成功！</h1>
                       <p className="text-green-700 mb-6">
               您的&quot;{formData.name}&quot;积分卡已成功发行，即将开始预售！
             </p>
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="text-gray-600">积分名称:</span>
                <p className="font-semibold">{formData.name}</p>
              </div>
              <div>
                <span className="text-gray-600">总发行量:</span>
                <p className="font-semibold">{formatPNTs(parseInt(formData.totalSupply || '0'))}</p>
              </div>
              <div>
                <span className="text-gray-600">价格:</span>
                <p className="font-semibold">{formData.pricePerPNT} ETH/PNT</p>
              </div>
              <div>
                <span className="text-gray-600">最小目标:</span>
                <p className="font-semibold">{formatPNTs(parseInt(formData.minGoal || '0'))}</p>
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => { window.location.href = '/sales'; }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            查看所有预售
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Launch Your PNTs
          </h1>
          <p className="text-gray-600 mb-4">
            发行您的专属积分卡，为客户提供去中心化忠诚度体验
          </p>
          
          {/* User Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <span className="text-sm text-green-600">发行者:</span>
                <p className="font-semibold text-green-800">{user.ens}</p>
              </div>
              <div>
                <span className="text-sm text-green-600">余额:</span>
                <p className="font-semibold text-green-800">{formatPNTs(user.pntsBalance)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                积分名称 *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="例如：Alice咖啡积分"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                积分描述 *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="描述您的积分用途、兑换规则等..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700 mb-2">
                  总发行量 *
                </label>
                <input
                  id="totalSupply"
                  name="totalSupply"
                  type="number"
                  required
                  value={formData.totalSupply}
                  onChange={handleChange}
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="pricePerPNT" className="block text-sm font-medium text-gray-700 mb-2">
                  价格 (ETH/PNT) *
                </label>
                <input
                  id="pricePerPNT"
                  name="pricePerPNT"
                  type="number"
                  step="0.0001"
                  required
                  value={formData.pricePerPNT}
                  onChange={handleChange}
                  placeholder="0.001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="minGoal" className="block text-sm font-medium text-gray-700 mb-2">
                最小销售目标 *
              </label>
              <input
                id="minGoal"
                name="minGoal"
                type="number"
                required
                value={formData.minGoal}
                onChange={handleChange}
                placeholder="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                未达到最小目标时，预售将失败并退款
              </p>
            </div>

            {/* 平台说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">平台优势</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 仅收取1.5%平台手续费（vs 传统平台30-60%）</li>
                <li>• 智能合约自动处理销售和分配</li>
                <li>• 区块链技术确保透明度和安全性</li>
                <li>• 支持多种兑换模式：折扣、兑换、赠送</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {submitLoading ? '发行中...' : '立即发行 PNTs'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <ClientOnly fallback={
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Launch Your PNTs</h1>
          <p>正在加载...</p>
        </div>
      </div>
    }>
      <CreateContent />
    </ClientOnly>
  );
}
