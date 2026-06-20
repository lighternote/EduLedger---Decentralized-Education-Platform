import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: 'EduLedger API - Decentralized Education Platform',
    version: '1.0.0',
    status: 'running',
    blockchain: 'Stellar',
    network: process.env.STELLAR_NETWORK || 'testnet'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/v1/info', (req, res) => {
  res.json({
    project: 'EduLedger',
    description: 'Decentralized Education Platform on Stellar',
    features: [
      'Verifiable Credentials NFTs',
      'Learn-to-Earn Model',
      'Decentralized Content Marketplace',
      'Skill Verification System'
    ],
    endpoints: {
      tokens: '/api/v1/tokens',
      credentials: '/api/v1/credentials',
      storage: '/api/v1/storage'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Export port for use in main file
export { PORT };

export default app;
