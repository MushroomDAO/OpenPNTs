'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode, useEffect, createContext, useContext } from 'react';
import { AirAccountUser, AirAccountContextType, loginWithEmail, mockFingerprint } from '../lib/airaccount';
import { LanguageProvider } from '../lib/i18n';

interface ProvidersProps {
  children: ReactNode;
}

// 创建AirAccount Context
const AirAccountContext = createContext<AirAccountContextType | undefined>(undefined);

// Hook来使用AirAccount
export function useAirAccount() {
  const context = useContext(AirAccountContext);
  if (context === undefined) {
    throw new Error('useAirAccount must be used within an AirAccountProvider');
  }
  return context;
}

// AirAccount Provider组件
function AirAccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AirAccountUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 页面加载时检查本地存储（仅在客户端）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('airaccount_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse saved user data:', error);
          localStorage.removeItem('airaccount_user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const userData = await loginWithEmail(email);
      if (userData) {
        setUser(userData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('airaccount_user', JSON.stringify(userData));
        }
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  // 退出登录
  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('airaccount_user');
    }
  };

  // 指纹验证
  const fingerprintAuth = async (): Promise<boolean> => {
    try {
      const success = await mockFingerprint();
      
      if (success && user) {
        // 更新用户验证状态
        const updatedUser = { ...user, isVerified: true };
        setUser(updatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('airaccount_user', JSON.stringify(updatedUser));
        }
      }
      
      return success;
    } catch (error) {
      console.error('Fingerprint authentication failed:', error);
      return false;
    }
  };

  // 刷新余额（模拟从链上获取）
  const refreshBalance = async (): Promise<void> => {
    if (!user) return;
    
    try {
      // 模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟余额变化
      const randomChange = Math.floor(Math.random() * 20) - 10; // -10 到 +10
      const newBalance = Math.max(0, user.pntsBalance + randomChange);
      
      const updatedUser = { ...user, pntsBalance: newBalance };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('airaccount_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const contextValue: AirAccountContextType = {
    user,
    isLoading,
    login,
    logout,
    mockFingerprint: fingerprintAuth,
    refreshBalance
  };

  return (
    <AirAccountContext.Provider value={contextValue}>
      {children}
    </AirAccountContext.Provider>
  );
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1分钟
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  // 防止SSR期间渲染时的hydration问题
  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AirAccountProvider>
          {children}
        </AirAccountProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}