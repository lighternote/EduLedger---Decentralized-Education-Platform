import request from 'supertest';
import app from '../api';

// Add Jest globals
declare const describe: jest.Describe;
declare const it: jest.It;
declare const expect: jest.Expect;
declare const beforeAll: jest.Lifecycle;
declare const afterAll: jest.Lifecycle;

describe('API Tests', () => {
  it('should return basic info', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('status');
  });

  it('should return health check', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return API info', async () => {
    const response = await request(app)
      .get('/api/v1/info')
      .expect(200);
    
    expect(response.body).toHaveProperty('project', 'EduLedger');
    expect(response.body).toHaveProperty('features');
    expect(Array.isArray(response.body.features)).toBe(true);
  });
});
