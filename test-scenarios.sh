#!/bin/bash

# OpenPNTs 完整场景测试脚本
# 此脚本会启动Anvil，部署合约，并运行各种测试场景

set -e # 遇到错误立即退出

echo "🚀 OpenPNTs 完整场景测试开始"
echo "======================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查必要的工具
check_requirements() {
    echo "📋 检查系统要求..."
    
    if ! command -v anvil &> /dev/null; then
        echo -e "${RED}❌ Anvil 未安装。请安装 Foundry。${NC}"
        exit 1
    fi
    
    if ! command -v forge &> /dev/null; then
        echo -e "${RED}❌ Forge 未安装。请安装 Foundry。${NC}"
        exit 1
    fi
    
    if ! command -v cast &> /dev/null; then
        echo -e "${RED}❌ Cast 未安装。请安装 Foundry。${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 所有要求满足${NC}"
}

# 启动Anvil
start_anvil() {
    echo "🔧 启动Anvil本地网络..."
    
    # 检查Anvil是否已经在运行
    if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null; then
        echo -e "${YELLOW}⚠️  端口8545已被占用，尝试关闭现有进程...${NC}"
        pkill -f anvil || true
        sleep 2
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
    DEPLOYER_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    
    # 运行部署脚本
    DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol:DeployOpenPNTs \
        --rpc-url http://127.0.0.1:8545 \
        --private-key $DEPLOYER_PRIVATE_KEY \
        --broadcast 2>&1)
    
    echo "$DEPLOY_OUTPUT"
    
    # 从forge script的Return输出中提取合约地址
    OPEN_PNTS_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -E "0: contract OpenPNTs" | grep -oE "0x[a-fA-F0-9]{40}")
    SALE_FACTORY_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -E "1: contract SaleFactory" | grep -oE "0x[a-fA-F0-9]{40}")
    
    if [ -z "$OPEN_PNTS_ADDRESS" ] || [ -z "$SALE_FACTORY_ADDRESS" ]; then
        echo -e "${RED}❌ 无法提取合约地址${NC}"
        echo "尝试从broadcast文件中读取..."
        
        # 从broadcast文件中获取地址
        BROADCAST_FILE="broadcast/Deploy.s.sol/31337/run-latest.json"
        if [ -f "$BROADCAST_FILE" ]; then
            OPEN_PNTS_ADDRESS=$(cat "$BROADCAST_FILE" | grep -o '"contractAddress":"0x[^"]*"' | head -1 | cut -d'"' -f4)
            SALE_FACTORY_ADDRESS=$(cat "$BROADCAST_FILE" | grep -o '"contractAddress":"0x[^"]*"' | tail -1 | cut -d'"' -f4)
        fi
        
        if [ -z "$OPEN_PNTS_ADDRESS" ] || [ -z "$SALE_FACTORY_ADDRESS" ]; then
            echo -e "${RED}❌ 仍无法获取合约地址${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ 合约部署成功${NC}"
    echo "OpenPNTs: $OPEN_PNTS_ADDRESS"
    echo "SaleFactory: $SALE_FACTORY_ADDRESS"
    
    # 保存地址到文件
    echo "OPEN_PNTS_ADDRESS=$OPEN_PNTS_ADDRESS" > .env.test
    echo "SALE_FACTORY_ADDRESS=$SALE_FACTORY_ADDRESS" >> .env.test
    echo "DEPLOYER_PRIVATE_KEY=$DEPLOYER_PRIVATE_KEY" >> .env.test
    echo "DEPLOYER_ADDRESS=$DEPLOYER_ADDRESS" >> .env.test
}

# 运行Foundry测试
run_foundry_tests() {
    echo "🧪 运行Foundry单元测试..."
    
    forge test -vv
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 所有单元测试通过${NC}"
    else
        echo -e "${RED}❌ 单元测试失败${NC}"
        exit 1
    fi
}

# 简化的集成测试
test_basic_integration() {
    echo "🎯 测试基础集成..."
    
    source .env.test
    
    # Alice的地址（Anvil的第二个账户）
    ALICE_ADDRESS="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    ALICE_PRIVATE_KEY="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    
    echo "👩 Alice地址: $ALICE_ADDRESS"
    
    # 1. Platform Owner创建PNT
    echo "1️⃣ Platform Owner为Alice创建PNT..."
    CREATE_TX=$(cast send $OPEN_PNTS_ADDRESS \
        "create(address,uint256)" \
        $ALICE_ADDRESS \
        1000 \
        --private-key $DEPLOYER_PRIVATE_KEY \
        --rpc-url http://127.0.0.1:8545)
    
    echo "创建PNT交易: $CREATE_TX"
    
    # 验证Alice的PNT余额
    ALICE_BALANCE=$(cast call $OPEN_PNTS_ADDRESS \
        "balanceOf(address,uint256)" \
        $ALICE_ADDRESS \
        0 \
        --rpc-url http://127.0.0.1:8545)
    
    echo "Alice的PNT余额: $(($ALICE_BALANCE)) 个"
    
    if [ $(($ALICE_BALANCE)) -eq 1000 ]; then
        echo -e "${GREEN}✅ PNT创建成功！${NC}"
    else
        echo -e "${RED}❌ PNT创建失败${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 基础集成测试完成${NC}"
}

# 清理函数
cleanup() {
    echo "🧹 清理环境..."
    
    if [ ! -z "$ANVIL_PID" ]; then
        echo "关闭Anvil (PID: $ANVIL_PID)..."
        kill $ANVIL_PID 2>/dev/null || true
    fi
    
    # 清理临时文件
    rm -f anvil.log .env.test
    
    echo -e "${GREEN}✅ 清理完成${NC}"
}

# 主函数
main() {
    echo "开始完整测试流程..."
    
    # 设置trap以确保清理
    trap cleanup EXIT INT TERM
    
    check_requirements
    start_anvil
    deploy_contracts
    run_foundry_tests
    test_basic_integration
    
    echo ""
    echo -e "${GREEN}🎉 所有测试场景完成！${NC}"
    echo "======================================"
    echo "测试总结："
    echo "✅ 合约部署成功"
    echo "✅ 单元测试通过"
    echo "✅ 基础集成测试通过"
    echo ""
    echo -e "${YELLOW}💡 提示: 可以运行 cd frontend && ./run.sh 来启动前端界面${NC}"
    echo "合约地址已保存在 .env.test 文件中"
}

# 检查是否在正确目录
if [ ! -f "foundry.toml" ]; then
    echo -e "${RED}❌ 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 运行主函数
main "$@" 