# OpenPNTs Technical Implementation Guide

## 📋 Overview

OpenPNTs is a decentralized loyalty points platform that enables businesses to issue and manage blockchain-based loyalty tokens with minimal fees (1.5% vs traditional 30-60%).

## 🏗️ Architecture Overview

### Frontend Architecture
```
frontend/
├── app/                     # Next.js 15 App Router
│   ├── components/         # Reusable UI components
│   ├── create/            # PNT creation page
│   ├── dashboard/         # User dashboard
│   ├── sales/             # Marketplace listing
│   └── sale/[address]/    # Individual sale page
├── data/                  # Mock data (Replace with APIs)
│   ├── sales.json        # Static presale data
│   └── created.json      # Dynamic created PNTs
├── lib/                   # Business logic & services
│   ├── airaccount.ts     # User authentication
│   ├── blockchain.ts     # Blockchain utilities
│   ├── createData.ts     # PNT creation service
│   ├── salesData.ts      # Sales data service
│   └── i18n.tsx          # Internationalization
└── providers.tsx         # React context providers
```

### Key Technologies
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Authentication**: AirAccount (email-based, no wallet required)
- **Blockchain**: Ethereum-compatible (Mainnet/Sepolia/Local)
- **State Management**: React Context + React Query
- **Build Tool**: pnpm
- **Internationalization**: Custom i18n with Chinese/English support

## 🚀 Demo Features Implementation

### 1. User Authentication
```typescript
// Current: Mock authentication
const login = async (email: string): Promise<boolean> => {
  const userData = await loginWithEmail(email); // Mock API
  // ... handle login
};

// Production: Real AirAccount integration
const login = async (email: string): Promise<boolean> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
  // ... handle real authentication
};
```

### 2. PNT Creation System
```typescript
// Current: Fake blockchain simulation
export async function simulateCreatePNT(): Promise<CreateResult> {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Fake delay
  return {
    success: true,
    transaction: generateFakeTransaction() // Mock data
  };
}

// Production: Real blockchain deployment
export async function createPNT(formData: CreateFormData): Promise<CreateResult> {
  const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
  const tx = await contract.createPNT(
    formData.name,
    formData.totalSupply,
    formData.pricePerPNT
  );
  return { success: true, transaction: await tx.wait() };
}
```

### 3. Data Layer Integration
```typescript
// Current: JSON file data merge
export async function fetchSalesData(): Promise<SalesApiResponse> {
  const staticData = salesDataJson as SalesData;
  const createdData = createDataJson as CreateData;
  const merged = [...staticData.sales, ...convertedCreated];
  return { data: merged, ... };
}

// Production: Real API calls
export async function fetchSalesData(): Promise<SalesApiResponse> {
  const response = await fetch('/api/sales');
  return await response.json();
}
```

## 🔄 Demo to Production Migration

### Phase 1: Backend API Development
1. **Database Setup**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  ens_name VARCHAR(255),
  wallet_address VARCHAR(42),
  pnts_balance DECIMAL(18,8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PNT tokens table
CREATE TABLE pnt_tokens (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  contract_address VARCHAR(42) UNIQUE,
  sale_address VARCHAR(42),
  name_zh VARCHAR(255),
  name_en VARCHAR(255),
  description_zh TEXT,
  description_en TEXT,
  total_supply BIGINT,
  price_per_pnt DECIMAL(18,8),
  category VARCHAR(50),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sales table
CREATE TABLE sales (
  id UUID PRIMARY KEY,
  pnt_token_id UUID REFERENCES pnt_tokens(id),
  sold_amount BIGINT DEFAULT 0,
  target_amount BIGINT,
  participants_count INTEGER DEFAULT 0,
  end_time TIMESTAMP,
  status VARCHAR(20),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

2. **API Endpoints**
```typescript
// Express.js API structure
app.post('/api/auth/login', handleLogin);
app.get('/api/sales', getSales);
app.post('/api/create', createPNT);
app.get('/api/user/:id/dashboard', getUserDashboard);
app.post('/api/purchase/:saleId', purchasePNTs);
```

### Phase 2: Blockchain Integration
1. **Smart Contracts Deployment**
```solidity
// PNTFactory.sol - Contract factory for creating PNT tokens
contract PNTFactory {
    function createPNT(
        string memory name,
        uint256 totalSupply,
        uint256 pricePerToken
    ) external returns (address pntContract, address saleContract);
}

// PNTToken.sol - ERC20 loyalty token
// PNTSale.sol - Presale contract with automatic refunds
```

2. **Web3 Integration**
```typescript
// Replace mock blockchain functions
import { ethers } from 'ethers';

export class BlockchainService {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;

  async deployPNT(params: CreatePNTParams): Promise<DeployResult> {
    const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, this.signer);
    const tx = await factory.createPNT(params.name, params.totalSupply, params.price);
    const receipt = await tx.wait();
    return {
      contractAddress: receipt.events[0].args.pntContract,
      saleAddress: receipt.events[0].args.saleContract,
      transactionHash: receipt.transactionHash
    };
  }
}
```

### Phase 3: Replace Mock Data Services
1. **Sales Service Migration**
```typescript
// Before: Static + Created JSON merge
const staticData = salesDataJson as SalesData;
const createdData = createDataJson as CreateData;

// After: Real API integration
export class SalesService {
  async fetchSales(): Promise<PNTSale[]> {
    const response = await fetch(`${API_BASE}/sales`);
    return await response.json();
  }

  async createSale(pntData: CreatePNTParams): Promise<PNTSale> {
    const response = await fetch(`${API_BASE}/sales`, {
      method: 'POST',
      body: JSON.stringify(pntData)
    });
    return await response.json();
  }
}
```

2. **Authentication Service**
```typescript
// Replace mock AirAccount with real integration
export class AuthService {
  async loginWithEmail(email: string): Promise<User> {
    const response = await fetch('/api/auth/airaccount', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    return await response.json();
  }
}
```

## 🔗 System Integration Points

### 1. AirAccount Integration
```typescript
// AirAccount SDK integration
import { AirAccountSDK } from '@airaccount/sdk';

const airAccount = new AirAccountSDK({
  appId: process.env.AIRACCOUNT_APP_ID,
  apiKey: process.env.AIRACCOUNT_API_KEY
});

export async function authenticateUser(email: string): Promise<User> {
  const session = await airAccount.auth.login({ email });
  return {
    id: session.userId,
    email: session.email,
    ens: session.ensName,
    address: session.walletAddress
  };
}
```

### 2. Blockchain Network Configuration
```typescript
// Multi-network support
export const NETWORK_CONFIG = {
  mainnet: {
    chainId: 1,
    rpcUrl: process.env.MAINNET_RPC_URL,
    explorerUrl: 'https://etherscan.io',
    factoryAddress: '0x...' // Deployed factory contract
  },
  sepolia: {
    chainId: 11155111,
    rpcUrl: process.env.SEPOLIA_RPC_URL,
    explorerUrl: 'https://sepolia.etherscan.io',
    factoryAddress: '0x...'
  }
};
```

### 3. Payment Integration
```typescript
// Crypto payment processing
export class PaymentService {
  async processPNTPurchase(saleId: string, amount: number): Promise<PurchaseResult> {
    // Handle ETH/USDC payments
    const saleContract = new ethers.Contract(saleAddress, SALE_ABI, signer);
    const tx = await saleContract.purchase(amount, {
      value: ethers.parseEther((amount * price).toString())
    });
    return await tx.wait();
  }
}
```

### 4. Analytics & Monitoring
```typescript
// Business metrics tracking
export class AnalyticsService {
  trackPNTCreation(pntId: string, creatorId: string) {
    // Track business creation events
  }
  
  trackPurchase(saleId: string, userId: string, amount: number) {
    // Track user engagement and sales volume
  }
}
```

## 📊 Production Deployment Checklist

### Infrastructure Requirements
- [ ] **Database**: PostgreSQL with connection pooling
- [ ] **Blockchain**: Ethereum node access (Infura/Alchemy)
- [ ] **CDN**: Static assets and image hosting
- [ ] **Monitoring**: Error tracking (Sentry) + metrics (DataDog)
- [ ] **Security**: Rate limiting, input validation, SQL injection protection

### Environment Configuration
```bash
# Production environment variables
DATABASE_URL=postgresql://...
BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/...
AIRACCOUNT_API_KEY=...
FACTORY_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_API_URL=https://api.openpnts.com
REDIS_URL=redis://...
```

### Monitoring & Alerts
```typescript
// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: await checkDatabase(),
    blockchain: await checkBlockchain(),
    timestamp: new Date().toISOString()
  });
});
```

### Security Considerations
1. **Smart Contract Audits**: Audit all contracts before mainnet deployment
2. **Rate Limiting**: Protect API endpoints from abuse
3. **Input Validation**: Sanitize all user inputs
4. **Access Control**: Implement proper authentication and authorization
5. **Monitoring**: Real-time fraud detection and suspicious activity alerts

## 🔄 Migration Strategy

### Week 1-2: Backend Development
- Set up database and API endpoints
- Deploy smart contracts to testnet
- Implement core business logic

### Week 3-4: Frontend Integration
- Replace mock services with real APIs
- Implement wallet integration
- Add error handling and loading states

### Week 5-6: Testing & Optimization
- End-to-end testing on testnet
- Performance optimization
- Security testing

### Week 7-8: Production Deployment
- Deploy to mainnet
- Set up monitoring and alerts
- Launch with limited beta users

## 📈 Scaling Considerations

### Performance Optimization
- **Database**: Index optimization, query caching
- **API**: Response caching with Redis
- **Frontend**: Code splitting, image optimization
- **Blockchain**: Batch transactions, gas optimization

### Business Scaling
- **Multi-chain**: Support for other EVM chains (Polygon, BSC)
- **Mobile**: React Native app development
- **Enterprise**: White-label solutions for large businesses
- **International**: Additional language support

This guide provides a clear roadmap for transitioning from the current demo implementation to a production-ready system capable of handling real users and transactions. 