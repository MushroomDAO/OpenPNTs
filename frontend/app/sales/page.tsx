'use client';

import Link from 'next/link';
import { useReadContract } from 'wagmi';
import { SaleFactoryABI, SaleABI, OpenPNTsABI, MockERC20ABI } from '../../lib/contracts/abis';
import { SALE_FACTORY_ADDRESS, OPEN_PNTS_ADDRESS } from '../../lib/constants';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

interface SaleCardProps {
  saleAddress: `0x${string}`;
}

function SaleCard({ saleAddress }: SaleCardProps) {
  const { data: pntContractAddress } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'PNT_CONTRACT',
  });

  const { data: tokenId } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'TOKEN_ID',
  });

  const { data: beneficiary } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'BENEFICIARY',
  });

  const { data: price } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'PRICE',
  });

  const { data: currencyAddress } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'CURRENCY',
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

  const { data: saleEndTime } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'SALE_END_TIME',
  });

  const { data: pntUri } = useReadContract({
    address: OPEN_PNTS_ADDRESS,
    abi: OpenPNTsABI,
    functionName: 'uri',
    args: [tokenId || 0],
    query: { enabled: !!tokenId && !!OPEN_PNTS_ADDRESS },
  });

  const [pntMetadata, setPntMetadata] = useState<any>(null);
  useEffect(() => {
    if (pntUri && tokenId !== undefined) {
      const fetchMetadata = async () => {
        try {
          const metadataUrl = pntUri.replace('{id}', tokenId.toString());
          const response = await fetch(metadataUrl);
          const data = await response.json();
          setPntMetadata(data);
        } catch (err) {
          console.error("Failed to fetch PNT metadata for sale card:", err);
        }
      };
      fetchMetadata();
    }
  }, [pntUri, tokenId]);

  const isLoading = !pntContractAddress || !tokenId || !beneficiary || !price || !currencyAddress || !saleEndTime || !pntUri || !currencySymbol || !currencyDecimals;

  if (isLoading) return <div className="p-4 border rounded-lg shadow-sm">Loading sale...</div>;

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
    query: { select: (data: any) => data.length }, // Assuming deployedSales is a public array
  });

  const [saleAddresses, setSaleAddresses] = useState<`0x${string}`[]>([]);

  // This effect fetches all deployed sale addresses
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

  if (isLoadingLength) return <div className="text-center p-8">Loading sales...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Loyalty Point Pre-Sales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {saleAddresses.length === 0 ? (
          <p>No sales found. Be the first to create one!</p>
        ) : (
          saleAddresses.map((addr) => (
            <SaleCard key={addr} saleAddress={addr} />
          ))
        )}
      </div>
    </div>
  );
}
