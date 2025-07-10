#!/bin/bash

# 设置默认环境变量（如果没有提供的话）
export NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="${NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:-d0a8709ac267c538f3836a20d4aa96fd}"
export NEXT_PUBLIC_OPEN_PNTS_ADDRESS="${NEXT_PUBLIC_OPEN_PNTS_ADDRESS:-0x0000000000000000000000000000000000000000}"
export NEXT_PUBLIC_SALE_FACTORY_ADDRESS="${NEXT_PUBLIC_SALE_FACTORY_ADDRESS:-0x0000000000000000000000000000000000000000}"
export NEXT_PUBLIC_SEPOLIA_RPC_URL="${NEXT_PUBLIC_SEPOLIA_RPC_URL:-http://127.0.0.1:8545}"

echo "Starting frontend with environment variables:"
echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: $NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"
echo "NEXT_PUBLIC_OPEN_PNTS_ADDRESS: $NEXT_PUBLIC_OPEN_PNTS_ADDRESS"
echo "NEXT_PUBLIC_SALE_FACTORY_ADDRESS: $NEXT_PUBLIC_SALE_FACTORY_ADDRESS"
echo "NEXT_PUBLIC_SEPOLIA_RPC_URL: $NEXT_PUBLIC_SEPOLIA_RPC_URL"
echo "Starting development server..."

# 检查pnpm是否安装
if ! command -v pnpm &> /dev/null; then
    echo "Error: pnpm is not installed. Please install pnpm first."
    exit 1
fi

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# 安装依赖（如果node_modules不存在）
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# 启动开发服务器
pnpm dev
