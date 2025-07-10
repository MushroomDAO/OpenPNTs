'use client';

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, metaMask, walletConnect } from '@wagmi/connectors'; // Original import

// Configure chains
const chains = [
  sepolia,
];

// Create Wagmi config
const config = createConfig({
  chains,
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '' }),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'), // Fallback for direct pnpm dev
  },
});

// Create a React Query client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}