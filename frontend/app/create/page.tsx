'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { OpenPNTsABI, SaleFactoryABI } from '../lib/contracts/abis'; // Assuming ABIs are exported here
import { OPEN_PNTS_ADDRESS, SALE_FACTORY_ADDRESS } from '../lib/constants'; // Assuming addresses are exported here

export default function CreatePage() {
  const { address, isConnected } = useAccount();
  const [businessName, setBusinessName] = useState('');
  const [loyaltyPointName, setLoyaltyPointName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [preSaleGoalUSD, setPreSaleGoalUSD] = useState('');
  const [minGoalUSD, setMinGoalUSD] = useState('');
  const [pricePerPointUSD, setPricePerPointUSD] = useState('');
  const [maxPoints, setMaxPoints] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [shopPhoto, setShopPhoto] = useState('');

  const { writeContract: writeOpenPNTs, data: openPNTsHash } = useWriteContract();
  const { writeContract: writeSaleFactory, data: saleFactoryHash } = useWriteContract();

  const { isLoading: isCreatingPNT, isSuccess: isPNTCreated } = useWaitForTransactionReceipt({
    hash: openPNTsHash,
  });

  const { isLoading: isCreatingSale, isSuccess: isSaleCreated } = useWaitForTransactionReceipt({
    hash: saleFactoryHash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      alert('Please connect your wallet first.');
      return;
    }

    // --- Step 1: Create PNT (Loyalty Token) ---
    // This part needs to be called by the platform owner, not Alice directly.
    // For local dev, we'll simulate this or assume the platform owner calls it.
    // In a real scenario, Alice would fill the form, and our backend (platform owner) would call this.
    // For now, let's assume the PNT is already created or we'll simplify this for the MVP.
    // We will focus on the Sale contract creation for now.

    // --- Step 2: Create Sale Contract ---
    // Convert USD values to appropriate units (assuming USDC for currency, 6 decimals)
    const priceInUnits = parseUnits(pricePerPointUSD, 6); // USDC has 6 decimals
    const maxPointsBigInt = BigInt(maxPoints);
    const minPointsBigInt = BigInt(minGoalUSD); // Assuming minGoalUSD is directly points for simplicity
    const startTimeUnix = Math.floor(new Date(startTime).getTime() / 1000);
    const endTimeUnix = Math.floor(new Date(endTime).getTime() / 1000);

    // Placeholder for currency address (e.g., USDC on Sepolia)
    const USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743928Fd6Fbc060f8fF339'; // Example Sepolia USDC address

    // Placeholder for tokenId (assuming Alice's PNT is tokenId 0 for now)
    const ALICE_PNT_TOKEN_ID = 0;

    writeSaleFactory({
      address: SALE_FACTORY_ADDRESS,
      abi: SaleFactoryABI,
      functionName: 'createSale',
      args: [
        BigInt(ALICE_PNT_TOKEN_ID),
        USDC_ADDRESS,
        priceInUnits,
        maxPointsBigInt,
        minPointsBigInt,
        BigInt(startTimeUnix),
        BigInt(endTimeUnix),
        address,
      ],
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create Your Digital Points Card</h1>
      {!isConnected && <p className="text-red-500 mb-4">Please connect your wallet to create a points card.</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
          <input type="text" id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="loyaltyPointName" className="block text-sm font-medium text-gray-700">Loyalty Point Name</label>
          <input type="text" id="loyaltyPointName" value={loyaltyPointName} onChange={(e) => setLoyaltyPointName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">Symbol (e.g., ALICE)</label>
          <input type="text" id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="maxPoints" className="block text-sm font-medium text-gray-700">Total Points for Pre-Sale</label>
          <input type="number" id="maxPoints" value={maxPoints} onChange={(e) => setMaxPoints(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="minGoalUSD" className="block text-sm font-medium text-gray-700">Minimum Points to Sell (for success)</label>
          <input type="number" id="minGoalUSD" value={minGoalUSD} onChange={(e) => setMinGoalUSD(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="pricePerPointUSD" className="block text-sm font-medium text-gray-700">Price per Point (in USDC)</label>
          <input type="number" id="pricePerPointUSD" value={pricePerPointUSD} onChange={(e) => setPricePerPointUSD(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Pre-Sale Start Time</label>
          <input type="datetime-local" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Pre-Sale End Time</label>
          <input type="datetime-local" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Business Verification (for Trust)</h2>
        <div>
          <label htmlFor="googleMapsLink" className="block text-sm font-medium text-gray-700">Google Maps Link</label>
          <input type="url" id="googleMapsLink" value={googleMapsLink} onChange={(e) => setGoogleMapsLink(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="shopPhoto" className="block text-sm font-medium text-gray-700">Shop Photo URL (Placeholder)</label>
          <input type="url" id="shopPhoto" value={shopPhoto} onChange={(e) => setShopPhoto(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <button 
          type="submit" 
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
          disabled={!isConnected || isCreatingSale || isCreatingPNT}
        >
          {(isCreatingPNT || isCreatingSale) ? 'Launching...' : 'Launch Digital Points Card'}
        </button>

        {openPNTsHash && <p className="mt-4 text-sm text-gray-600">PNT Creation Tx: <a href={`https://sepolia.etherscan.io/tx/${openPNTsHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{openPNTsHash}</a></p>}
        {saleFactoryHash && <p className="mt-4 text-sm text-gray-600">Sale Creation Tx: <a href={`https://sepolia.etherscan.io/tx/${saleFactoryHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{saleFactoryHash}</a></p>}
        {isPNTCreated && <p className="mt-4 text-green-600">PNT created successfully!</p>}
        {isSaleCreated && <p className="mt-4 text-green-600">Sale created successfully!</p>}
      </form>
    </div>
  );
}
