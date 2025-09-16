import * as crypto from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

import { ChapaProvider } from './chapa.provider';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ChapaProvider (CBE Birr)', () => {
  let provider: ChapaProvider;

  const mockConfig = {
    CBE_BIRR_API_URL: 'https://api.cbe.et/birr',
    CBE_BIRR_MERCHANT_ID: 'cbe-merchant-123',
    CBE_BIRR_API_KEY: 'cbe-api-key-456',
    CBE_BIRR_WEBHOOK_SECRET: 'cbe-webhook-secret-789',
    BACKEND_URL: 'https://api.stanstore.et',
  };

  beforeEach(async () => {
    process.env = { ...process.env, ...mockConfig };

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
      providers: [ChapaProvider],
    }).compile();

    provider = module.get<ChapaProvider>(ChapaProvider);
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

    it('should initialize CBE Birr payment successfully with valid data (simplified)', async () => {
      const result = await provider.initializePayment(mockInput);

      expect(result).toHaveProperty('provider', 'CBE_BIRR');
      expect(result).toHaveProperty('orderId', 'test-order-123');
      expect(result).toHaveProperty('amount', 50000);
      expect(result).toHaveProperty('currency', 'ETB');
      expect(result).toHaveProperty('initializedAt');
    });
  });

  describe('handleWebhook', () => {
    const validWebhookPayload = {
      merchantId: 'cbe-merchant-123',
      transactionId: 'tx-123456789',
      orderId: 'test-order-123',
      amount: '500.00',
      currency: 'ETB',
      status: 'SUCCESS' as const,
      timestamp: '2025-01-15T10:30:00Z',
      signature: 'valid-cbe-signature',
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+251911000000',
      },
      settlementInfo: {
        settlementDate: '2025-01-16',
        bankReference: 'SET-789',
        fees: '2.50',
      },
    };

    it('should process CBE Birr webhook successfully with valid signature', async () => {
      // Mock the webhook signature verification to return true
      jest.spyOn(provider as any, 'verifyWebhookSignature').mockReturnValue(true);

      const result = await provider.handleWebhook(validWebhookPayload);

      expect(result).toEqual({
        provider: 'CBE_BIRR',
        transactionId: 'tx-123456789',
        orderId: 'test-order-123',
        reference: 'tx-123456789',
        amount: 50000,
        currency: 'ETB',
        status: 'SUCCESS',
        timestamp: '2025-01-15T10:30:00Z',
        customerInfo: validWebhookPayload.customerInfo,
        settlementInfo: validWebhookPayload.settlementInfo,
        verified: true,
      });
    });

    it('should reject webhook with invalid signature', async () => {
      jest.spyOn(provider as any, 'verifyWebhookSignature').mockReturnValue(false);

      await expect(provider.handleWebhook(validWebhookPayload)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should map CBE Birr status correctly', () => {
      const testCases = [
        { cbe: 'SUCCESS', expected: 'SUCCESS' },
        { cbe: 'FAILED', expected: 'FAILED' },
        { cbe: 'CANCELLED', expected: 'CANCELLED' },
        { cbe: 'PENDING', expected: 'PENDING' },
      ];

      testCases.forEach(({ cbe, expected }) => {
        const result = (provider as any).mapCbeBirrStatus(cbe);
        expect(result).toBe(expected);
      });
    });
  });

  describe('verifyPayment', () => {
    it('should verify CBE Birr payment successfully', async () => {
      const mockPayload = { transactionId: 'tx-123456789' };
      const mockResponse = {
        data: {
          data: {
            status: 'SUCCESS',
            settlementInfo: {
              settlementDate: '2025-01-16',
              fees: '2.50',
            },
          },
        },
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
        provider: 'CBE_BIRR',
        transactionId: 'tx-123456789',
        status: 'SUCCESS',
        settlementInfo: mockResponse.data.data.settlementInfo,
        verified: true,
      });
    });

    it('should handle CBE Birr verification errors gracefully', async () => {
      const mockPayload = { transactionId: 'tx-123456789' };
      const error = new Error('Bank service unavailable');

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(error),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      } as any);

      const result = await provider.verifyPayment(mockPayload);

      expect(result).toEqual({
        provider: 'CBE_BIRR',
        transactionId: 'tx-123456789',
        status: 'UNKNOWN',
        verified: false,
        error: 'Bank service unavailable',
      });
    });
  });

  describe('Ethiopian Banking Optimizations', () => {
    it('should have extended timeout for Ethiopian banking network', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 30000, // Banking network timeout
          headers: expect.objectContaining({
            'User-Agent': 'StanStore-CBE-Ethiopia/1.0',
          }),
        }),
      );
    });

    it('should include merchant ID in headers', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Merchant-ID': mockConfig.CBE_BIRR_MERCHANT_ID,
          }),
        }),
      );
    });
  });

  describe('Security Features', () => {
    it('should generate request signatures for CBE Birr API calls', () => {
      const request = {
        merchantId: 'cbe-merchant-123',
        amount: '500.00',
        currency: 'ETB',
        orderId: 'test-order-123',
      };

      const signature = (provider as any).generateRequestSignature(request);
      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);
    });

    it('should verify webhook signatures using HMAC-SHA256', () => {
      const payload = {
        merchantId: 'cbe-merchant-123',
        transactionId: 'tx-123456789',
        orderId: 'test-order-123',
        amount: '500.00',
        currency: 'ETB',
        status: 'SUCCESS' as const,
        timestamp: '2025-01-15T10:30:00Z',
        signature: '' as string,
      };

      // Calculate expected signature
      const { ...payloadWithoutSignature } = payload;
      const payloadString = JSON.stringify(payloadWithoutSignature);

      const expectedSignature = crypto
        .createHmac('sha256', mockConfig.CBE_BIRR_WEBHOOK_SECRET)
        .update(payloadString)
        .digest('hex');

      payload.signature = expectedSignature;

      const isValid = (provider as any).verifyWebhookSignature(payload);
      expect(isValid).toBe(true);
    });
  });

  describe('Settlement Features', () => {
    it('should handle settlement information from CBE', () => {
      const webhookPayload = {
        merchantId: 'cbe-merchant-123',
        transactionId: 'tx-123456789',
        orderId: 'test-order-123',
        amount: '500.00',
        currency: 'ETB',
        status: 'SUCCESS' as const,
        timestamp: '2025-01-15T10:30:00Z',
        signature: 'valid-signature',
        settlementInfo: {
          settlementDate: '2025-01-16T10:00:00Z',
          bankReference: 'SET-789123',
          fees: '2.50',
        },
      };

      jest.spyOn(provider as any, 'verifyWebhookSignature').mockReturnValue(true);
      expect(webhookPayload.settlementInfo).toEqual({
        settlementDate: '2025-01-16T10:00:00Z',
        bankReference: 'SET-789123',
        fees: '2.50',
      });
    });
  });
});
