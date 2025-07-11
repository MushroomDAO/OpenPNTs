# OpenPNTs 用户测试用例文档

## 版本：0.1.0
## 更新时间：2024-07-11

---

## 1. 用户视角测试用例

### 1.1 新用户注册和登录流程
**测试目标**: 验证AirAccount注册登录系统的完整性

| 测试用例ID | 测试步骤 | 预期结果 | 测试数据 |
|-----------|---------|---------|---------|
| UC001 | 用户首次访问首页 | 显示未登录状态，展示登录表单 | - |
| UC002 | 用户输入邮箱进行登录 | 弹出指纹验证，验证成功后登录 | alice@example.com |
| UC003 | 登录成功后检查用户状态 | 显示用户ENS名称和PNTs余额 | 默认50 PNTs |
| UC004 | 用户退出登录 | 清除用户状态，回到未登录界面 | - |

### 1.2 积分(PNTs)发行流程
**测试目标**: 验证商家发行自己的积分卡功能

| 测试用例ID | 测试步骤 | 预期结果 | 测试数据 |
|-----------|---------|---------|---------|
| UC005 | 商家访问/create页面 | 未登录用户看到登录提示 | - |
| UC006 | 商家登录后访问创建页面 | 显示PNT创建表单 | alice@coffee.com |
| UC007 | 填写PNT基本信息 | 表单验证通过，可以提交 | Alice咖啡积分, 10000总量 |
| UC008 | 提交创建PNT | 显示创建成功，生成合约地址 | - |

### 1.3 积分购买和使用流程
**测试目标**: 验证用户购买和使用积分的完整体验

| 测试用例ID | 测试步骤 | 预期结果 | 测试数据 |
|-----------|---------|---------|---------|
| UC009 | 用户浏览积分预售页面 | 显示所有可用的积分预售项目 | /sales |
| UC010 | 用户查看特定积分详情 | 显示积分详细信息和购买选项 | /sale/0x1234...5678 |
| UC011 | 用户购买积分 | 指纹验证后完成购买 | 购买100 PNTs |
| UC012 | 查看用户仪表板 | 显示持有的积分和交易记录 | /dashboard |

### 1.4 语言切换功能
**测试目标**: 验证中英文切换功能的正确性

| 测试用例ID | 测试步骤 | 预期结果 | 测试数据 |
|-----------|---------|---------|---------|
| UC013 | 点击右上角语言切换按钮 | 界面语言从中文切换到英文 | - |
| UC014 | 再次点击语言切换按钮 | 界面语言从英文切换到中文 | - |
| UC015 | 刷新页面 | 保持用户选择的语言设置 | - |

---

## 2. 产品方案视角测试用例

### 2.1 Play2B2E模式验证
**测试目标**: 验证Play to Business to Earn商业模式

| 测试用例ID | 测试场景 | 验证要点 | 成功标准 |
|-----------|---------|---------|---------|
| BC001 | Alice咖啡店发行积分 | 商家可以轻松发行自己的积分 | 5分钟内完成发行 |
| BC002 | Bob客户购买咖啡积分 | 客户愿意预购积分获得优惠 | 完成购买流程 |
| BC003 | 积分使用和兑换 | 积分可以在店内使用兑换商品 | 积分余额正确扣减 |

### 2.2 CPS佣金模式验证
**测试目标**: 验证按效果付费的佣金模式

| 测试用例ID | 测试场景 | 验证要点 | 成功标准 |
|-----------|---------|---------|---------|
| BC004 | 积分预售成功 | 只有实际销售后才产生佣金 | 佣金计算正确 |
| BC005 | 平台收益分配 | 1.5%佣金vs传统30-60% | 成本降低20-40倍 |
| BC006 | 商家收益保障 | 商家获得大部分收益 | 98.5%收益归商家 |

### 2.3 加密资产支付验证
**测试目标**: 验证多种加密货币支付支持

| 测试用例ID | 测试场景 | 验证要点 | 成功标准 |
|-----------|---------|---------|---------|
| BC007 | 支持多种加密货币 | ETH/USDC/USDT等主流币种 | 支付成功 |
| BC008 | 跨境支付便利性 | 全球用户都可以参与 | 无地域限制 |
| BC009 | 交易透明度 | 所有交易可在链上查询 | 提供交易链接 |

---

## 3. 系统视角测试用例

### 3.1 智能合约功能测试
**测试目标**: 验证核心智能合约的正确性

| 测试用例ID | 合约功能 | 测试要点 | 预期结果 |
|-----------|---------|---------|---------|
| SC001 | OpenPNTs合约部署 | 合约正确部署到网络 | 获得合约地址 |
| SC002 | PNT代币发行 | 创建新的PNT代币 | 代币合约创建成功 |
| SC003 | Sale合约创建 | 创建积分预售合约 | 预售合约部署成功 |
| SC004 | 积分购买交易 | 用户购买积分的链上交易 | 交易成功，余额更新 |

### 3.2 前端系统集成测试
**测试目标**: 验证前端与智能合约的集成

| 测试用例ID | 集成点 | 测试要点 | 预期结果 |
|-----------|-------|---------|---------|
| IT001 | AirAccount集成 | 邮箱登录和指纹验证 | 用户状态正确管理 |
| IT002 | 合约交互 | 前端调用合约方法 | 交易正确执行 |
| IT003 | 链上数据读取 | 显示实时的链上数据 | 数据准确显示 |
| IT004 | 交易链接展示 | 提供Etherscan查询链接 | 可跳转查看交易详情 |

### 3.3 性能和可用性测试
**测试目标**: 验证系统性能和用户体验

| 测试用例ID | 性能指标 | 测试标准 | 目标值 |
|-----------|---------|---------|--------|
| PT001 | 页面加载速度 | 首屏加载时间 | < 3秒 |
| PT002 | 交易确认时间 | 链上交易确认 | < 30秒 |
| PT003 | 响应式设计 | 移动端适配 | 完美适配 |
| PT004 | SSR hydration | 无hydration错误 | 0错误 |

---

## 4. 测试环境配置

### 4.1 本地开发环境测试
```bash
# 启动Anvil本地链
anvil

# 部署合约
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0...

# 启动前端
cd frontend && pnpm dev
```

### 4.2 Sepolia测试网测试
```bash
# 部署到Sepolia
./deploy-sepolia.sh

# 配置环境变量
export NEXT_PUBLIC_NETWORK=sepolia
export NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/...
```

### 4.3 交易链接配置
- **Sepolia**: https://sepolia.etherscan.io/tx/{txHash}
- **本地Anvil**: 本地区块浏览器或日志输出
- **主网**: https://etherscan.io/tx/{txHash}

---

## 5. 测试执行检查清单

### 5.1 部署前检查
- [ ] 智能合约编译通过: `forge build`
- [ ] 合约测试通过: `forge test`
- [ ] 前端构建成功: `pnpm build`
- [ ] 无TypeScript错误
- [ ] 无ESLint警告

### 5.2 功能测试检查
- [ ] 用户注册登录流程完整
- [ ] 积分发行功能正常
- [ ] 积分购买流程顺畅
- [ ] 仪表板数据显示正确
- [ ] 语言切换功能正常

### 5.3 集成测试检查
- [ ] 前端与合约交互正常
- [ ] 交易成功执行并确认
- [ ] 链上数据同步正确
- [ ] Etherscan链接可访问

### 5.4 用户体验检查
- [ ] 页面加载速度符合标准
- [ ] 移动端显示正常
- [ ] 无JavaScript错误
- [ ] 无SSR hydration错误
- [ ] 错误处理用户友好

---

## 6. 问题记录和解决方案

### 6.1 已解决问题
| 问题描述 | 解决方案 | 解决日期 |
|---------|---------|---------|
| SSR hydration错误 | 添加ClientOnly包装组件 | 2024-07-11 |
| Service Worker 404错误 | 创建空的sw.js文件 | 2024-07-11 |
| localStorage SSR错误 | 添加window检查保护 | 2024-07-11 |

### 6.2 已知限制
- 目前仅支持邮箱登录，未集成真实的Web3钱包
- 积分购买为模拟流程，未连接真实支付网关
- 指纹验证为模拟实现，生产环境需集成真实生物识别API

---

## 7. 测试报告模板

```markdown
# 测试执行报告 - [日期]

## 测试环境
- 网络: [Anvil本地/Sepolia测试网]
- 前端版本: [版本号]
- 合约版本: [版本号]

## 测试结果
- 总测试用例: [数量]
- 通过: [数量]
- 失败: [数量] 
- 跳过: [数量]

## 关键功能验证
- [x] 用户注册登录
- [x] 积分发行
- [x] 积分购买
- [x] 数据展示

## 发现问题
[记录测试中发现的问题]

## 建议改进
[提出改进建议]
``` 