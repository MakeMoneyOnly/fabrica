// API Client Mock for Testing
export const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

// Mock implementation that returns successful responses
export const createMockResponse = <T>(data: T, success = true) => ({
  data: {
    data,
    success,
    message: success ? 'Success' : 'Error',
    timestamp: new Date().toISOString(),
  },
  status: success ? 200 : 400,
  statusText: success ? 'OK' : 'Bad Request',
  headers: {},
  config: {},
});

// Mock error response
export const createMockError = (message: string, status = 400) => ({
  response: {
    data: {
      code: `HTTP_${status}`,
      message,
      timestamp: new Date().toISOString(),
    },
    status,
    statusText: 'Error',
  },
  message,
});

// Auth token mocks
export const mockAuthTokens = {
  accessToken: 'mock_access_token',
  refreshToken: 'mock_refresh_token',
  expiresIn: 3600,
  tokenType: 'Bearer',
};

// User mock
export const mockUser = {
  id: 'user_123',
  phoneNumber: '+251911123456',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  userType: 'customer' as const,
  isVerified: true,
  kycStatus: 'approved' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
