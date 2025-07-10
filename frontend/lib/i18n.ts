import { useState, useEffect } from 'react';

export type Language = 'en' | 'zh';

interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

export const translations: Translations = {
  // 通用
  'platform.title': {
    en: 'OpenPNTs Platform',
    zh: 'OpenPNTs 平台'
  },
  'platform.subtitle': {
    en: 'Blockchain Loyalty Points Platform - Secure and transparent digital points solution for small businesses',
    zh: '链上忠诚度积分平台 - 为小型企业提供安全、透明的数字积分解决方案'
  },
  'connect.wallet': {
    en: 'Connect Wallet',
    zh: '连接钱包'
  },
  'switch.language': {
    en: '中文',
    zh: 'English'
  },

  // 首页标题和描述
  'home.welcome': {
    en: 'Welcome to the Future of Loyalty Points',
    zh: '欢迎来到忠诚度积分的未来'
  },
  'home.description': {
    en: 'Build, manage, and trade digital loyalty points on the blockchain. Transparent, secure, and efficient.',
    zh: '在区块链上构建、管理和交易数字忠诚度积分。透明、安全、高效。'
  },

  // 角色入口
  'role.business.title': {
    en: 'For Businesses',
    zh: '企业用户'
  },
  'role.business.desc': {
    en: 'Create and manage your own loyalty point system',
    zh: '创建和管理您自己的忠诚度积分系统'
  },
  'role.customer.title': {
    en: 'For Customers',
    zh: '客户用户'
  },
  'role.customer.desc': {
    en: 'Earn, collect, and trade loyalty points',
    zh: '赚取、收集和交易忠诚度积分'
  },
  'role.investor.title': {
    en: 'For Investors',
    zh: '投资者'
  },
  'role.investor.desc': {
    en: 'Participate in early-stage loyalty point sales',
    zh: '参与早期忠诚度积分预售'
  },

  // 功能按钮
  'action.create': {
    en: 'Create Points',
    zh: '创建积分'
  },
  'action.explore': {
    en: 'Explore Sales',
    zh: '浏览预售'
  },
  'action.dashboard': {
    en: 'Dashboard',
    zh: '仪表板'
  },
  'action.demo': {
    en: 'Try Demo (No Wallet)',
    zh: '体验演示（无需钱包）'
  },

  // 故事内容
  'story.title': {
    en: 'The Alice & Bob Story',
    zh: 'Alice 和 Bob 的故事'
  },
  'story.alice.intro': {
    en: 'Alice owns a local coffee shop and wants to reward loyal customers.',
    zh: 'Alice 拥有一家本地咖啡店，想要奖励忠实客户。'
  },
  'story.alice.action': {
    en: 'She creates "CoffeeCoin" loyalty points on our platform.',
    zh: '她在我们平台上创建了"咖啡币"忠诚度积分。'
  },
  'story.bob.intro': {
    en: 'Bob is a regular customer who loves Alice\'s coffee.',
    zh: 'Bob 是一位喜爱 Alice 咖啡的常客。'
  },
  'story.bob.action': {
    en: 'He earns CoffeeCoin with each purchase and can trade them for free coffee.',
    zh: '他每次购买都能获得咖啡币，可以用来兑换免费咖啡。'
  },
  'story.win': {
    en: 'Both Alice and Bob benefit from transparent, blockchain-based loyalty rewards!',
    zh: 'Alice 和 Bob 都从透明的区块链忠诚度奖励中受益！'
  },

  // 特性
  'feature.transparent': {
    en: 'Transparent',
    zh: '透明'
  },
  'feature.secure': {
    en: 'Secure',
    zh: '安全'
  },
  'feature.tradeable': {
    en: 'Tradeable',
    zh: '可交易'
  },

  // 测试模式
  'test.mode': {
    en: 'Test Mode (Local Network)',
    zh: '测试模式（本地网络）'
  },
  'test.description': {
    en: 'Experience the platform without connecting a wallet',
    zh: '无需连接钱包即可体验平台'
  },
};

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('zh');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'zh')) {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return { language, toggleLanguage, t };
} 