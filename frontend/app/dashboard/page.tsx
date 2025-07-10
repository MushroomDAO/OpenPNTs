'use client';

import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { SaleFactoryABI, SaleABI, OpenPNTsABI, MockERC20ABI } from '../../lib/contracts/abis';
import { SALE_FACTORY_ADDRESS, OPEN_PNTS_ADDRESS } from '../../lib/constants';

interface SaleDashboardCardProps {
  saleAddress: `0x${string}`;
  userAddress: `0x${string}`;
}

function SaleDashboardCard({ saleAddress, userAddress }: SaleDashboardCardProps) {
  const { data: beneficiary } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'BENEFICIARY',
  });

  const { data: tokenId } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'TOKEN_ID',
  });

  const { data: currencyAddress } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'CURRENCY',
  });

  const { data: price } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'PRICE',
  });

  const { data: maxPointsToSell } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'MAX_POINTS_TO_SELL',
  });

  const { data: minPointsToSell } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'MIN_POINTS_TO_SELL',
  });

  const { data: saleStartTime } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'SALE_START_TIME',
  });

  const { data: saleEndTime } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'SALE_END_TIME',
  });

  const { data: totalPointsSold } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'totalPointsSold',
  });

  const { data: saleState } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'saleState',
  });

  const { data: currencySymbol } = useReadContract({
    address: currencyAddress as `0x${string}`,
    abi: MockERC20ABI,
    functionName: 'symbol',
    query: { enabled: !!currencyAddress },
  });

  const { data: currencyDecimals } = useReadContract({
    address: currencyAddress as `0x${string}`,
    abi: MockERC20ABI,
    functionName: 'decimals',
    query: { enabled: !!currencyAddress },
  });

  const { writeContract: writeWithdraw, data: withdrawHash, isPending: isWithdrawing } = useWriteContract();
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const { writeContract: writeFinalize, data: finalizeHash, isPending: isFinalizing } = useWriteContract();
  const { isLoading: isFinalizeConfirming, isSuccess: isFinalizeSuccess } = useWaitForTransactionReceipt({
    hash: finalizeHash,
  });

  const handleWithdraw = () => {
    if (!userAddress) return;
    writeWithdraw({
      address: saleAddress,
      abi: SaleABI,
      functionName: 'withdraw',
      args: [],
    });
  };

  const handleFinalize = () => {
    if (!userAddress) return;
    writeFinalize({
      address: saleAddress,
      abi: SaleABI,
      functionName: 'finalize',
      args: [],
    });
  };

  const isLoading = !beneficiary || !tokenId || !currencyAddress || !price || !maxPointsToSell || !minPointsToSell ||
                    !saleStartTime || !saleEndTime || !totalPointsSold || !saleState || !currencySymbol || !currencyDecimals;

  if (isLoading) return <div className="p-4 border rounded-lg shadow-sm">Loading sale...</div>;

  const formatTimestamp = (timestamp: bigint | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const getSaleStateString = (state: number | undefined) => {
    switch (state) {
      case 0: return 'Pending';
      case 1: return 'Active';
      case 2: return 'Successful';
      case 3: return 'Failed';
      case 4: return 'Closed';
      default: return 'Unknown';
    }
  };

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const isSaleEnded = currentTimestamp > Number(saleEndTime);
  const isSaleSuccessful = saleState === 2;
  const isSaleFailed = saleState === 3;
  const isSaleActive = saleState === 1;

  const totalRaised = totalPointsSold && price && currencyDecimals !== undefined
    ? formatUnits(totalPointsSold * price, currencyDecimals)
    : 'N/A';

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">Sale: {saleAddress.slice(0, 6)}...{saleAddress.slice(-4)}</h3>
      <p><strong>Status:</strong> {getSaleStateString(saleState)}</p>
      <p><strong>Points Sold:</strong> {totalPointsSold?.toString()} / {maxPointsToSell?.toString()}</p>
      <p><strong>Total Raised:</strong> {totalRaised} {currencySymbol}</p>
      <p><strong>Ends:</strong> {formatTimestamp(saleEndTime)}</p>

      <div className="mt-4 space-x-2">
        {isSaleEnded && (saleState === 0 || saleState === 1) && (
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            onClick={handleFinalize}
            disabled={isFinalizing || isFinalizeConfirming}
          >
            {isFinalizing || isFinalizeConfirming ? 'Finalizing...' : 'Finalize Sale'}
          </button>
        )}

        {isSaleSuccessful && (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            onClick={handleWithdraw}
            disabled={isWithdrawing || isWithdrawConfirming}
          >
            {isWithdrawing || isWithdrawConfirming ? 'Withdrawing...' : 'Withdraw Funds'}
          </button>
        )}
      </div>
      {withdrawHash && <p className="mt-2 text-sm text-gray-600">Withdraw Tx: <a href={`https://sepolia.etherscan.io/tx/${withdrawHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{withdrawHash}</a></p>}
      {finalizeHash && <p className="mt-2 text-sm text-gray-600">Finalize Tx: <a href={`https://sepolia.etherscan.io/tx/${finalizeHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{finalizeHash}</a></p>}
    </div>
  );
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  const { data: deployedSalesLength, isLoading: isLoadingLength } = useReadContract({
    address: SALE_FACTORY_ADDRESS,
    abi: SaleFactoryABI,
    functionName: 'deployedSales',
    args: [],
    query: { select: (data: any) => data.length },
  });

  const [allSaleAddresses, setAllSaleAddresses] = useState<`0x${string}`[]>([]);
  const [mySales, setMySales] = useState<`0x${string}`[]>([]);

  // Fetch all deployed sale addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (deployedSalesLength === undefined) return;

      const addresses: `0x${string}`[] = [];
      for (let i = 0; i < Number(deployedSalesLength); i++) {
        const { data: saleAddress } = await useReadContract({
          address: SALE_FACTORY_ADDRESS,
          abi: SaleFactoryABI,
          functionName: 'deployedSales',
          args: [BigInt(i)],
        });
        if (saleAddress) {
          addresses.push(saleAddress as `0x${string}`);
        }
      }
      setAllSaleAddresses(addresses);
    };
    fetchAddresses();
  }, [deployedSalesLength]);

  // Filter sales by beneficiary
  useEffect(() => {
    const filterMySales = async () => {
      if (!address || allSaleAddresses.length === 0) {
        setMySales([]);
        return;
      }

      const filtered: `0x${string}`[] = [];
      for (const saleAddress of allSaleAddresses) {
        const { data: beneficiary } = await useReadContract({
          address: saleAddress,
          abi: SaleABI,
          functionName: 'BENEFICIARY',
        });
        if (beneficiary && beneficiary.toLowerCase() === address.toLowerCase()) {
          filtered.push(saleAddress);
        }
      }
      setMySales(filtered);
    };
    filterMySales();
  }, [address, allSaleAddresses]);

  if (!isConnected) return <div className="text-center p-8">Please connect your wallet to view your dashboard.</div>;
  if (isLoadingLength) return <div className="text-center p-8">Loading your sales...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Sales Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mySales.length === 0 ? (
          <p>You haven't created any sales yet. Go to <Link href="/create" className="text-blue-500 hover:underline">Create Digital Points Card</Link> to launch one!</p>
        ) : (
          mySales.map((addr) => (
            <SaleDashboardCard key={addr} saleAddress={addr} userAddress={address} />
          ))
        )}
      </div>
    </div>
  );
}
