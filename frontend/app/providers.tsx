'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '../lib/wagmi';
import { useState, ReactNode, useEffect } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1分钟
        refetchOnWindowFocus: false,
        retry: false, // 防止SSR期间重试
      },
    },
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  // 防止SSR期间渲染Web3组件
  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}