'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAirAccount } from '../../providers';
import { formatPNTs } from '../../../lib/airaccount';
import ClientOnly from '../../components/ClientOnly';

interface SalePageParams {
  [key: string]: string | string[] | undefined;
  saleAddress: string;
}

interface SaleDetail {
  id: string;
  address: string;
  name: string;
  issuer: string;
  description: string;
  longDescription: string;
  status: 'Active' | 'Pending' | 'Successful' | 'Failed' | 'Closed';
  pricePerPNT: string;
  totalSupply: string;
  soldAmount: string;
  targetAmount: string;
  startTime: string;
  endTime: string;
  participants: number;
  category: string;
  features: string[];
  usageRules: string[];
  redemptionOptions: Array<{
    type: 'discount' | 'exchange' | 'gift';
    title: string;
    description: string;
    cost: number;
  }>;
}

function SaleContent() {
  const params = useParams() as SalePageParams;
  const { user, mockFingerprint: fingerprintAuth } = useAirAccount();
  const [sale, setSale] = useState<SaleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    // 模拟根据地址加载预售详情
    const timer = setTimeout(() => {
      // 根据地址模拟不同的预售数据
      const mockSales: Record<string, SaleDetail> = {
        '0x1234...5678': {
          id: '1',
          address: '0x1234...5678',
          name: 'Alice咖啡积分',
          issuer: 'alice.coffee.eth',
          description: '精品咖啡店积分，可兑换饮品、享受折扣',
          longDescription: 'Alice咖啡店是一家位于曼谷中心区的精品咖啡店，专注于提供高品质的咖啡体验。我们的积分系统让顾客能够享受到更多优惠和特殊待遇。每次消费都能获得积分，积分可以用于兑换免费饮品、享受折扣或参与特殊活动。',
          status: 'Active',
          pricePerPNT: '0.001',
          totalSupply: '10000',
          soldAmount: '7500',
          targetAmount: '5000',
          startTime: '2024-07-01',
          endTime: '2024-07-20',
          participants: 156,
          category: 'food',
          features: [
            '100%透明的区块链积分系统',
            '支持多种兑换方式',
            '永不过期的数字积分',
            '可与其他商家积分互换',
            '智能合约自动执行'
          ],
          usageRules: [
            '每消费100泰铢获得10积分',
            '积分可直接抵扣现金（1积分=1泰铢）',
            '积分可兑换免费饮品和甜点',
            '特殊活动期间可获得双倍积分',
            '积分可转赠给朋友和家人'
          ],
          redemptionOptions: [
            {
              type: 'discount',
              title: '直接折扣',
              description: '积分直接抵扣消费金额',
              cost: 1
            },
            {
              type: 'exchange',
              title: '免费拿铁',
              description: '兑换一杯标准拿铁咖啡',
              cost: 80
            },
            {
              type: 'exchange',
              title: '免费甜点',
              description: '兑换任意甜点一份',
              cost: 50
            },
            {
              type: 'gift',
              title: '咖啡豆礼盒',
              description: '精装咖啡豆礼盒（250g）',
              cost: 300
            }
          ]
        }
      };

      const foundSale = mockSales[params.saleAddress] || mockSales['0x1234...5678'];
      setSale(foundSale);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [params.saleAddress]);

  const handlePurchase = async () => {
    if (!user || !sale || !purchaseAmount) return;

    setPurchasing(true);
    
    try {
      // 模拟指纹验证
      const fingerprintSuccess = await fingerprintAuth();
      
      if (!fingerprintSuccess) {
        alert('指纹验证失败，请重试');
        setPurchasing(false);
        return;
      }

      // 模拟购买流程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPurchased(true);
      alert(`成功购买 ${purchaseAmount} PNTs！`);
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('购买失败，请重试');
    } finally {
      setPurchasing(false);
    }
  };

  const calculateProgress = (sold: string, target: string) => {
    const soldNum = parseInt(sold);
    const targetNum = parseInt(target);
    return Math.min((soldNum / targetNum) * 100, 100);
  };

  const getStatusColor = (status: SaleDetail['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Successful': return 'bg-blue-100 text-blue-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: SaleDetail['status']) => {
    switch (status) {
      case 'Active': return '进行中';
      case 'Pending': return '等待中';
      case 'Successful': return '成功';
      case 'Failed': return '失败';
      case 'Closed': return '已关闭';
      default: return '未知';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">加载中...</h1>
          <p>正在获取预售详情</p>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">预售不存在</h1>
          <p className="text-gray-600 mb-6">未找到指定的预售项目</p>
          <a href="/sales" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            返回预售列表
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{sale.name}</h1>
              <p className="text-gray-600">发行方: {sale.issuer}</p>
              <p className="text-sm text-gray-500">合约地址: {sale.address}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(sale.status)}`}>
              {getStatusText(sale.status)}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{sale.description}</p>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">销售进度</span>
              <span className="text-lg font-bold text-blue-600">
                {formatPNTs(parseInt(sale.soldAmount))} / {formatPNTs(parseInt(sale.targetAmount))}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-300" 
                style={{ width: `${calculateProgress(sale.soldAmount, sale.targetAmount)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{calculateProgress(sale.soldAmount, sale.targetAmount).toFixed(1)}% 完成</span>
              <span>{sale.participants} 人参与</span>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sale.pricePerPNT} ETH</div>
              <div className="text-gray-600">每个积分价格</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatPNTs(parseInt(sale.totalSupply))}</div>
              <div className="text-gray-600">总发行量</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{sale.endTime}</div>
              <div className="text-gray-600">结束时间</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Purchase Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">参与预售</h3>
              
              {!user ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800 mb-4">请登录AirAccount以参与预售</p>
                  <a 
                    href="https://airaccount.aastar.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  >
                    立即注册 →
                  </a>
                </div>
              ) : sale.status !== 'Active' ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-700">预售暂不可参与</p>
                  <p className="text-sm text-gray-500">状态: {getStatusText(sale.status)}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm text-green-600">账户: {user.ens}</div>
                    <div className="text-sm text-green-600">余额: {formatPNTs(user.pntsBalance)}</div>
                  </div>

                  {/* Purchase Form */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      购买数量
                    </label>
                    <input
                      id="amount"
                      type="number"
                      min="1"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      placeholder="输入要购买的积分数量"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {purchaseAmount && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-sm text-blue-600">
                        总价: {(parseFloat(purchaseAmount) * parseFloat(sale.pricePerPNT)).toFixed(4)} ETH
                      </div>
                      <div className="text-sm text-blue-600">
                        约合: {formatPNTs(parseInt(purchaseAmount))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePurchase}
                    disabled={purchasing || !purchaseAmount || purchased}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {purchasing ? '处理中...' : purchased ? '已购买' : '立即购买'}
                  </button>

                  {purchasing && (
                    <div className="text-center text-sm text-gray-600">
                      <p>🔒 请完成指纹验证</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Long Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">详细介绍</h3>
              <p className="text-gray-700 leading-relaxed">{sale.longDescription}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">积分特色</h3>
                             <ul className="space-y-2">
                 {sale.features.map((feature) => (
                   <li key={feature} className="flex items-center space-x-2">
                     <span className="text-green-500">✓</span>
                     <span className="text-gray-700">{feature}</span>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Usage Rules */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">使用规则</h3>
                             <ul className="space-y-2">
                 {sale.usageRules.map((rule) => (
                   <li key={rule} className="flex items-start space-x-2">
                     <span className="text-blue-500 mt-1">•</span>
                     <span className="text-gray-700">{rule}</span>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Redemption Options */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">兑换选项</h3>
                             <div className="grid md:grid-cols-2 gap-4">
                 {sale.redemptionOptions.map((option) => (
                   <div key={option.title} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{option.title}</h4>
                      <span className="text-blue-600 font-bold">{option.cost} 积分</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        option.type === 'discount' ? 'bg-green-100 text-green-800' :
                        option.type === 'exchange' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {option.type === 'discount' && '折扣'}
                        {option.type === 'exchange' && '兑换'}
                        {option.type === 'gift' && '礼品'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a href="/sales" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            ← 返回预售列表
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SalePage() {
  return (
    <ClientOnly fallback={
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">加载中...</h1>
          <p>正在获取预售详情</p>
        </div>
      </div>
    }>
      <SaleContent />
    </ClientOnly>
  );
}
