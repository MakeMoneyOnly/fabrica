/**
 * Redis Configuration for Ethiopian Creator Platform
 *
 * Optimizes Redis connections for Ethiopian market with:
 * - Session storage for web clients
 * - Payment data caching (wei/limit)
 * - Ethiopian performance optimizations
 * - Connection pooling for Ethiopian network conditions
 */

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  ttl?: number; // Default TTL in seconds
  retryDelayOnFailover?: number;
  maxRetriesPerRequest?: number;
  connectTimeout?: number;
  commandTimeout?: number;
}

export class RedisConfigService {
  getSessionConfig(): RedisConfig {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_SESSION_DB || '0'),
      keyPrefix: 'stan:session:',
      ttl: 7 * 24 * 60 * 60, // 7 days
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
      commandTimeout: 3000,
    };
  }

  getPaymentConfig(): RedisConfig {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_PAYMENT_DB || '1'),
      keyPrefix: 'stan:payment:',
      ttl: 60 * 60, // 1 hour for payment data
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
      commandTimeout: 3000,
    };
  }

  getCacheConfig(): RedisConfig {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_CACHE_DB || '2'),
      keyPrefix: 'stan:cache:',
      ttl: 30 * 60, // 30 minutes for general cache
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
      commandTimeout: 2000,
    };
  }
}
