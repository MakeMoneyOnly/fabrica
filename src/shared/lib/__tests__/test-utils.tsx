// Test Utilities for React Components
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Create a custom render function that includes providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Custom test utilities
export const testUtils = {
  // Wait for a specific amount of time
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Create mock functions with names for better debugging
  createMock: (name: string) => jest.fn().mockName(name),

  // Mock API responses
  mockApiResponse: <T>(data: T, success = true) => ({
    data: {
      data,
      success,
      message: success ? 'Success' : 'Error',
      timestamp: new Date().toISOString(),
    },
    status: success ? 200 : 400,
  }),

  // Mock API error
  mockApiError: (message: string, status = 400) => ({
    response: {
      data: {
        code: `HTTP_${status}`,
        message,
        timestamp: new Date().toISOString(),
      },
      status,
    },
  }),

  // Setup localStorage mocks
  setupLocalStorage: (initialData: Record<string, string> = {}) => {
    localStorageMock.getItem.mockImplementation((key: string) => initialData[key] || null);
    localStorageMock.setItem.mockImplementation((key: string, value: string) => {
      initialData[key] = value;
    });
    localStorageMock.removeItem.mockImplementation((key: string) => {
      delete initialData[key];
    });
    localStorageMock.clear.mockImplementation(() => {
      Object.keys(initialData).forEach(key => delete initialData[key]);
    });
  },

  // Clear all mocks
  clearMocks: () => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  },
};

export * from '@testing-library/react';
export { customRender as render };
