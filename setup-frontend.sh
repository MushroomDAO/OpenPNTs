#!/bin/bash

# OpenPNTs 前端环境配置脚本
# 此脚本会启动Anvil，部署合约，并配置前端环境

set -e

echo "🔧 OpenPNTs 前端环境配置"
echo "======================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在正确目录
if [ ! -f "foundry.toml" ]; then
    echo -e "${RED}❌ 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 启动Anvil
start_anvil() {
    echo "🔧 启动Anvil本地网络..."
    
    # 检查Anvil是否已经在运行
    if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null; then
        echo -e "${YELLOW}⚠️  端口8545已被占用，将使用现有Anvil实例${NC}"
        return 0
    fi
    
    # 启动Anvil (后台运行)
    anvil --host 0.0.0.0 --port 8545 > anvil.log 2>&1 &
    ANVIL_PID=$!
    echo "Anvil PID: $ANVIL_PID"
    
    # 等待Anvil启动
    echo "等待Anvil启动..."
    sleep 3
    
    # 验证Anvil是否正常运行
    if ! curl -s http://127.0.0.1:8545 > /dev/null; then
        echo -e "${RED}❌ Anvil启动失败${NC}"
        cat anvil.log
        exit 1
    fi
    
    echo -e "${GREEN}✅ Anvil启动成功${NC}"
}

# 部署合约
deploy_contracts() {
    echo "📦 部署智能合约..."
    
    # 设置部署者私钥（Anvil的第一个账户）
    DEPLOYER_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    
    # 运行部署脚本
    DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol:DeployOpenPNTs \
        --rpc-url http://127.0.0.1:8545 \
        --private-key $DEPLOYER_PRIVATE_KEY \
        --broadcast 2>&1)
    
    # 从forge script的Return输出中提取合约地址
    OPEN_PNTS_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -E "0: contract OpenPNTs" | grep -oE "0x[a-fA-F0-9]{40}")
    SALE_FACTORY_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -E "1: contract SaleFactory" | grep -oE "0x[a-fA-F0-9]{40}")
    
    if [ -z "$OPEN_PNTS_ADDRESS" ] || [ -z "$SALE_FACTORY_ADDRESS" ]; then
        echo "尝试从broadcast文件中读取..."
        
        # 从broadcast文件中获取地址
        BROADCAST_FILE="broadcast/Deploy.s.sol/31337/run-latest.json"
        if [ -f "$BROADCAST_FILE" ]; then
            OPEN_PNTS_ADDRESS=$(cat "$BROADCAST_FILE" | grep -o '"contractAddress":"0x[^"]*"' | head -1 | cut -d'"' -f4)
            SALE_FACTORY_ADDRESS=$(cat "$BROADCAST_FILE" | grep -o '"contractAddress":"0x[^"]*"' | tail -1 | cut -d'"' -f4)
        fi
        
        if [ -z "$OPEN_PNTS_ADDRESS" ] || [ -z "$SALE_FACTORY_ADDRESS" ]; then
            echo -e "${RED}❌ 无法获取合约地址${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ 合约部署成功${NC}"
    echo "OpenPNTs: $OPEN_PNTS_ADDRESS"
    echo "SaleFactory: $SALE_FACTORY_ADDRESS"
}

# 配置前端环境
setup_frontend() {
    echo "⚙️  配置前端环境..."
    
    cd frontend
    
    # 创建环境变量文件
    cat > .env.local << EOF
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=d0a8709ac267c538f3836a20d4aa96fd
NEXT_PUBLIC_OPEN_PNTS_ADDRESS=$OPEN_PNTS_ADDRESS
NEXT_PUBLIC_SALE_FACTORY_ADDRESS=$SALE_FACTORY_ADDRESS
NEXT_PUBLIC_SEPOLIA_RPC_URL=http://127.0.0.1:8545
EOF
    
    echo -e "${GREEN}✅ 前端环境配置完成${NC}"
    echo "环境变量已写入 frontend/.env.local"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "📦 安装前端依赖..."
        pnpm install
    fi
    
    cd ..
}

# 创建测试数据
create_test_data() {
    echo "🎯 创建测试数据..."
    
    # Alice的地址（Anvil的第二个账户）
    ALICE_ADDRESS="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    DEPLOYER_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    
    # 为Alice创建一些测试PNT
    echo "为Alice创建测试PNT..."
    cast send $OPEN_PNTS_ADDRESS \
        "create(address,uint256)" \
        $ALICE_ADDRESS \
        1000 \
        --private-key $DEPLOYER_PRIVATE_KEY \
        --rpc-url http://127.0.0.1:8545 > /dev/null
    
    # 为Bob创建测试PNT
    BOB_ADDRESS="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    cast send $OPEN_PNTS_ADDRESS \
        "create(address,uint256)" \
        $BOB_ADDRESS \
        500 \
        --private-key $DEPLOYER_PRIVATE_KEY \
        --rpc-url http://127.0.0.1:8545 > /dev/null
    
    echo -e "${GREEN}✅ 测试数据创建完成${NC}"
    echo "已为Alice (token ID 0) 和 Bob (token ID 1) 创建测试PNT"
}

# 主函数
main() {
    start_anvil
    deploy_contracts
    setup_frontend
    create_test_data
    
    echo ""
    echo -e "${GREEN}🎉 前端环境配置完成！${NC}"
    echo "======================================"
    echo "下一步操作："
    echo "1. 进入前端目录: cd frontend"
    echo "2. 启动开发服务器: ./run.sh"
    echo "3. 打开浏览器访问: http://localhost:3000"
    echo ""
    echo "测试账户："
    echo "Alice: $ALICE_ADDRESS (有1000个PNT, token ID 0)"
    echo "Bob: $BOB_ADDRESS (有500个PNT, token ID 1)"
    echo ""
    echo -e "${YELLOW}💡 提示: Anvil在后台运行，可以使用 pkill anvil 停止${NC}"
}

# 运行主函数
main "$@" 