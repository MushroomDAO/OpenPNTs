'use client';

import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from '@wagmi/connectors';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">OpenPNTs Platform</h1>

      {!isConnected && (
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          onClick={() => connect({ connector: injected() })}
        >
          Connect Wallet
        </button>
      )}

      {isConnected && (
        <div className="flex flex-col items-center">
          <p className="text-lg mb-4">Connected: {address}</p>
          <button
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors mb-4"
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
          <Link href="/create">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors mb-4">
              Create Digital Points Card
            </button>
          </Link>
          <Link href="/sales">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors mb-4">
              Browse All Sales
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition-colors">
              Your Dashboard
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}
