// Jest setup file
import 'jest';

// Global test setup
beforeAll(() => {
  // Set up test environment
});

afterAll(() => {
  // Clean up test environment
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
