'use client';

import Link from 'next/link';
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from '@wagmi/connectors'; // Original import
import { OpenPNTsABI } from '../lib/contracts/abis';
import { OPEN_PNTS_ADDRESS } from '../lib/constants';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // For platform owner to create initial PNT (Token ID 0 for Alice)
  const { writeContract: writeCreatePNT, data: createPNTHash } = useWriteContract();
  const { isLoading: isCreatingPNT, isSuccess: isPNTCreated } = useWaitForTransactionReceipt({
    hash: createPNTHash,
  });

  const handleCreateInitialPNT = () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first.');
      return;
    }
    // This assumes the connected wallet is the platform owner
    // and creates a PNT for Alice (Token ID 0)
    writeCreatePNT({
      address: OPEN_PNTS_ADDRESS,
      abi: OpenPNTsABI,
      functionName: 'create',
      args: [address, BigInt(1_000_000_000)], // Mint 1 billion points to the platform owner
    });
  };

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

          {/* Temporary button for platform owner to create initial PNT */}
          <button
            className="px-6 py-3 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition-colors mb-4"
            onClick={handleCreateInitialPNT}
            disabled={isCreatingPNT || isPNTCreated}
          >
            {isCreatingPNT ? 'Creating PNT...' : isPNTCreated ? 'PNT Created!' : 'Create Initial PNT (Platform Owner)'}
          </button>
          {createPNTHash && <p className="mt-2 text-sm text-gray-600">PNT Creation Tx: <a href={`https://sepolia.etherscan.io/tx/${createPNTHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{createPNTHash}</a></p>}


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
