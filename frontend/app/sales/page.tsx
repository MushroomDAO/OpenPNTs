'use client';

import Link from 'next/link';
import { useReadContract, useReadContracts } from 'wagmi';
import { SaleFactoryABI, SaleABI, OpenPNTsABI, MockERC20ABI } from '../../lib/contracts/abis';
import { SALE_FACTORY_ADDRESS, OPEN_PNTS_ADDRESS } from '../../lib/constants';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

interface SaleCardProps {
  saleAddress: `0x${string}`;
  saleDetails: any; // Raw data from useReadContracts
  pntMetadata: any; // Fetched PNT metadata
  currencySymbol: string | undefined;
  currencyDecimals: number | undefined;
}

function SaleCard({ saleAddress, saleDetails, pntMetadata, currencySymbol, currencyDecimals }: SaleCardProps) {
  const price = saleDetails[3]?.result;
  const saleEndTime = saleDetails[7]?.result;
  const beneficiary = saleDetails[4]?.result;

  const formattedPrice = price && currencyDecimals !== undefined ? formatUnits(price, currencyDecimals) : 'N/A';
  const endTimeDate = saleEndTime ? new Date(Number(saleEndTime) * 1000).toLocaleString() : 'N/A';

  return (
    <Link href={`/sale/${saleAddress}`} className="block">
      <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <h3 className="text-xl font-semibold mb-2">{pntMetadata?.name || 'Unnamed Loyalty Points'}</h3>
        <p className="text-gray-600">by {beneficiary}</p>
        <p>Price: {formattedPrice} {currencySymbol || 'CURRENCY'} per point</p>
        <p>Ends: {endTimeDate}</p>
        {pntMetadata?.image && <img src={pntMetadata.image} alt={pntMetadata.name} className="w-16 h-16 rounded-full mt-2" />}
      </div>
    </Link>
  );
}

export default function SalesPage() {
  const { data: deployedSalesLength, isLoading: isLoadingLength } = useReadContract({
    address: SALE_FACTORY_ADDRESS,
    abi: SaleFactoryABI,
    functionName: 'deployedSales',
    args: [],
    query: { select: (data: any) => data.length },
  });

  const [saleAddresses, setSaleAddresses] = useState<`0x${string}`[]>([]);

  // Fetch all deployed sale addresses using a loop (still needed for now as useReadContracts doesn't take dynamic array length)
  useEffect(() => {
    const fetchAddresses = async () => {
      if (deployedSalesLength === undefined) return;

      const addresses: `0x${string}`[] = [];
      for (let i = 0; i < Number(deployedSalesLength); i++) {
        // This is a simplified approach. In a real app, you'd use multicall or a custom hook
        // to fetch array elements more efficiently.
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
      setSaleAddresses(addresses);
    };
    fetchAddresses();
  }, [deployedSalesLength]);

  // Prepare contracts array for useReadContracts
  const saleContracts = saleAddresses.flatMap(addr => [
    { address: addr, abi: SaleABI, functionName: 'PNT_CONTRACT' },
    { address: addr, abi: SaleABI, functionName: 'TOKEN_ID' },
    { address: addr, abi: SaleABI, functionName: 'BENEFICIARY' },
    { address: addr, abi: SaleABI, functionName: 'PRICE' },
    { address: addr, abi: SaleABI, functionName: 'CURRENCY' },
    { address: addr, abi: SaleABI, functionName: 'MAX_POINTS_TO_SELL' },
    { address: addr, abi: SaleABI, functionName: 'MIN_POINTS_TO_SELL' },
    { address: addr, abi: SaleABI, functionName: 'SALE_START_TIME' },
    { address: addr, abi: SaleABI, functionName: 'SALE_END_TIME' },
    { address: addr, abi: SaleABI, functionName: 'totalPointsSold' },
    { address: addr, abi: SaleABI, functionName: 'saleState' },
  ]);

  const { data: salesData, isLoading: isLoadingSalesData } = useReadContracts({
    contracts: saleContracts,
    query: { enabled: saleAddresses.length > 0 },
  });

  // Extract and process data for each sale
  const processedSales = saleAddresses.map((addr, index) => {
    const startIndex = index * 11; // 11 calls per sale
    const details = salesData?.slice(startIndex, startIndex + 11);

    const currencyAddress = details?.[4]?.result as `0x${string}`;
    const tokenId = details?.[1]?.result as bigint;

    return {
      saleAddress: addr,
      details: details,
      currencyAddress: currencyAddress,
      tokenId: tokenId,
    };
  });

  // Fetch currency symbols and decimals in batch
  const currencyContracts = processedSales.flatMap(sale => [
    { address: sale.currencyAddress, abi: MockERC20ABI, functionName: 'symbol' },
    { address: sale.currencyAddress, abi: MockERC20ABI, functionName: 'decimals' },
  ]);

  const { data: currencyData, isLoading: isLoadingCurrencyData } = useReadContracts({
    contracts: currencyContracts,
    query: { enabled: processedSales.length > 0 && currencyContracts.every(c => !!c.address) },
  });

  // Fetch PNT metadata URIs in batch
  const pntUriContracts = processedSales.flatMap(sale => [
    { address: OPEN_PNTS_ADDRESS, abi: OpenPNTsABI, functionName: 'uri', args: [sale.tokenId || 0] },
  ]);

  const { data: pntUriData, isLoading: isLoadingPntUriData } = useReadContracts({
    contracts: pntUriContracts,
    query: { enabled: processedSales.length > 0 && !!OPEN_PNTS_ADDRESS },
  });

  const [pntMetadatas, setPntMetadatas] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllPntMetadata = async () => {
      if (!pntUriData || pntUriData.length === 0) return;

      const fetchedMetadatas = await Promise.all(pntUriData.map(async (uriResult, index) => {
        const uri = uriResult?.result as string;
        const sale = processedSales[index];
        if (uri && sale.tokenId !== undefined) {
          try {
            const metadataUrl = uri.replace('{id}', sale.tokenId.toString());
            const response = await fetch(metadataUrl);
            const data = await response.json();
            return data;
          } catch (err) {
            console.error("Failed to fetch PNT metadata for sale:", sale.saleAddress, err);
            return null;
          }
        }
        return null;
      }));
      setPntMetadatas(fetchedMetadatas);
    };
    fetchAllPntMetadata();
  }, [pntUriData, processedSales]);

  if (isLoadingLength || isLoadingSalesData || isLoadingCurrencyData || isLoadingPntUriData) return <div className="text-center p-8">Loading sales...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Loyalty Point Pre-Sales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {processedSales.length === 0 ? (
          <p>No sales found. Be the first to create one!</p>
        ) : (
          processedSales.map((sale, index) => {
            const currencySymbol = currencyData?.[index * 2]?.result as string;
            const currencyDecimals = currencyData?.[index * 2 + 1]?.result as number;
            const pntMetadata = pntMetadatas[index];

            return (
              <SaleCard
                key={sale.saleAddress}
                saleAddress={sale.saleAddress}
                saleDetails={sale.details}
                pntMetadata={pntMetadata}
                currencySymbol={currencySymbol}
                currencyDecimals={currencyDecimals}
              />
            );
          })
        )}
      </div>
    </div>
  );
}