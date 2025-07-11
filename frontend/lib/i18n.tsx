'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Alias for useLanguage
export const useI18n = useLanguage;

// 翻译字典
const translations = {
  zh: {
    'switch.language': 'EN',
    'platform.title': 'OpenPNTs Platform',
    'home.title': 'PNTs - 全球统一忠诚度积分',
    'home.subtitle': '去中心化固定佣金的美团 | 1.5% vs 30-60% = 20-40倍更低获客成本',
    'nav.browse': '浏览所有预售',
    'nav.launch': 'Launch Your PNTs',
    'nav.login_required': '请先登录AirAccount',
    'features.play2earn.title': '免费获得积分',
    'features.play2earn.desc': '通过消费、完成任务或游戏赚取忠诚度积分。Play2B2E模式让您轻松获得PNTs。',
    'features.cps.title': '消费即优惠',
    'features.cps.desc': '客户消费时商家才给出优惠，CPS佣金模式确保双赢。智能合约自动分配收益。',
    'features.crypto.title': '加密资产支付',
    'features.crypto.desc': '支持多种加密货币支付，全球通用。区块链技术确保交易透明安全。',
    'core.title': '核心竞争力',
    'core.innovation': 'Play2B2E + CPS + Crypto',
    'core.innovation.desc': '游戏化获取积分 + 按效果付费 + 加密货币支付，三重创新模式重新定义商业忠诚度体系。',
    'core.tech': '智能合约 + 去中心化计算 + AI优化',
    'core.tech.desc': '区块链技术保证透明度，AI算法优化推荐，去中心化计算确保平台去中心化运营。',
    'demo.title': '体验演示',
    'demo.desc': '无需钱包连接，使用本地测试数据快速体验Alice咖啡店和Bob客户的完整交互流程',
    'demo.button': '立即体验 Demo',
    'demo.note': '🔧 本地 Anvil 网络 | 🚫 无需 MetaMask',
    'footer.copyright': '全球统一积分系统 - 让忠诚度更有价值',
    
    // 使用场景
    'usecases.title': '使用场景',
    'usecases.buy.title': '💰 购买积分卡',
    'usecases.buy.desc': '商家Alice发行咖啡积分，100 THB市场价的咖啡可以用80 THB + 20积分购买。20积分的购买成本仅需2 THB（10%），为用户节省巨大成本。',
    'usecases.earn.title': '🎯 获得积分',
    'usecases.earn.item1': '• 低价购买：2 THB = 20积分',
    'usecases.earn.item2': '• 转发Twitter：免费获得50积分',
    'usecases.earn.item3': '• 参与游戏：娱乐中赚取积分',
    'usecases.earn.item4': '• 完成任务：多种活动获得奖励',
    'usecases.merchant.title': '🏪 商家收益',
    'usecases.merchant.desc': '平台仅收取1.5%手续费，销售积分的收入全部归商家。相比传统平台30-60%的佣金，获客成本降低20-40倍。',
    'usecases.coupon.title': '🎁 Coupon系统',
    'usecases.coupon.item1': '• 面值折扣：满300减30 coupon',
    'usecases.coupon.item2': '• 兑换模式：100积分换一杯拿铁',
    'usecases.coupon.item3': '• 赠送活动：买3杯送1杯 coupon',
    'usecases.coupon.item4': '• 直接支付：积分抵扣现金',
    
    // 通用
    'common.loading': '正在加载...',
    'common.logout': '退出',
    'common.login': '登录',
    'common.register': '注册',
    'common.submit': '提交',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.back': '返回',
    'common.next': '下一步',
    'common.save': '保存',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.view': '查看',
    'common.copy': '复制',
    'common.share': '分享',
    
    // 表单
    'form.required': '必填项',
    'form.name': '名称',
    'form.description': '描述',
    'form.amount': '数量',
    'form.price': '价格',
    'form.total': '总计',
    'form.email': '邮箱',
    'form.address': '地址',
    
    // 创建页面
    'create.title': 'Launch Your PNTs',
    'create.subtitle': '发行您的专属积分卡，为客户提供去中心化忠诚度体验',
    'create.login_required': '请先登录AirAccount才能发行PNTs积分卡。新用户可获得免费50 PNTs！',
    'create.get_airaccount': '获取AirAccount →',
    'create.success_title': 'PNTs发行成功！',
    'create.success_desc': '您的"{name}"积分卡已成功发行，即将开始预售！',
    'create.error_title': '发行失败',
    'create.error_default': '发行过程中出现错误，请稍后重试',
    'create.try_again': '重新尝试',
    'create.blockchain_info': '区块链交易信息',
    'create.contract_address': '合约地址',
    'create.sale_address': '销售合约地址',
    'create.transaction_hash': '交易哈希',
    'create.block_number': '区块号',
    'create.gas_used': 'Gas消耗',
    'create.pnt_details': '积分详情',
    'create.issuer': '发行者',
    'create.balance': '余额',
    'create.form.name': '积分名称',
    'create.form.name_placeholder': '例如：Alice咖啡积分',
    'create.form.description': '积分描述',
    'create.form.description_placeholder': '描述您的积分用途、兑换规则等...',
    'create.form.category': '分类',
    'create.form.total_supply': '总发行量',
    'create.form.price': '价格 (ETH/PNT)',
    'create.form.min_goal': '最小销售目标',
    'create.form.min_goal_note': '未达到最小目标时，预售将失败并退款',
    'create.form.submit': '立即发行 PNTs',
    'create.form.submitting': '发行中...',
    'create.category.food': '餐饮美食',
    'create.category.fitness': '健身运动',
    'create.category.beauty': '美容美发',
    'create.category.retail': '零售购物',
    'create.category.entertainment': '娱乐休闲',
    'create.category.other': '其他',
    'create.platform_title': '平台优势',
    'create.platform.fee': '仅收取1.5%平台手续费（vs 传统平台30-60%）',
    'create.platform.smart_contract': '智能合约自动处理销售和分配',
    'create.platform.blockchain': '区块链技术确保透明度和安全性',
    'create.platform.redemption': '支持多种兑换模式：折扣、兑换、赠送',
    'create.view_sales': '查看所有预售',
    
    // 销售页面
    'sale.loading': '加载中...',
    'sale.loading_desc': '正在获取预售详情',
    'sale.not_found': '预售不存在',
    'sale.not_found_desc': '未找到指定的预售项目',
    'sale.issuer': '发行方',
    'sale.contract_address': '合约地址',
    'sale.progress': '销售进度',
    'sale.completed': '完成',
    'sale.participants': '人参与',
    'sale.price_per_pnt': '每个积分价格',
    'sale.total_supply': '总发行量',
    'sale.end_time': '结束时间',
    'sale.participate': '参与预售',
    'sale.login_to_participate': '请登录AirAccount以参与预售',
    'sale.register_now': '立即注册 →',
    'sale.not_available': '预售暂不可参与',
    'sale.status': '状态',
    'sale.account': '账户',
    'sale.balance': '余额',
    'sale.purchase_amount': '购买数量',
    'sale.purchase_amount_placeholder': '输入要购买的积分数量',
    'sale.total_price': '总价',
    'sale.about': '约合',
    'sale.buy_now': '立即购买',
    'sale.processing': '处理中...',
    'sale.purchased': '已购买',
    'sale.fingerprint_required': '🔒 请完成指纹验证',
    'sale.purchase_success': '购买成功！',
    'sale.details': '详细介绍',
    'sale.features': '积分特色',
    'sale.usage_rules': '使用规则',
    'sale.redemption_options': '兑换选项',
    'sale.cost': '消耗',
    
    // 仪表板
    'dashboard.title': '用户仪表板',
    'dashboard.welcome': '欢迎回来',
    'dashboard.address': '地址',
    'dashboard.total_balance': '总余额',
    'dashboard.refresh': '🔄 刷新',
    'dashboard.refreshing': '刷新中...',
    'dashboard.my_points': '我的积分',
    'dashboard.point_types': '种积分',
    'dashboard.available': '可用',
    'dashboard.suspended': '暂停',
    'dashboard.no_points': '您还没有任何积分',
    'dashboard.buy_points_link': '去购买积分 →',
    'dashboard.issuer': '发行方',
    'dashboard.total_supply': '总量',
    'dashboard.transactions': '交易记录',
    'dashboard.recent_transactions': '最近',
    'dashboard.transactions_count': '笔',
    'dashboard.no_transactions': '暂无交易记录',
    'dashboard.quick_actions': '快速操作',
    'dashboard.buy_points_action': '购买积分',
    'dashboard.buy_points_desc': '浏览并购买商家积分',
    'dashboard.create_points': '发行积分',
    'dashboard.create_points_desc': '创建您的积分卡',
    'dashboard.play_to_earn': '游戏赚取',
    'dashboard.play_to_earn_desc': '敬请期待',
    'dashboard.transaction_hash': '交易哈希',
    'dashboard.login_required': '请登录AirAccount以查看您的积分和交易记录',
    'dashboard.get_airaccount': '获取AirAccount →',
    'dashboard.loading_data': '正在加载您的数据...',
    'dashboard.mock_alice_coffee': 'Alice咖啡积分',
    'dashboard.mock_alice_desc': '可在Alice咖啡店兑换饮品和享受折扣',
    'dashboard.mock_bob_fitness': 'Bob健身积分',
    'dashboard.mock_bob_desc': '健身房会员积分，可兑换课程和设备使用',
    'dashboard.mock_charlie_food': 'Charlie美食积分',
    'dashboard.mock_charlie_desc': '餐厅积分，可享受美食折扣和免费餐点',
    'dashboard.mock_tx_alice_purchase': '购买Alice咖啡积分',
    'dashboard.mock_tx_twitter': '转发Twitter获得奖励',
    'dashboard.mock_tx_alice_spend': '在Alice咖啡店消费',
    'dashboard.mock_tx_charlie_purchase': '购买Charlie美食积分',
    
    // 销售列表页面
    'sales.title': 'PNTs 预售市场',
    'sales.subtitle': '发现优质商家积分，享受去中心化忠诚度体验',
    'sales.all': '全部',
    'sales.food': '餐饮',
    'sales.fitness': '健身',
    'sales.beauty': '美容',
    'sales.retail': '零售',
    'sales.entertainment': '娱乐',
    'sales.active_presales': '总预售项目',
    'sales.view_details': '查看详情',
    'sales.no_sales': '暂无预售项目',
    'sales.no_sales_desc': '请稍后再来查看',
    'sales.loading': '正在加载...',
    'sales.total_participants': '总参与者',
    'sales.platform_fee': '平台手续费',
    
    // 区块链相关
    'blockchain.view_on_explorer': '在 {explorer} 查看交易',
    'blockchain.view_address_on_explorer': '在 {explorer} 查看地址',
    'blockchain.transaction_hash': '交易哈希',
    'blockchain.amount': '金额',
    'blockchain.time': '时间',
    'blockchain.status.pending': '等待确认',
    'blockchain.status.confirmed': '已确认',
    'blockchain.status.failed': '失败',
    'blockchain.status.unknown': '未知',
    
    // 交易状态
    'transaction.completed': '完成',
    'transaction.pending': '进行中',
    'transaction.failed': '失败',
    'transaction.purchase': '购买',
    'transaction.reward': '奖励',
    'transaction.spend': '消费',
    'transaction.transfer': '转账',
    
    // 状态
    'status.active': '进行中',
    'status.pending': '等待中',
    'status.successful': '成功',
    'status.failed': '失败',
    'status.closed': '已关闭',
    'status.unknown': '未知'
  },
  en: {
    'switch.language': '中文',
    'platform.title': 'OpenPNTs Platform',
    'home.title': 'PNTs - Global Unified Loyalty Points',
    'home.subtitle': 'Decentralized Fixed Commission Platform | 1.5% vs 30-60% = 20-40x Lower Customer Acquisition Cost',
    'nav.browse': 'Browse All Presales',
    'nav.launch': 'Launch Your PNTs',
    'nav.login_required': 'Please Login AirAccount First',
    'features.play2earn.title': 'Earn Points for Free',
    'features.play2earn.desc': 'Earn loyalty points through consumption, completing tasks, or gaming. Play2B2E model makes earning PNTs easy.',
    'features.cps.title': 'Pay-for-Performance',
    'features.cps.desc': 'Merchants only offer discounts when customers spend. CPS commission model ensures win-win outcomes.',
    'features.crypto.title': 'Crypto Asset Payment',
    'features.crypto.desc': 'Support multiple cryptocurrency payments, globally accessible. Blockchain technology ensures transparent and secure transactions.',
    'core.title': 'Core Competitiveness',
    'core.innovation': 'Play2B2E + CPS + Crypto',
    'core.innovation.desc': 'Gamified earning + Pay-for-performance + Cryptocurrency payment, triple innovation model redefining business loyalty systems.',
    'core.tech': 'Smart Contracts + Decentralized Computing + AI Optimization',
    'core.tech.desc': 'Blockchain technology ensures transparency, AI algorithms optimize recommendations, decentralized computing ensures platform decentralization.',
    'demo.title': 'Experience Demo',
    'demo.desc': 'No wallet connection required, experience the complete interaction between Alice Coffee Shop and Bob customers with local test data',
    'demo.button': 'Try Demo Now',
    'demo.note': '🔧 Local Anvil Network | 🚫 No MetaMask Required',
    'footer.copyright': 'Global Unified Points System - Making Loyalty More Valuable',
    
    // 使用场景
    'usecases.title': 'Use Cases',
    'usecases.buy.title': '💰 Buy Points Card',
    'usecases.buy.desc': 'Merchant Alice issues coffee points. A 100 THB coffee can be purchased with 80 THB + 20 points. The cost of 20 points is only 2 THB (10%), saving users huge costs.',
    'usecases.earn.title': '🎯 Earn Points',
    'usecases.earn.item1': '• Low-cost purchase: 2 THB = 20 points',
    'usecases.earn.item2': '• Share on Twitter: Get 50 points for free',
    'usecases.earn.item3': '• Play games: Earn points while having fun',
    'usecases.earn.item4': '• Complete tasks: Various activities for rewards',
    'usecases.merchant.title': '🏪 Merchant Benefits',
    'usecases.merchant.desc': 'Platform only charges 1.5% fee, all points sales revenue goes to merchants. Compared to traditional platforms\' 30-60% commission, customer acquisition cost is reduced by 20-40 times.',
    'usecases.coupon.title': '🎁 Coupon System',
    'usecases.coupon.item1': '• Face value discount: 30 THB off when spending 300 THB coupon',
    'usecases.coupon.item2': '• Exchange mode: 100 points for a latte',
    'usecases.coupon.item3': '• Gift promotion: Buy 3 get 1 free coupon',
    'usecases.coupon.item4': '• Direct payment: Points offset cash',
    
    // 通用
    'common.loading': 'Loading...',
    'common.logout': 'Logout',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.copy': 'Copy',
    'common.share': 'Share',
    
    // 表单
    'form.required': 'Required',
    'form.name': 'Name',
    'form.description': 'Description',
    'form.amount': 'Amount',
    'form.price': 'Price',
    'form.total': 'Total',
    'form.email': 'Email',
    'form.address': 'Address',
    
    // 创建页面
    'create.title': 'Launch Your PNTs',
    'create.subtitle': 'Create your exclusive loyalty points and provide decentralized loyalty experience for customers',
    'create.login_required': 'Please login to AirAccount to issue PNTs loyalty cards. New users get 50 PNTs for free!',
    'create.get_airaccount': 'Get AirAccount →',
    'create.success_title': 'PNTs Issued Successfully!',
    'create.success_desc': 'Your "{name}" loyalty card has been successfully issued and presale will start soon!',
    'create.error_title': 'Issuance Failed',
    'create.error_default': 'An error occurred during issuance, please try again later',
    'create.try_again': 'Try Again',
    'create.blockchain_info': 'Blockchain Transaction Info',
    'create.contract_address': 'Contract Address',
    'create.sale_address': 'Sale Contract Address',
    'create.transaction_hash': 'Transaction Hash',
    'create.block_number': 'Block Number',
    'create.gas_used': 'Gas Used',
    'create.pnt_details': 'Points Details',
    'create.issuer': 'Issuer',
    'create.balance': 'Balance',
    'create.form.name': 'Points Name',
    'create.form.name_placeholder': 'e.g.: Alice Coffee Points',
    'create.form.description': 'Points Description',
    'create.form.description_placeholder': 'Describe your points usage, redemption rules, etc...',
    'create.form.category': 'Category',
    'create.form.total_supply': 'Total Supply',
    'create.form.price': 'Price (ETH/PNT)',
    'create.form.min_goal': 'Minimum Sales Target',
    'create.form.min_goal_note': 'If minimum target is not reached, presale will fail and refund',
    'create.form.submit': 'Issue PNTs Now',
    'create.form.submitting': 'Issuing...',
    'create.category.food': 'Food & Dining',
    'create.category.fitness': 'Fitness & Sports',
    'create.category.beauty': 'Beauty & Wellness',
    'create.category.retail': 'Retail & Shopping',
    'create.category.entertainment': 'Entertainment',
    'create.category.other': 'Other',
    'create.platform_title': 'Platform Advantages',
    'create.platform.fee': 'Only 1.5% platform fee (vs traditional platforms 30-60%)',
    'create.platform.smart_contract': 'Smart contracts automatically handle sales and distribution',
    'create.platform.blockchain': 'Blockchain technology ensures transparency and security',
    'create.platform.redemption': 'Support multiple redemption modes: discount, exchange, gift',
    'create.view_sales': 'View All Presales',
    
    // 销售页面
    'sale.loading': 'Loading...',
    'sale.loading_desc': 'Getting presale details',
    'sale.not_found': 'Presale Not Found',
    'sale.not_found_desc': 'The specified presale project was not found',
    'sale.issuer': 'Issuer',
    'sale.contract_address': 'Contract Address',
    'sale.progress': 'Sales Progress',
    'sale.completed': 'Completed',
    'sale.participants': 'Participants',
    'sale.price_per_pnt': 'Price per Point',
    'sale.total_supply': 'Total Supply',
    'sale.end_time': 'End Time',
    'sale.participate': 'Participate in Presale',
    'sale.login_to_participate': 'Please login to AirAccount to participate in presale',
    'sale.register_now': 'Register Now →',
    'sale.not_available': 'Presale not available',
    'sale.status': 'Status',
    'sale.account': 'Account',
    'sale.balance': 'Balance',
    'sale.purchase_amount': 'Purchase Amount',
    'sale.purchase_amount_placeholder': 'Enter the number of points to purchase',
    'sale.total_price': 'Total Price',
    'sale.about': 'About',
    'sale.buy_now': 'Buy Now',
    'sale.processing': 'Processing...',
    'sale.purchased': 'Purchased',
    'sale.fingerprint_required': '🔒 Please complete fingerprint verification',
    'sale.purchase_success': 'Purchase Successful!',
    'sale.details': 'Detailed Introduction',
    'sale.features': 'Points Features',
    'sale.usage_rules': 'Usage Rules',
    'sale.redemption_options': 'Redemption Options',
    'sale.cost': 'Cost',
    
    // 仪表板
    'dashboard.title': 'User Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.address': 'Address',
    'dashboard.total_balance': 'Total Balance',
    'dashboard.refresh': '🔄 Refresh',
    'dashboard.refreshing': 'Refreshing...',
    'dashboard.my_points': 'My Points',
    'dashboard.point_types': 'Point Types',
    'dashboard.available': 'Available',
    'dashboard.suspended': 'Suspended',
    'dashboard.no_points': 'You don\'t have any points yet',
    'dashboard.buy_points_link': 'Buy Points →',
    'dashboard.issuer': 'Issuer',
    'dashboard.total_supply': 'Total Supply',
    'dashboard.transactions': 'Transaction History',
    'dashboard.recent_transactions': 'Recent',
    'dashboard.transactions_count': 'Transactions',
    'dashboard.no_transactions': 'No transaction history',
    'dashboard.quick_actions': 'Quick Actions',
    'dashboard.buy_points_action': 'Buy Points',
    'dashboard.buy_points_desc': 'Browse and purchase merchant points',
    'dashboard.create_points': 'Issue Points',
    'dashboard.create_points_desc': 'Create your own loyalty card',
    'dashboard.play_to_earn': 'Play to Earn',
    'dashboard.play_to_earn_desc': 'Coming Soon',
    'dashboard.transaction_hash': 'Transaction Hash',
    'dashboard.login_required': 'Please login to AirAccount to view your points and transaction history',
    'dashboard.get_airaccount': 'Get AirAccount →',
    'dashboard.loading_data': 'Loading your data...',
    'dashboard.mock_alice_coffee': 'Alice Coffee Points',
    'dashboard.mock_alice_desc': 'Redeemable for beverages and discounts at Alice Coffee Shop',
    'dashboard.mock_bob_fitness': 'Bob Fitness Points',
    'dashboard.mock_bob_desc': 'Gym membership points, redeemable for classes and equipment use',
    'dashboard.mock_charlie_food': 'Charlie Restaurant Points',
    'dashboard.mock_charlie_desc': 'Restaurant points, enjoy food discounts and free meals',
    'dashboard.mock_tx_alice_purchase': 'Purchase Alice Coffee Points',
    'dashboard.mock_tx_twitter': 'Twitter share reward',
    'dashboard.mock_tx_alice_spend': 'Spending at Alice Coffee Shop',
    'dashboard.mock_tx_charlie_purchase': 'Purchase Charlie Restaurant Points',
    
    // 销售列表页面
    'sales.title': 'PNTs Presale Market',
    'sales.subtitle': 'Discover quality merchant points and enjoy decentralized loyalty experience',
    'sales.all': 'All',
    'sales.food': 'Food',
    'sales.fitness': 'Fitness',
    'sales.beauty': 'Beauty',
    'sales.retail': 'Retail',
    'sales.entertainment': 'Entertainment',
    'sales.active_presales': 'Total Projects',
    'sales.view_details': 'View Details',
    'sales.no_sales': 'No presale projects',
    'sales.no_sales_desc': 'Please check back later',
    'sales.loading': 'Loading...',
    'sales.total_participants': 'Total Participants',
    'sales.platform_fee': 'Platform Fee',
    
    // 区块链相关
    'blockchain.view_on_explorer': 'View transaction on {explorer}',
    'blockchain.view_address_on_explorer': 'View address on {explorer}',
    'blockchain.transaction_hash': 'Transaction Hash',
    'blockchain.amount': 'Amount',
    'blockchain.time': 'Time',
    'blockchain.status.pending': 'Pending',
    'blockchain.status.confirmed': 'Confirmed',
    'blockchain.status.failed': 'Failed',
    'blockchain.status.unknown': 'Unknown',
    
    // 交易状态
    'transaction.completed': 'Completed',
    'transaction.pending': 'Pending',
    'transaction.failed': 'Failed',
    'transaction.purchase': 'Purchase',
    'transaction.reward': 'Reward',
    'transaction.spend': 'Spend',
    'transaction.transfer': 'Transfer',
    
    // 状态
    'status.active': 'Active',
    'status.pending': 'Pending',
    'status.successful': 'Successful',
    'status.failed': 'Failed',
    'status.closed': 'Closed',
    'status.unknown': 'Unknown'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 防止SSR hydration错误：初始状态使用默认值，客户端挂载后再读取localStorage
  const [language, setLanguage] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 客户端挂载后读取localStorage
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('openpnts_language') as Language;
      if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
      }
    }
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);
    
    // 持久化到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('openpnts_language', newLanguage);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['zh']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
} 