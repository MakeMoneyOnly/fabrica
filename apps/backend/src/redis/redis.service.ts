import { Injectable, Logger } from '@nestjs/common';

import { RedisConfigService } from '../config/redis.config';

/**
 * Cache Service for Ethiopian Creator Platform
 *
 * Provides caching and session management optimized for Ethiopian market:
 * - Session storage with Ethiopian user data
 * - Payment processing caching (in-memory fallback until Redis is installed)
 * - General application caching
 * - Ethiopian performance optimizations
 *
 * Note: Using in-memory cache until ioredis package is installed
 */

interface CacheEntry {
  data: unknown;
  expiry: number;
}

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private sessionStorage: Map<string, CacheEntry> = new Map();
  private paymentStorage: Map<string, CacheEntry> = new Map();
  private cacheStorage: Map<string, CacheEntry> = new Map();
  private configService: RedisConfigService;
  private cleanupInterval!: NodeJS.Timeout;

  constructor() {
    this.configService = new RedisConfigService();
    this.startCleanupInterval();
    this.logger.log('Cache service initialized for Ethiopian infrastructure');
  }

  private startCleanupInterval(): void {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, 5 * 60 * 1000);
  }

  private performCleanup(): void {
    const now = Date.now() / 1000;
    let cleaned = 0;

    [this.sessionStorage, this.paymentStorage, this.cacheStorage].forEach(storage => {
      for (const [key, entry] of storage.entries()) {
        if (entry.expiry < now) {
          storage.delete(key);
          cleaned++;
        }
      }
    });

    if (cleaned > 0) {
      this.logger.debug(`Cleaned up ${cleaned} expired cache entries`);
    }
  }

  // Session Management Methods
  async setSession(sessionId: string, data: any, ttl?: number): Promise<void> {
    const sessionConfig = this.configService.getSessionConfig();
    const key = `${sessionConfig.keyPrefix}${sessionId}`;
    const expiry = Math.floor(Date.now() / 1000) + (ttl || (sessionConfig.ttl ?? 7 * 24 * 60 * 60));

    this.sessionStorage.set(key, {
      data: JSON.stringify(data || {}),
      expiry
    });

    this.logger.debug(`Session stored for Ethiopian user: ${sessionId}`);
  }

  async getSession(sessionId: string): Promise<any> {
    const sessionConfig = this.configService.getSessionConfig();
    const key = `${sessionConfig.keyPrefix}${sessionId}`;

    const entry = this.sessionStorage.get(key);
    if (!entry) return null;

    if (entry.expiry < Date.now() / 1000) {
      this.sessionStorage.delete(key);
      return null;
    }

    try {
      return JSON.parse(entry.data as string);
    } catch (error: unknown) {
      this.logger.error(`Failed to parse session data for Ethiopian user: ${sessionId}`, error);
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    const sessionConfig = this.configService.getSessionConfig();
    const key = `${sessionConfig.keyPrefix}${sessionId}`;

    this.sessionStorage.delete(key);
    this.logger.debug(`Session deleted for Ethiopian user: ${sessionId}`);
  }

  // Payment Caching Methods
  async setPaymentData(key: string, data: any, ttl?: number): Promise<void> {
    const paymentConfig = this.configService.getPaymentConfig();
    const fullKey = `${paymentConfig.keyPrefix}${key}`;
    const expiry = Math.floor(Date.now() / 1000) + (ttl || (paymentConfig.ttl ?? 60 * 60));

    this.paymentStorage.set(fullKey, {
      data: JSON.stringify(data),
      expiry
    });

    this.logger.debug(`Payment data cached for Ethiopian transaction: ${key}`);
  }

  async getPaymentData(key: string): Promise<any> {
    const paymentConfig = this.configService.getPaymentConfig();
    const fullKey = `${paymentConfig.keyPrefix}${key}`;

    const entry = this.paymentStorage.get(fullKey);
    if (!entry) return null;

    if (entry.expiry < Date.now() / 1000) {
      this.paymentStorage.delete(fullKey);
      return null;
    }

    try {
      return JSON.parse(entry.data as string);
    } catch (error: any) {
      this.logger.error(`Failed to parse payment data for Ethiopian transaction: ${key}`, error);
      return null;
    }
  }

  // General Caching Methods
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const cacheConfig = this.configService.getCacheConfig();
    const fullKey = `${cacheConfig.keyPrefix}${key}`;
    const expiry = Math.floor(Date.now() / 1000) + (ttl || (cacheConfig.ttl ?? 30 * 60));

    this.cacheStorage.set(fullKey, {
      data: typeof value === 'string' ? value : JSON.stringify(value),
      expiry
    });

    this.logger.debug(`Data cached for Ethiopian application: ${key}`);
  }

  async get(key: string): Promise<any> {
    const cacheConfig = this.configService.getCacheConfig();
    const fullKey = `${cacheConfig.keyPrefix}${key}`;

    const entry = this.cacheStorage.get(fullKey);
    if (!entry) return null;

    if (entry.expiry < Date.now() / 1000) {
      this.cacheStorage.delete(fullKey);
      return null;
    }

    try {
      // Try to parse as JSON, fallback to string
      return JSON.parse(entry.data as string);
    } catch {
      return entry.data;
    }
  }

  async delete(key: string): Promise<void> {
    const cacheConfig = this.configService.getCacheConfig();
    const fullKey = `${cacheConfig.keyPrefix}${key}`;

    this.cacheStorage.delete(fullKey);
    this.logger.debug(`Cache deleted for Ethiopian application: ${key}`);
  }

  // Health check method for Ethiopian infrastructure monitoring
  async ping(client: 'session' | 'payment' | 'cache' = 'cache'): Promise<boolean> {
    try {
      let storage: Map<string, CacheEntry>;
      switch (client) {
        case 'session':
          storage = this.sessionStorage;
          break;
        case 'payment':
          storage = this.paymentStorage;
          break;
        case 'cache':
        default:
          storage = this.cacheStorage;
          break;
      }

      // In-memory cache is always "available"
      return storage !== undefined;
    } catch (error: any) {
      this.logger.error(`Cache ${client} health check failed for Ethiopian infrastructure`, error);
      return false;
    }
  }

  // Cleanup method for Ethiopian graceful shutdowns
  async cleanup(): Promise<void> {
    try {
      clearInterval(this.cleanupInterval);
      this.sessionStorage.clear();
      this.paymentStorage.clear();
      this.cacheStorage.clear();
      this.logger.log('Cache cleaned up for Ethiopian application shutdown');
    } catch (error: any) {
      this.logger.error('Error during cache cleanup for Ethiopian application', error);
    }
  }
}
