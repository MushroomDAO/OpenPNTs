'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// 翻译字典
const translations = {
  zh: {
    'switch.language': 'EN',
    'platform.title': 'OpenPNTs Platform',
    'home.title': 'PNTs - 全球统一忠诚度积分',
    'home.subtitle': '去中心化固定佣金的美团 | 1.5% vs 30-60% = 20-40倍更低获客成本',
    'nav.browse': '浏览所有预售',
    'nav.launch': 'Launch Your PNTs',
    'nav.login_required': '请先登录AirAccount',
    'features.play2earn.title': '免费获得积分',
    'features.play2earn.desc': '通过消费、完成任务或游戏赚取忠诚度积分。Play2B2E模式让您轻松获得PNTs。',
    'features.cps.title': '消费即优惠',
    'features.cps.desc': '客户消费时商家才给出优惠，CPS佣金模式确保双赢。智能合约自动分配收益。',
    'features.crypto.title': '加密资产支付',
    'features.crypto.desc': '支持多种加密货币支付，全球通用。区块链技术确保交易透明安全。',
    'core.title': '核心竞争力',
    'core.innovation': 'Play2B2E + CPS + Crypto',
    'core.innovation.desc': '游戏化获取积分 + 按效果付费 + 加密货币支付，三重创新模式重新定义商业忠诚度体系。',
    'core.tech': '智能合约 + 去中心化计算 + AI优化',
    'core.tech.desc': '区块链技术保证透明度，AI算法优化推荐，去中心化计算确保平台去中心化运营。',
    'demo.title': '体验演示',
    'demo.desc': '无需钱包连接，使用本地测试数据快速体验Alice咖啡店和Bob客户的完整交互流程',
    'demo.button': '立即体验 Demo',
    'demo.note': '本地 Anvil 网络 | 无需 MetaMask',
    'footer.copyright': '全球统一积分系统 - 让忠诚度更有价值'
  },
  en: {
    'switch.language': '中文',
    'platform.title': 'OpenPNTs Platform',
    'home.title': 'PNTs - Global Unified Loyalty Points',
    'home.subtitle': 'Decentralized Fixed Commission Platform | 1.5% vs 30-60% = 20-40x Lower Customer Acquisition Cost',
    'nav.browse': 'Browse All Presales',
    'nav.launch': 'Launch Your PNTs',
    'nav.login_required': 'Please Login AirAccount First',
    'features.play2earn.title': 'Earn Points for Free',
    'features.play2earn.desc': 'Earn loyalty points through consumption, completing tasks, or gaming. Play2B2E model makes earning PNTs easy.',
    'features.cps.title': 'Pay-for-Performance',
    'features.cps.desc': 'Merchants only offer discounts when customers spend. CPS commission model ensures win-win outcomes.',
    'features.crypto.title': 'Crypto Asset Payment',
    'features.crypto.desc': 'Support multiple cryptocurrency payments, globally accessible. Blockchain technology ensures transparent and secure transactions.',
    'core.title': 'Core Competitiveness',
    'core.innovation': 'Play2B2E + CPS + Crypto',
    'core.innovation.desc': 'Gamified earning + Pay-for-performance + Cryptocurrency payment, triple innovation model redefining business loyalty systems.',
    'core.tech': 'Smart Contracts + Decentralized Computing + AI Optimization',
    'core.tech.desc': 'Blockchain technology ensures transparency, AI algorithms optimize recommendations, decentralized computing ensures platform decentralization.',
    'demo.title': 'Experience Demo',
    'demo.desc': 'No wallet connection required, experience the complete interaction between Alice Coffee Shop and Bob customers with local test data',
    'demo.button': 'Try Demo Now',
    'demo.note': 'Local Anvil Network | No MetaMask Required',
    'footer.copyright': 'Global Unified Points System - Making Loyalty More Valuable'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['zh']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
} 