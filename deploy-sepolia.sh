#!/bin/bash

# Source local environment variables
if [ -f .env.local ]; then
  source .env.local
else
  echo "Error: .env.local not found. Please create it based on template.env"
  exit 1
fi

# --- Configuration Checks ---
if [ -z "$DEPLOYER_PRIVATE_KEY" ]; then
  echo "Error: DEPLOYER_PRIVATE_KEY is not set in .env.local"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SEPOLIA_RPC_URL" ]; then
  echo "Error: NEXT_PUBLIC_SEPOLIA_RPC_URL is not set in .env.local"
  exit 1
fi

if [ -z "$YOUR_ETHERSCAN_API_KEY" ]; then
  echo "Error: YOUR_ETHERSCAN_API_KEY is not set in .env.local"
  echo "You can get one from https://etherscan.io/myapikey"
  exit 1
fi

# --- Deployment Command ---
echo "Deploying contracts to Sepolia..."
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol:DeployOpenPNTs \
    --rpc-url $NEXT_PUBLIC_SEPOLIA_RPC_URL \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $YOUR_ETHERSCAN_API_KEY \
    -vvvv # Verbose output to see deployed addresses
)

echo "$DEPLOY_OUTPUT"

# --- Extract and Display Deployed Addresses ---
echo "\n--- Deployed Contract Addresses ---"
OPEN_PNTS_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "OpenPNTs: " | awk '{print $2}')
SALE_FACTORY_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "SaleFactory: " | awk '{print $2}')

if [ -n "$OPEN_PNTS_ADDRESS" ] && [ -n "$SALE_FACTORY_ADDRESS" ]; then
  echo "OpenPNTs Address: $OPEN_PNTS_ADDRESS"
  echo "SaleFactory Address: $SALE_FACTORY_ADDRESS"
  echo "\nIMPORTANT: Update your .env.local with these addresses:"
  echo "NEXT_PUBLIC_OPEN_PNTS_ADDRESS=\"$OPEN_PNTS_ADDRESS\""
  echo "NEXT_PUBLIC_SALE_FACTORY_ADDRESS=\"$SALE_FACTORY_ADDRESS\""
else
  echo "Failed to extract deployed addresses. Please check the script output above for errors."
fi
