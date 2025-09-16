import * as crypto from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

import { WeBirrProvider } from './webirr.provider';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeBirrProvider', () => {
  let provider: WeBirrProvider;

  const mockConfig = {
    WEBIRR_API_URL: 'https://api.webirr.com',
    WEBIRR_MERCHANT_ID: 'test-merchant-id',
    WEBIRR_API_KEY: 'test-api-key',
    WEBIRR_WEBHOOK_SECRET: 'test-webhook-secret',
    BACKEND_URL: 'https://api.stanstore.et',
  };

  beforeEach(async () => {
    process.env = { ...process.env, ...mockConfig };

    // Mock axios create method properly
    const mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [WeBirrProvider],
    }).compile();

    provider = module.get<WeBirrProvider>(WeBirrProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.BACKEND_URL;
  });

  describe('initializePayment', () => {
    const mockInput = {
      orderId: 'test-order-123',
      amountInt: 50000, // 500 ETB in cents
      currency: 'ETB',
      returnUrl: 'https://stanstore.et/success',
    };

    it('should initialize payment successfully with valid data (simplified)', async () => {
      const result = await provider.initializePayment(mockInput);

      // Just check that it returns the expected structure
      expect(result).toHaveProperty('provider', 'WEBIRR');
      expect(result).toHaveProperty('orderId', 'test-order-123');
      expect(result).toHaveProperty('amount', 50000);
      expect(result).toHaveProperty('currency', 'ETB');
      expect(result).toHaveProperty('initializedAt');
    });
  });

  describe('handleWebhook', () => {
    const validWebhookPayload = {
      billId: 'BILL-123456',
      orderId: 'test-order-123',
      amount: '500.00',
      currency: 'ETB',
      status: 'PAID' as const,
      timestamp: '2025-01-15T10:30:00Z',
      signature: 'valid-signature',
      paymentMethod: 'TeleBirr',
      transactionId: 'TXN-789',
    };

    it('should process webhook successfully with valid signature', async () => {
      // Mock the webhook signature verification to return true
      jest.spyOn(provider as any, 'verifyWebhookSignature').mockReturnValue(true);

      const result = await provider.handleWebhook(validWebhookPayload);

      expect(result).toEqual({
        provider: 'WEBIRR',
        orderId: 'test-order-123',
        billId: 'BILL-123456',
        amount: 50000, // Converted to cents
        currency: 'ETB',
        status: 'SUCCESS',
        transactionId: 'TXN-789',
        paymentMethod: 'TeleBirr',
        timestamp: '2025-01-15T10:30:00Z',
        verified: true,
      });
    });

    it('should reject webhook with invalid signature', async () => {
      jest.spyOn(provider as any, 'verifyWebhookSignature').mockReturnValue(false);

      await expect(provider.handleWebhook(validWebhookPayload)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject webhook with missing required fields', async () => {
      const invalidPayload = {
        billId: 'BILL-123456',
        // Missing orderId and status
        amount: '500.00',
        signature: 'test-signature',
      };

      await expect(provider.handleWebhook(invalidPayload as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should map WeBirr status correctly', () => {
      const testCases = [
        { webirr: 'PAID', expected: 'SUCCESS' },
        { webirr: 'FAILED', expected: 'FAILED' },
        { webirr: 'CANCELLED', expected: 'CANCELLED' },
        { webirr: 'PENDING', expected: 'PENDING' },
      ];

      testCases.forEach(({ webirr, expected }) => {
        const result = (provider as any).mapWeBirrStatus(webirr);
        expect(result).toBe(expected);
      });
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment successfully', async () => {
      const mockPayload = { billId: 'BILL-123456' };
      const mockResponse = {
        data: { status: 'PAID' },
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      } as any);

      const result = await provider.verifyPayment(mockPayload);

      expect(result).toEqual({
        provider: 'WEBIRR',
        billId: 'BILL-123456',
        status: 'PAID',
        verified: true,
      });
    });

    it('should handle verification errors gracefully', async () => {
      const mockPayload = { billId: 'BILL-123456' };
      const error = new Error('Network error');

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(error),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      } as any);

      const result = await provider.verifyPayment(mockPayload);

      expect(result).toEqual({
        provider: 'WEBIRR',
        billId: 'BILL-123456',
        status: 'UNKNOWN',
        verified: false,
        error: 'Network error',
      });
    });
  });

  describe('Ethiopian Market Optimizations', () => {
    it('should have extended timeout for Ethiopian connectivity', () => {
      // Check that the axios instance is created with Ethiopian-optimized timeout
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 30000, // Ethiopian network timeout
        }),
      );
    });

    it('should include Ethiopian User-Agent in requests', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': 'StanStore-Ethiopia/1.0',
          }),
        }),
      );
    });
  });

  describe('Security Features', () => {
    it('should verify webhook signature using HMAC-SHA256', () => {
      const payload = {
        billId: 'BILL-123',
        orderId: 'ORD-456',
        amount: '100.00',
        currency: 'ETB',
        status: 'PAID' as const,
        timestamp: '2025-01-01T00:00:00Z',
        signature: '' as string,
        paymentMethod: 'CBE Birr',
        transactionId: 'TX-789',
      };

      // Calculate expected signature
      const { ...payloadWithoutSignature } = payload;

      const signatureString = Object.keys(payloadWithoutSignature)
        .sort()
        .map(key => `${key}=${payloadWithoutSignature[key as keyof typeof payloadWithoutSignature]}`)
        .join('&');

      const expectedSignature = crypto
        .createHmac('sha256', mockConfig.WEBIRR_WEBHOOK_SECRET)
        .update(signatureString)
        .digest('hex');

      payload.signature = expectedSignature;

      const isValid = (provider as any).verifyWebhookSignature(payload);
      expect(isValid).toBe(true);
    });
  });
});
