// AirAccount用户接口
export interface AirAccountUser {
  email: string;
  ens: string;
  address: string;
  pntsBalance: number;
  isVerified: boolean;
  createdAt: string;
}

// AirAccount Context类型
export interface AirAccountContextType {
  user: AirAccountUser | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  mockFingerprint: () => Promise<boolean>;
  refreshBalance: () => Promise<void>;
}

// Mock数据模拟后端响应
export const MOCK_USERS: Record<string, AirAccountUser> = {
  'alice@coffee.com': {
    email: 'alice@coffee.com',
    ens: 'alice.coffee.eth',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    pntsBalance: 1250,
    isVerified: true,
    createdAt: '2024-01-15'
  },
  'bob@customer.com': {
    email: 'bob@customer.com', 
    ens: 'bob.customer.eth',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    pntsBalance: 520,
    isVerified: true,
    createdAt: '2024-02-01'
  },
  'charlie@business.com': {
    email: 'charlie@business.com',
    ens: 'charlie.biz.eth', 
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    pntsBalance: 2100,
    isVerified: true,
    createdAt: '2024-01-20'
  }
};

// 工具函数
export const getAirAccountUrl = () => 'https://airaccount.aastar.io';

export const formatPNTs = (amount: number): string => {
  return `${amount.toLocaleString()} PNTs`;
};

// 登录逻辑函数
export const loginWithEmail = async (email: string): Promise<AirAccountUser | null> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const normalizedEmail = email.toLowerCase().trim();
  const userData = MOCK_USERS[normalizedEmail];
  
  if (userData) {
    return userData;
  } else {
    // 如果是新用户，创建新账户
    const newUser: AirAccountUser = {
      email: normalizedEmail,
      ens: `${normalizedEmail.split('@')[0]}.new.eth`,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      pntsBalance: 50, // 新用户赠送50 PNTs
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    return newUser;
  }
};

// 模拟指纹验证
export const mockFingerprint = async (): Promise<boolean> => {
  // 模拟指纹扫描延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 95%成功率模拟
  return Math.random() > 0.05;
}; 