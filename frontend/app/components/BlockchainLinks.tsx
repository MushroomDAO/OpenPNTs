'use client';

import React from 'react';
import { 
  getTransactionUrl, 
  getAddressUrl, 
  formatTxHash, 
  formatAddress, 
  getNetworkConfig,
  Network 
} from '../../lib/blockchain';

// 交易链接组件
export function TransactionLink({ 
  txHash, 
  children, 
  className = '',
  network
}: {
  txHash: string;
  children?: React.ReactNode;
  className?: string;
  network?: Network;
}) {
  const url = getTransactionUrl(txHash, network);
  const config = getNetworkConfig();
  
  if (!url) {
    // 本地网络显示交易哈希但不链接
    return (
      <span className={`font-mono text-sm ${className}`} title={txHash}>
        {children || formatTxHash(txHash)}
        <span className="text-xs text-gray-500 ml-2">(Local)</span>
      </span>
    );
  }
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline ${className}`}
      title={`在 ${config.explorerName} 查看交易`}
    >
      {children || formatTxHash(txHash)}
      <span className="text-xs ml-1">↗</span>
    </a>
  );
}

// 地址链接组件
export function AddressLink({ 
  address, 
  children, 
  className = '',
  network
}: {
  address: string;
  children?: React.ReactNode;
  className?: string;
  network?: Network;
}) {
  const url = getAddressUrl(address, network);
  const config = getNetworkConfig();
  
  if (!url) {
    return (
      <span className={`font-mono text-sm ${className}`} title={address}>
        {children || formatAddress(address)}
        <span className="text-xs text-gray-500 ml-2">(Local)</span>
      </span>
    );
  }
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline ${className}`}
      title={`在 ${config.explorerName} 查看地址`}
    >
      {children || formatAddress(address)}
      <span className="text-xs ml-1">↗</span>
    </a>
  );
}

// 网络状态指示器
export function NetworkIndicator({ className = '' }: { className?: string }) {
  const config = getNetworkConfig();
  
  const getNetworkColor = () => {
    switch (config.chainId) {
      case 1: return 'text-green-600 bg-green-50 border-green-200'; // Mainnet
      case 11155111: return 'text-orange-600 bg-orange-50 border-orange-200'; // Sepolia
      case 31337: return 'text-blue-600 bg-blue-50 border-blue-200'; // Local
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium ${getNetworkColor()} ${className}`}>
      <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
      {config.name}
    </div>
  );
}

// 交易状态组件
export function TransactionStatus({ 
  status, 
  txHash, 
  className = '' 
}: {
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  className?: string;
}) {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'pending': return '等待确认';
      case 'confirmed': return '已确认';
      case 'failed': return '失败';
      default: return '未知';
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'failed': return '❌';
      default: return '❓';
    }
  };
  
  return (
    <div className={`inline-flex items-center px-3 py-2 rounded-lg border ${getStatusStyles()} ${className}`}>
      <span className="mr-2">{getStatusIcon()}</span>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{getStatusText()}</span>
        {txHash && (
          <TransactionLink txHash={txHash} className="text-xs" />
        )}
      </div>
    </div>
  );
}

// 交易详情卡片
export function TransactionCard({
  title,
  description,
  txHash,
  status,
  amount,
  timestamp,
  className = ''
}: {
  title: string;
  description?: string;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  amount?: string;
  timestamp?: number;
  className?: string;
}) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <TransactionStatus status={status} className="ml-4" />
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">交易哈希:</span>
          <TransactionLink txHash={txHash} />
        </div>
        
        {amount && (
          <div className="flex justify-between">
            <span className="text-gray-500">金额:</span>
            <span className="font-medium">{amount}</span>
          </div>
        )}
        
        {timestamp && (
          <div className="flex justify-between">
            <span className="text-gray-500">时间:</span>
            <span className="text-gray-700">{formatTime(timestamp)}</span>
          </div>
        )}
      </div>
    </div>
  );
} 