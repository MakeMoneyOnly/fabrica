// Application Configuration
export const appConfig = {
  name: 'Fabrica',
  description: 'The all-in-one platform for creators in Ethiopia',
  version: '0.1.0',
  environment: process.env.NODE_ENV || 'development',

  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 30000,
    retries: 3,
  },

  // Feature Flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableNotifications: true,
    enablePayments: true,
    enableMarketing: true,
  },

  // Security Configuration
  security: {
    enableCSP: true,
    enableHSTS: true,
    sessionTimeout: 3600000, // 1 hour
  },

  // Performance Configuration
  performance: {
    enableImageOptimization: true,
    enableCodeSplitting: true,
    bundleAnalyzer: process.env.ANALYZE === 'true',
  },

  // Ethiopian-specific configuration
  ethiopian: {
    timezone: 'Africa/Addis_Ababa',
    calendar: 'ethiopic',
    currency: 'ETB',
    language: 'en',
  },
} as const;

export type AppConfig = typeof appConfig;
