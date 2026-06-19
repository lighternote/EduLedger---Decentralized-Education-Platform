# EduLedger Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Stellar account with testnet XLM
- IPFS node access (Infura or local)

### 1. Install Dependencies

```bash
# Backend
npm install

# Frontend  
cd frontend
npm install
```

### 2. Environment Setup

Create `.env` file:
```env
# Stellar Configuration
STELLAR_NETWORK=testnet
ISSUER_SECRET_KEY=your_issuer_secret_key
DISTRIBUTION_SECRET_KEY=your_distribution_secret_key
MARKETPLACE_SECRET_KEY=your_marketplace_secret_key

# IPFS Configuration
IPFS_PROJECT_ID=your_infura_project_id
IPFS_PROJECT_SECRET=your_infura_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Deploy Smart Contracts

```bash
# Compile TypeScript
npm run build

# Deploy to Stellar testnet
npm run deploy
```

### 4. Start Applications

```bash
# Start backend server
npm start

# Start frontend (new terminal)
cd frontend
npm run dev
```

## 📋 Detailed Setup

### Stellar Network Setup

#### 1. Create Stellar Accounts
```bash
# Generate new keypairs
npm run generate:keys

# Fund accounts on testnet
# Visit: https://friendbot.stellar.org/
# Enter each public key to get 10,000 testnet XLM
```

#### 2. Configure Assets
```typescript
// EDU Token Configuration
const eduToken = new EduToken(
  issuerSecretKey,
  distributionSecretKey
);

// Create EDU token asset
await eduToken.createAsset();
```

#### 3. Set up Credential System
```typescript
// Credential NFT Configuration
const credentialNFT = new CredentialNFT(
  issuerSecretKey,
  true // testnet
);

// Add authorized issuers
await credentialNFT.addAuthorizedIssuer(institutionPublicKey);
```

### IPFS Storage Setup

#### 1. Infura Configuration
```typescript
const ipfsStorage = new IPFSStorage(
  'https://ipfs.infura.io:5001'
);
```

#### 2. Local IPFS Node (Alternative)
```bash
# Install IPFS
ipfs init
ipfs daemon

# Update configuration
IPFS_NODE_URL=http://localhost:5001
```

### Frontend Configuration

#### 1. Vite Setup
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
});
```

#### 2. Tailwind CSS
```bash
npx tailwindcss init -p
```

## 🌐 Network Configuration

### Testnet vs Mainnet

#### Testnet (Development)
```env
STELLAR_NETWORK=testnet
HORIZON_URL=https://horizon-testnet.stellar.org
NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

#### Mainnet (Production)
```env
STELLAR_NETWORK=public
HORIZON_URL=https://horizon.stellar.org
NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015
```

## 🔧 API Endpoints

### Backend Server

#### Token Operations
```bash
GET  /api/tokens/balance/:accountId
POST /api/tokens/mint
POST /api/tokens/stake
POST /api/tokens/unstake
GET  /api/tokens/rewards/:accountId
```

#### Credential Operations
```bash
POST /api/credentials/issue
GET  /api/credentials/:assetCode
GET  /api/credentials/user/:publicKey
PUT  /api/credentials/verify/:assetCode
DELETE /api/credentials/revoke/:assetCode
```

#### IPFS Operations
```bash
POST /api/ipfs/upload/course
GET  /api/ipfs/content/:cid
POST /api/ipfs/upload/video
POST /api/ipfs/upload/document
```

## 📊 Monitoring & Analytics

### Stellar Explorer
- Testnet: https://stellar.expert/explorer/testnet
- Mainnet: https://stellar.expert/explorer/public

### IPFS Gateway
- Public: https://ipfs.io/ipfs/
- Infura: https://ipfs.infura.io/ipfs/

### Application Metrics
```bash
# Install monitoring
npm install --save prometheus-client

# Metrics endpoint
GET /metrics
```

## 🔒 Security Considerations

### Key Management
- Use hardware wallets for production
- Store secrets in environment variables
- Implement key rotation policies
- Use multisig for critical operations

### Smart Contract Security
- Implement access controls
- Add pausable functionality
- Use established patterns (OpenZeppelin)
- Conduct security audits

### IPFS Security
- Pin important content
- Implement content verification
- Use encrypted storage for sensitive data
- Monitor for unauthorized access

## 🚀 Production Deployment

### 1. Infrastructure Setup

#### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8000
CMD ["node", "dist/index.js"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  ipfs:
    image: ipfs/go-ipfs
    ports:
      - "4001:4001"
      - "5001:5001"
      - "8080:8080"
```

### 2. Cloud Deployment

#### AWS Setup
```bash
# Deploy to ECS
aws ecs create-cluster --cluster-name educhain

# Deploy to Lambda (serverless)
serverless deploy

# S3 for frontend
aws s3 sync frontend/dist s3://educhain-frontend
```

#### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. CI/CD Pipeline

#### GitHub Actions
```yaml
name: Deploy EduLedger
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: npm run deploy:prod
```

## 📈 Scaling Considerations

### Database Scaling
- Use read replicas for high traffic
- Implement caching (Redis)
- Consider sharding for large datasets

### Stellar Scaling
- Use multiple issuing accounts
- Implement batch operations
- Monitor network fees

### IPFS Scaling
- Use multiple IPFS nodes
- Implement content distribution
- Use pinning services

## 🐛 Troubleshooting

### Common Issues

#### 1. Stellar Transaction Failed
```bash
# Check account balance
curl "https://horizon-testnet.stellar.org/accounts/{accountId}"

# Check transaction status
curl "https://horizon-testnet.stellar.org/transactions/{txHash}"
```

#### 2. IPFS Upload Failed
```bash
# Check IPFS node status
ipfs id

# Check available space
ipfs repo stat
```

#### 3. Frontend Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=educhain:* npm start

# Run tests in watch mode
npm test -- --watch
```

## 📞 Support

### Documentation
- [Stellar Documentation](https://developers.stellar.org/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [React Documentation](https://react.dev/)

### Community
- Discord: [EduLedger Community](https://discord.gg/educhain)
- GitHub Issues: [Report Bugs](https://github.com/educhain/issues)
- Twitter: [@EduLedgerDev](https://twitter.com/EduLedgerDev)

### Professional Support
- Enterprise Support: support@educhain.io
- Security Reports: security@educhain.io
- Business Inquiries: business@educhain.io

---

## 🎉 Next Steps

1. **Complete Setup**: Follow this guide to deploy your EduLedger instance
2. **Customize**: Modify branding and features for your use case
3. **Test**: Thoroughly test all functionality on testnet
4. **Launch**: Deploy to mainnet when ready
5. **Monitor**: Set up monitoring and alerting

Good luck with your EduLedger deployment! 🚀
