'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { OpenPNTsABI, SaleABI, MockERC20ABI } from '../../../lib/contracts/abis';
import { OPEN_PNTS_ADDRESS } from '../../../lib/constants';

export default function SalePage() {
  const params = useParams();
  const saleAddress = params.saleAddress as `0x${string}`;

  const { address, isConnected } = useAccount();
  const [purchaseAmount, setPurchaseAmount] = useState('');

  // --- Read Sale Contract Data ---
  const { data: saleDetails, isLoading: isLoadingSaleDetails, error: saleDetailsError } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'PNT_CONTRACT',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: tokenId, isLoading: isLoadingTokenId } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'TOKEN_ID',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: currencyAddress, isLoading: isLoadingCurrency } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'CURRENCY',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: price, isLoading: isLoadingPrice } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'PRICE',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: maxPointsToSell, isLoading: isLoadingMaxPoints } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'MAX_POINTS_TO_SELL',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: minPointsToSell, isLoading: isLoadingMinPoints } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'MIN_POINTS_TO_SELL',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: saleStartTime, isLoading: isLoadingStartTime } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'SALE_START_TIME',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: saleEndTime, isLoading: isLoadingEndTime } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'SALE_END_TIME',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: beneficiary, isLoading: isLoadingBeneficiary } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'BENEFICIARY',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: totalPointsSold, isLoading: isLoadingTotalPoints } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'totalPointsSold',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: saleState, isLoading: isLoadingSaleState } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'saleState',
    args: [],
    query: { enabled: !!saleAddress },
  });

  const { data: pointsPurchasedByMe, isLoading: isLoadingPointsPurchasedByMe } = useReadContract({
    address: saleAddress,
    abi: SaleABI,
    functionName: 'pointsPurchased',
    args: [address || '0x0'],
    query: { enabled: !!saleAddress && !!address },
  });

  // --- Read PNT Metadata ---
  const { data: pntUri, isLoading: isLoadingPntUri } = useReadContract({
    address: OPEN_PNTS_ADDRESS,
    abi: OpenPNTsABI,
    functionName: 'uri',
    args: [tokenId || 0],
    query: { enabled: !!tokenId && !!OPEN_PNTS_ADDRESS },
  });

  const [pntMetadata, setPntMetadata] = useState<any>(null);
  useEffect(() => {
    if (pntUri) {
      const fetchMetadata = async () => {
        try {
          // Replace {id} with actual tokenId for fetching metadata
          const metadataUrl = pntUri.replace('{id}', tokenId?.toString() || '0');
          const response = await fetch(metadataUrl);
          const data = await response.json();
          setPntMetadata(data);
        } catch (err) {
          console.error("Failed to fetch PNT metadata:", err);
        }
      };
      fetchMetadata();
    }
  }, [pntUri, tokenId]);

  // --- Read Currency Data (assuming MockERC20 for now) ---
  const { data: currencySymbol, isLoading: isLoadingCurrencySymbol } = useReadContract({
    address: currencyAddress as `0x${string}`,
    abi: MockERC20ABI, // Assuming MockERC20ABI is available
    functionName: 'symbol',
    args: [],
    query: { enabled: !!currencyAddress },
  });

  const { data: currencyDecimals, isLoading: isLoadingCurrencyDecimals } = useReadContract({
    address: currencyAddress as `0x${string}`,
    abi: MockERC20ABI, // Assuming MockERC20ABI is available
    functionName: 'decimals',
    args: [],
    query: { enabled: !!currencyAddress },
  });

  // --- Write Contract Interactions ---
  const { writeContract: writePurchase, data: purchaseHash, isPending: isPurchasing } = useWriteContract();
  const { isLoading: isPurchaseConfirming, isSuccess: isPurchaseSuccess } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  });

  const { writeContract: writeClaim, data: claimHash, isPending: isClaiming } = useWriteContract();
  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  const { writeContract: writeRefund, data: refundHash, isPending: isRefunding } = useWriteContract();
  const { isLoading: isRefundConfirming, isSuccess: isRefundSuccess } = useWaitForTransactionReceipt({
    hash: refundHash,
  });

  const { writeContract: writeFinalize, data: finalizeHash, isPending: isFinalizing } = useWriteContract();
  const { isLoading: isFinalizeConfirming, isSuccess: isFinalizeSuccess } = useWaitForTransactionReceipt({
    hash: finalizeHash,
  });

  const handlePurchase = async () => {
    if (!isConnected || !address || !currencyDecimals || !price) return;

    const amountToPurchase = parseUnits(purchaseAmount, 0); // PNTs have 0 decimals
    const cost = amountToPurchase * price;

    // First, approve the Sale contract to spend currency
    writePurchase({
      address: currencyAddress as `0x${string}`,
      abi: MockERC20ABI,
      functionName: 'approve',
      args: [saleAddress, cost],
    });

    // Then, purchase points
    // This needs to be chained after approval is confirmed
    // For simplicity in MVP, we'll assume approval goes through or handle it separately.
    // A more robust solution would use a custom hook or a transaction manager.
    writePurchase({
      address: saleAddress,
      abi: SaleABI,
      functionName: 'purchase',
      args: [amountToPurchase],
    });
  };

  const handleClaim = () => {
    if (!isConnected || !address) return;
    writeClaim({
      address: saleAddress,
      abi: SaleABI,
      functionName: 'claim',
      args: [],
    });
  };

  const handleRefund = () => {
    if (!isConnected || !address) return;
    writeRefund({
      address: saleAddress,
      abi: SaleABI,
      functionName: 'refund',
      args: [],
    });
  };

  const handleFinalize = () => {
    if (!isConnected || !address) return;
    writeFinalize({
      address: saleAddress,
      abi: SaleABI,
      functionName: 'finalize',
      args: [],
    });
  };

  const isLoading = isLoadingSaleDetails || isLoadingTokenId || isLoadingCurrency || isLoadingPrice ||
                    isLoadingMaxPoints || isLoadingMinPoints || isLoadingStartTime || isLoadingEndTime ||
                    isLoadingBeneficiary || isLoadingTotalPoints || isLoadingSaleState || isLoadingPntUri ||
                    isLoadingCurrencySymbol || isLoadingCurrencyDecimals || isLoadingPointsPurchasedByMe;

  if (!saleAddress) return <div className="text-center p-8">No sale address provided.</div>;
  if (isLoading) return <div className="text-center p-8">Loading sale details...</div>;
  if (saleDetailsError) return <div className="text-center p-8 text-red-500">Error loading sale: {saleDetailsError.message}</div>;

  // Helper to format timestamps
  const formatTimestamp = (timestamp: bigint | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  // Helper to get sale state string
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
  const isSaleActive = saleState === 1 && currentTimestamp >= Number(saleStartTime) && currentTimestamp <= Number(saleEndTime);
  const isSaleEnded = currentTimestamp > Number(saleEndTime);
  const isSaleSuccessful = saleState === 2;
  const isSaleFailed = saleState === 3;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{pntMetadata?.name || 'Loyalty Points Pre-Sale'}</h1>
      <p className="text-lg mb-4">by {beneficiary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Sale Details</h2>
          <p><strong>Status:</strong> {getSaleStateString(saleState)}</p>
          <p><strong>Token ID:</strong> {tokenId?.toString()}</p>
          <p><strong>Price:</strong> {price ? formatUnits(price, currencyDecimals || 0) : 'N/A'} {currencySymbol || 'CURRENCY'} per point</p>
          <p><strong>Points Available:</strong> {maxPointsToSell?.toString()}</p>
          <p><strong>Minimum Goal:</strong> {minPointsToSell?.toString()} points</p>
          <p><strong>Points Sold:</strong> {totalPointsSold?.toString()}</p>
          <p><strong>Start Time:</strong> {formatTimestamp(saleStartTime)}</p>
          <p><strong>End Time:</strong> {formatTimestamp(saleEndTime)}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Loyalty Point Info</h2>
          {pntMetadata && (
            <>
              {pntMetadata.image && <img src={pntMetadata.image} alt={pntMetadata.name} className="w-24 h-24 rounded-full mb-2" />}
              <p><strong>Name:</strong> {pntMetadata.name}</p>
              <p><strong>Symbol:</strong> {pntMetadata.symbol}</p>
              <p><strong>Description:</strong> {pntMetadata.description}</p>
              {pntMetadata.attributes && pntMetadata.attributes.map((attr: any, index: number) => (
                <p key={index}><strong>{attr.trait_type}:</strong> {attr.value}</p>
              ))}
            </>
          )}
        </div>
      </div>

      {isConnected ? (
        <div className="border p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Purchase Points</h2>
          {isSaleActive ? (
            <form onSubmit={(e) => { e.preventDefault(); handlePurchase(); }} className="space-y-4">
              <div>
                <label htmlFor="purchaseAmount" className="block text-sm font-medium text-gray-700">Amount of Points to Purchase</label>
                <input type="number" id="purchaseAmount" value={purchaseAmount} onChange={(e) => setPurchaseAmount(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isPurchasing || isPurchaseConfirming}
              >
                {isPurchasing || isPurchaseConfirming ? 'Purchasing...' : 'Purchase'}
              </button>
              {purchaseHash && <p className="mt-4 text-sm text-gray-600">Purchase Tx: <a href={`https://sepolia.etherscan.io/tx/${purchaseHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{purchaseHash}</a></p>}
              {isPurchaseSuccess && <p className="mt-4 text-green-600">Purchase successful!</p>}
            </form>
          ) : (
            <p className="text-red-500">Sale is not active for purchases.</p>
          )}

          <h2 className="text-xl font-semibold mt-8 mb-4">Your Activity</h2>
          <p>Points Purchased by You: {pointsPurchasedByMe?.toString() || '0'}</p>

          {isSaleEnded && !isSaleSuccessful && (
            <button
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition-colors disabled:opacity-50 mt-4"
              onClick={handleRefund}
              disabled={isRefunding || isRefundConfirming || Number(pointsPurchasedByMe) === 0}
            >
              {isRefunding || isRefundConfirming ? 'Refunding...' : 'Get Refund'}
            </button>
          )}

          {isSaleSuccessful && (
            <button
              className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:opacity-50 mt-4"
              onClick={handleClaim}
              disabled={isClaiming || isClaimConfirming || Number(pointsPurchasedByMe) === 0}
            >
              {isClaiming || isClaimConfirming ? 'Claiming...' : 'Claim Points'}
            </button>
          )}

          {isSaleEnded && (saleState === 0 || saleState === 1) && (
            <button
              className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-colors disabled:opacity-50 mt-4"
              onClick={handleFinalize}
              disabled={isFinalizing || isFinalizeConfirming}
            >
              {isFinalizing || isFinalizeConfirming ? 'Finalizing...' : 'Finalize Sale'}
            </button>
          )}

        </div>
      ) : (
        <p className="text-red-500">Connect your wallet to interact with this sale.</p>
      )}
    </div>
  );
}
