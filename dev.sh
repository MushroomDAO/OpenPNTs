#!/bin/bash

# Source local environment variables (e.g., DEPLOYER_PRIVATE_KEY, NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID)
# This file should be .gitignore'd and not committed to version control.
if [ -f .env.local ]; then
  source .env.local
else
  echo "Error: .env.local not found. Please create it based on template.env"
  exit 1
fi

# --- Configuration ---
ANVIL_RPC_URL="http://127.0.0.1:8545"

# --- Start Anvil ---
echo "Starting Anvil local blockchain..."
anvil > /dev/null 2>&1 & # Run Anvil in the background, suppressing output
ANVIL_PID=$!
echo "Anvil started with PID: $ANVIL_PID"

# Wait for Anvil to be ready
echo "Waiting for Anvil to be ready..."
while ! curl -s http://127.0.0.1:8545 > /dev/null; do
  sleep 1
done
echo "Anvil is ready."

# --- Deploy Contracts ---
echo "Deploying contracts to Anvil..."
# Run the deployment script and capture its output
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol:DeployOpenPNTs --rpc-url $ANVIL_RPC_URL --private-key $DEPLOYER_PRIVATE_KEY --broadcast)

# Extract deployed addresses using grep and awk
OPEN_PNTS_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "OpenPNTs: " | awk '{print $2}')
SALE_FACTORY_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "SaleFactory: " | awk '{print $2}')

if [ -z "$OPEN_PNTS_ADDRESS" ] || [ -z "$SALE_FACTORY_ADDRESS" ]; then
  echo "Error: Could not extract deployed contract addresses. Check forge script output."
  echo "$DEPLOY_OUTPUT"
  kill $ANVIL_PID
  exit 1
fi

echo "Contracts deployed:"
echo "OpenPNTs Address: $OPEN_PNTS_ADDRESS"
echo "SaleFactory Address: $SALE_FACTORY_ADDRESS"

# --- Start Frontend ---
echo "Starting Next.js frontend..."
cd frontend || exit # Change to frontend directory, exit if it fails

# Pass addresses and RPC URL as environment variables to the Next.js app
NEXT_PUBLIC_OPEN_PNTS_ADDRESS=$OPEN_PNTS_ADDRESS \
NEXT_PUBLIC_SALE_FACTORY_ADDRESS=$SALE_FACTORY_ADDRESS \
NEXT_PUBLIC_SEPOLIA_RPC_URL=$ANVIL_RPC_URL \
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID \
    pnpm dev & # Run frontend in background
FRONTEND_PID=$!
cd .. # Go back to root directory

echo "Frontend started with PID: $FRONTEND_PID"
echo "Access your dApp at http://localhost:3000"
echo "To stop the development environment, press Ctrl+C."

# Keep the script running until Ctrl+C is pressed
trap "echo 'Stopping Anvil and Frontend...'; kill $ANVIL_PID $FRONTEND_PID; exit" INT TERM
wait $FRONTEND_PID # Wait for frontend to exit, or for trap to catch Ctrl+C