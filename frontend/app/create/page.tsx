'use client';

import { useAirAccount } from '../providers';
import { useState } from 'react';
import { formatPNTs } from '../../lib/airaccount';
import { simulateCreatePNT, BlockchainTransaction, type CreateFormData } from '../../lib/createData';
import { useI18n } from '../../lib/i18n';
import ClientOnly from '../components/ClientOnly';
import { TransactionLink, AddressLink } from '../components/BlockchainLinks';

interface PNTFormData extends CreateFormData {
  category: string;
}

interface CreateResult {
  success: boolean;
  transaction?: BlockchainTransaction;
  error?: string;
}

function CreateContent() {
  const { user, isLoading } = useAirAccount();
  const { t } = useI18n();
  const [formData, setFormData] = useState<PNTFormData>({
    name: '',
    description: '',
    totalSupply: '',
    pricePerPNT: '',
    minGoal: '',
    category: 'food'
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [createResult, setCreateResult] = useState<CreateResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitLoading(true);
    setCreateResult(null);
    
    try {
      // 使用新的模拟创建PNT服务
      const result = await simulateCreatePNT();
      setCreateResult(result);
    } catch (error) {
      console.error('Create PNT error:', error);
      setCreateResult({
        success: false,
        error: 'An unexpected error occurred'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto text-center">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('create.title')}</h1>
          <p className="text-yellow-800 mb-6">
            {t('create.login_required')}
          </p>
          <a 
            href="https://airaccount.aastar.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            {t('create.get_airaccount')}
          </a>
        </div>
      </div>
    );
  }

  if (createResult?.success && createResult.transaction) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-green-800">{t('create.success_title')}</h1>
          <p className="text-green-700 mb-6">
            {t('create.success_desc').replace('{name}', formData.name)}
          </p>
          
          {/* 区块链交易信息 */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">{t('create.blockchain_info')}</h3>
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('create.contract_address')}:</span>
                <AddressLink 
                  address={createResult.transaction.contractAddress}
                  className="text-blue-600 hover:text-blue-800"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('create.sale_address')}:</span>
                <AddressLink 
                  address={createResult.transaction.saleAddress}
                  className="text-blue-600 hover:text-blue-800"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('create.transaction_hash')}:</span>
                <TransactionLink 
                  txHash={createResult.transaction.transactionHash}
                  className="text-blue-600 hover:text-blue-800"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('create.block_number')}:</span>
                <span className="font-mono text-sm">{createResult.transaction.blockNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('create.gas_used')}:</span>
                <span className="font-mono text-sm">{parseInt(createResult.transaction.gasUsed).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 积分详情 */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">{t('create.pnt_details')}</h3>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="text-gray-600">{t('create.form.name')}:</span>
                <p className="font-semibold">{formData.name}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('create.form.total_supply')}:</span>
                <p className="font-semibold">{formatPNTs(parseInt(formData.totalSupply || '0'))}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('create.form.price')}:</span>
                <p className="font-semibold">{formData.pricePerPNT} ETH/PNT</p>
              </div>
              <div>
                <span className="text-gray-600">{t('create.form.min_goal')}:</span>
                <p className="font-semibold">{formatPNTs(parseInt(formData.minGoal || '0'))}</p>
              </div>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => { window.location.href = '/sales'; }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('create.view_sales')}
          </button>
        </div>
      </div>
    );
  }

  if (createResult?.success === false) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✗</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-red-800">{t('create.error_title')}</h1>
          <p className="text-red-700 mb-6">
            {createResult.error || t('create.error_default')}
          </p>
          <button 
            type="button"
            onClick={() => setCreateResult(null)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('create.try_again')}
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
            {t('create.title')}
          </h1>
          <p className="text-gray-600 mb-4">
            {t('create.subtitle')}
          </p>
          
          {/* User Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <span className="text-sm text-green-600">{t('create.issuer')}:</span>
                <p className="font-semibold text-green-800">{user.ens}</p>
              </div>
              <div>
                <span className="text-sm text-green-600">{t('create.balance')}:</span>
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
                {t('create.form.name')} *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t('create.form.name_placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {t('create.form.description')} *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder={t('create.form.description_placeholder')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                {t('create.form.category')} *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="food">{t('create.category.food')}</option>
                <option value="fitness">{t('create.category.fitness')}</option>
                <option value="beauty">{t('create.category.beauty')}</option>
                <option value="retail">{t('create.category.retail')}</option>
                <option value="entertainment">{t('create.category.entertainment')}</option>
                <option value="other">{t('create.category.other')}</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('create.form.total_supply')} *
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
                  {t('create.form.price')} *
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
                {t('create.form.min_goal')} *
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
                {t('create.form.min_goal_note')}
              </p>
            </div>

            {/* 平台说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">{t('create.platform_title')}</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {t('create.platform.fee')}</li>
                <li>• {t('create.platform.smart_contract')}</li>
                <li>• {t('create.platform.blockchain')}</li>
                <li>• {t('create.platform.redemption')}</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {submitLoading ? t('create.form.submitting') : t('create.form.submit')}
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
          <p>Loading...</p>
        </div>
      </div>
    }>
      <CreateContent />
    </ClientOnly>
  );
}
