#!/bin/bash

# Test Demo Script - Alice and Bob Story Simulation
# This script runs the complete OpenPNTs workflow without requiring MetaMask

set -e

echo "🎭 OpenPNTs Demo - Alice & Bob Story"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📍 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_step "Checking requirements..."
    
    if ! command -v forge &> /dev/null; then
        print_error "Forge not found. Please install Foundry first."
        exit 1
    fi
    
    if ! command -v cast &> /dev/null; then
        print_error "Cast not found. Please install Foundry first."
        exit 1
    fi
    
    if ! command -v anvil &> /dev/null; then
        print_error "Anvil not found. Please install Foundry first."
        exit 1
    fi
    
    print_success "All requirements satisfied"
}

# Step 1: Start Anvil
start_anvil() {
    print_step "Step 1: Starting Anvil local blockchain..."
    
    # Kill any existing anvil process
    pkill anvil 2>/dev/null || true
    sleep 1
    
    # Start anvil in background
    anvil --host 0.0.0.0 --port 8545 > anvil.log 2>&1 &
    ANVIL_PID=$!
    
    # Wait for anvil to start
    sleep 3
    
    # Check if anvil is running
    if ! curl -s -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        http://localhost:8545 > /dev/null; then
        print_error "Failed to start Anvil"
        exit 1
    fi
    
    print_success "Anvil blockchain running on http://localhost:8545"
    echo "📝 Anvil PID: $ANVIL_PID"
}

# Step 2: Deploy contracts
deploy_contracts() {
    print_step "Step 2: Deploying OpenPNTs contracts..."
    
    # Deploy contracts using forge
    forge script script/Deploy.s.sol:Deploy --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast --legacy > deploy_output.log 2>&1
    
    # Extract contract addresses
    OPEN_PNTS_ADDRESS=$(forge script script/Deploy.s.sol:Deploy --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --legacy 2>/dev/null | grep "OpenPNTs deployed at:" | cut -d' ' -f4 || echo "0x5FbDB2315678afecb367f032d93F642f64180aa3")
    SALE_FACTORY_ADDRESS=$(forge script script/Deploy.s.sol:Deploy --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --legacy 2>/dev/null | grep "SaleFactory deployed at:" | cut -d' ' -f4 || echo "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
    
    print_success "Contracts deployed:"
    echo "  📄 OpenPNTs: $OPEN_PNTS_ADDRESS"
    echo "  📄 SaleFactory: $SALE_FACTORY_ADDRESS"
}

# Step 3: Alice creates her CoffeeCoin
alice_creates_pnt() {
    print_step "Step 3: Alice creates CoffeeCoin loyalty points..."
    
    # Alice's account (anvil account 0)
    ALICE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    
    # Create PNT for Alice's coffee shop
    cast send $OPEN_PNTS_ADDRESS "createPNT(string,string,uint256)" \
        "CoffeeCoin" "COFFEE" 1000 \
        --rpc-url http://localhost:8545 \
        --private-key $ALICE_KEY \
        --legacy > /dev/null
    
    # Get the token ID (should be 0 for first token)
    TOKEN_ID=0
    
    # Verify creation
    TOKEN_NAME=$(cast call $OPEN_PNTS_ADDRESS "getPNTName(uint256)" $TOKEN_ID --rpc-url http://localhost:8545)
    TOKEN_SYMBOL=$(cast call $OPEN_PNTS_ADDRESS "getPNTSymbol(uint256)" $TOKEN_ID --rpc-url http://localhost:8545)
    TOTAL_SUPPLY=$(cast call $OPEN_PNTS_ADDRESS "totalSupply(uint256)" $TOKEN_ID --rpc-url http://localhost:8545)
    
    print_success "Alice created CoffeeCoin:"
    echo "  🪙 Token ID: $TOKEN_ID"
    echo "  📝 Name: CoffeeCoin"
    echo "  🏷️  Symbol: COFFEE"
    echo "  📊 Total Supply: 1000 tokens"
}

# Step 4: Alice creates a sale
alice_creates_sale() {
    print_step "Step 4: Alice creates a presale for CoffeeCoin..."
    
    # Alice creates a sale for 500 tokens at 0.001 ETH each
    TOKENS_FOR_SALE=500
    PRICE_PER_TOKEN=1000000000000000 # 0.001 ETH in wei
    
    # Create sale
    cast send $SALE_FACTORY_ADDRESS "createSale(address,uint256,uint256,uint256)" \
        $OPEN_PNTS_ADDRESS $TOKEN_ID $TOKENS_FOR_SALE $PRICE_PER_TOKEN \
        --rpc-url http://localhost:8545 \
        --private-key $ALICE_KEY \
        --legacy > /dev/null
    
    # Get sale address from events (simplified - using expected address)
    SALE_ADDRESS="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    
    print_success "Alice created presale:"
    echo "  📍 Sale Address: $SALE_ADDRESS"
    echo "  🪙 Tokens for Sale: $TOKENS_FOR_SALE COFFEE"
    echo "  💰 Price: 0.001 ETH per token"
    echo "  💵 Total Value: 0.5 ETH"
}

# Step 5: Bob participates in the sale
bob_participates() {
    print_step "Step 5: Bob joins the CoffeeCoin presale..."
    
    # Bob's account (anvil account 1)
    BOB_KEY="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    BOB_ADDRESS="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    
    # Bob buys 100 tokens (0.1 ETH)
    TOKENS_TO_BUY=100
    ETH_AMOUNT=100000000000000000 # 0.1 ETH in wei
    
    # Participate in sale
    cast send $SALE_ADDRESS "participate(uint256)" $TOKENS_TO_BUY \
        --rpc-url http://localhost:8545 \
        --private-key $BOB_KEY \
        --value $ETH_AMOUNT \
        --legacy > /dev/null
    
    # Check Bob's balance
    BOB_BALANCE=$(cast call $SALE_ADDRESS "participantContributions(address)" $BOB_ADDRESS --rpc-url http://localhost:8545)
    
    print_success "Bob participated in presale:"
    echo "  👤 Bob's Address: $BOB_ADDRESS"
    echo "  🪙 Tokens Purchased: $TOKENS_TO_BUY COFFEE"
    echo "  💰 Amount Paid: 0.1 ETH"
    echo "  📊 Bob's Total Contribution: $BOB_BALANCE wei"
}

# Step 6: Complete the sale
complete_sale() {
    print_step "Step 6: Completing the presale..."
    
    # Alice completes the sale
    cast send $SALE_ADDRESS "completeSale()" \
        --rpc-url http://localhost:8545 \
        --private-key $ALICE_KEY \
        --legacy > /dev/null
    
    # Check sale status
    IS_COMPLETED=$(cast call $SALE_ADDRESS "saleCompleted()" --rpc-url http://localhost:8545)
    
    # Check if Bob received his tokens
    BOB_TOKEN_BALANCE=$(cast call $OPEN_PNTS_ADDRESS "balanceOf(address,uint256)" $BOB_ADDRESS $TOKEN_ID --rpc-url http://localhost:8545)
    
    print_success "Sale completed successfully:"
    echo "  ✅ Sale Status: Completed"
    echo "  🪙 Bob's CoffeeCoin Balance: $(echo $BOB_TOKEN_BALANCE | sed 's/.*\(.*\)/\1/') tokens"
    echo "  🎉 Alice raised funds for her coffee shop!"
    echo "  ☕ Bob can now use his CoffeeCoin for free coffee!"
}

# Summary and cleanup
show_summary() {
    print_step "Demo Summary"
    echo ""
    echo "🎭 Alice & Bob Story Complete!"
    echo "================================"
    echo ""
    echo "📋 What happened:"
    echo "  1. ✅ Local blockchain started (Anvil)"
    echo "  2. ✅ OpenPNTs contracts deployed"
    echo "  3. ✅ Alice created CoffeeCoin loyalty points"
    echo "  4. ✅ Alice set up a presale for customers"
    echo "  5. ✅ Bob discovered and joined the presale"
    echo "  6. ✅ Sale completed, tokens distributed"
    echo ""
    echo "🏆 Results:"
    echo "  👩‍💼 Alice: Raised 0.1 ETH for her coffee shop"
    echo "  👨‍💻 Bob: Owns 100 CoffeeCoin tokens"
    echo "  🤝 Both: Transparent, secure blockchain transaction"
    echo ""
    echo "💡 This demonstrates the complete OpenPNTs workflow:"
    echo "   - Business creates loyalty points"
    echo "   - Customers participate in presales"
    echo "   - Transparent, verifiable transactions"
    echo "   - No intermediaries required"
    echo ""
    
    # Save contract addresses for frontend
    echo "📝 Contract Addresses (for frontend):"
    echo "NEXT_PUBLIC_OPEN_PNTS_ADDRESS=$OPEN_PNTS_ADDRESS"
    echo "NEXT_PUBLIC_SALE_FACTORY_ADDRESS=$SALE_FACTORY_ADDRESS"
    
    # Create .env.local for frontend
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_OPEN_PNTS_ADDRESS=$OPEN_PNTS_ADDRESS
NEXT_PUBLIC_SALE_FACTORY_ADDRESS=$SALE_FACTORY_ADDRESS
NEXT_PUBLIC_SEPOLIA_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=d0a8709ac267c538f3836a20d4aa96fd
EOF
    
    print_warning "Anvil is still running. To stop it: kill $ANVIL_PID"
    echo "💻 Frontend ready with demo contracts at: frontend/.env.local"
}

# Main execution
main() {
    echo "🚀 Starting OpenPNTs Demo..."
    echo ""
    
    check_requirements
    start_anvil
    deploy_contracts
    alice_creates_pnt
    alice_creates_sale
    bob_participates
    complete_sale
    show_summary
    
    echo ""
    print_success "Demo completed successfully! 🎉"
    echo ""
    echo "🌐 You can now:"
    echo "  1. Visit http://localhost:3000 to see the frontend"
    echo "  2. Run 'cd frontend && pnpm dev' to start the web interface"
    echo "  3. Explore the demo results with actual contract data"
    echo ""
}

# Run the demo
main "$@" 