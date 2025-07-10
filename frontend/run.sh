#!/bin/bash

# AirAccount系统不需要Web3相关环境变量
echo "Starting OpenPNTs frontend with AirAccount system..."
echo "Using email-based authentication instead of wallet connection"
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
