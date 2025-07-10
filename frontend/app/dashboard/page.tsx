'use client';

import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { SaleFactoryABI, SaleABI, MockERC20ABI } from '../../lib/contracts/abis';
import { SALE_FACTORY_ADDRESS } from '../../lib/constants';
import Link from 'next/link';

interface SaleDashboardCardProps {
  saleAddress: `0x${string}`;
  saleDetails: any; // Raw data from useReadContracts
  currencySymbol: string | undefined;
  currencyDecimals: number | undefined;
  userAddress: `0x${string}`;
}

function SaleDashboardCard({ saleAddress, saleDetails, currencySymbol, currencyDecimals, userAddress }: SaleDashboardCardProps) {
  const price = saleDetails[3]?.result;
  const maxPointsToSell = saleDetails[4]?.result;
  const minPointsToSell = saleDetails[5]?.result;
  const saleStartTime = saleDetails[6]?.result;
  const saleEndTime = saleDetails[7]?.result;
  const totalPointsSold = saleDetails[8]?.result;
  const saleState = saleDetails[9]?.result;

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

  // Prepare contracts array for useReadContracts for all sales
  const allSaleContracts = allSaleAddresses.flatMap(addr => [
    { address: addr, abi: SaleABI, functionName: 'BENEFICIARY' },
    { address: addr, abi: SaleABI, functionName: 'PRICE' },
    { address: addr, abi: SaleABI, functionName: 'MAX_POINTS_TO_SELL' },
    { address: addr, abi: SaleABI, functionName: 'MIN_POINTS_TO_SELL' },
    { address: addr, abi: SaleABI, functionName: 'SALE_START_TIME' },
    { address: addr, abi: SaleABI, functionName: 'SALE_END_TIME' },
    { address: addr, abi: SaleABI, functionName: 'totalPointsSold' },
    { address: addr, abi: SaleABI, functionName: 'saleState' },
    { address: addr, abi: SaleABI, functionName: 'CURRENCY' }, // Added currency address to fetch currency details
  ]);

  const { data: allSalesData, isLoading: isLoadingAllSalesData } = useReadContracts({
    contracts: allSaleContracts,
    query: { enabled: allSaleAddresses.length > 0 },
  });

  // Filter and process sales for the current user
  const mySales = allSaleAddresses.filter((addr, index) => {
    const startIndex = index * 9; // 9 calls per sale
    const beneficiary = allSalesData?.[startIndex]?.result as `0x${string}`;
    return beneficiary && beneficiary.toLowerCase() === address?.toLowerCase();
  }).map((addr, index) => {
    const startIndex = allSaleAddresses.indexOf(addr) * 9; // Find original index to get data
    const details = allSalesData?.slice(startIndex, startIndex + 9);
    const currencyAddress = details?.[8]?.result as `0x${string}`;
    return {
      saleAddress: addr,
      details: details,
      currencyAddress: currencyAddress,
    };
  });

  // Fetch currency symbols and decimals in batch for my sales
  const myCurrencyContracts = mySales.flatMap(sale => [
    { address: sale.currencyAddress, abi: MockERC20ABI, functionName: 'symbol' },
    { address: sale.currencyAddress, abi: MockERC20ABI, functionName: 'decimals' },
  ]);

  const { data: myCurrencyData, isLoading: isLoadingMyCurrencyData } = useReadContracts({
    contracts: myCurrencyContracts,
    query: { enabled: mySales.length > 0 && myCurrencyContracts.every(c => !!c.address) },
  });

  if (!isConnected) return <div className="text-center p-8">Please connect your wallet to view your dashboard.</div>;
  if (isLoadingLength || isLoadingAllSalesData || isLoadingMyCurrencyData) return <div className="text-center p-8">Loading your sales...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Sales Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mySales.length === 0 ? (
          <p>You haven't created any sales yet. Go to <Link href="/create" className="text-blue-500 hover:underline">Create Digital Points Card</Link> to launch one!</p>
        ) : (
          mySales.map((sale, index) => {
            const currencySymbol = myCurrencyData?.[index * 2]?.result as string;
            const currencyDecimals = myCurrencyData?.[index * 2 + 1]?.result as number;

            return (
              <SaleDashboardCard
                key={sale.saleAddress}
                saleAddress={sale.saleAddress}
                saleDetails={sale.details}
                currencySymbol={currencySymbol}
                currencyDecimals={currencyDecimals}
                userAddress={address as `0x${string}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}