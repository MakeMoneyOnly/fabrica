import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

import { TelebirrProvider } from './telebirr.provider';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TelebirrProvider', () => {
  let provider: TelebirrProvider;

  const mockConfig = {
    TELEBIRR_API_URL: 'https://api.telebirr.et',
    TELEBIRR_APP_ID: 'test-app-id',
    TELEBIRR_APP_KEY: 'test-app-key',
    TELEBIRR_PUBLIC_KEY: 'test-public-key',
    TELEBIRR_WEBHOOK_SECRET: 'test-webhook-secret',
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
      providers: [TelebirrProvider],
    }).compile();

    provider = module.get<TelebirrProvider>(TelebirrProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.BACKEND_URL;
  });

  describe('initializePayment', () => {
    const mockInput = {
      orderId: 'test-order-123',
      amountInt: 50000,
      currency: 'ETB',
      returnUrl: 'https://stanstore.et/success',
    };

    it('should initialize payment successfully with valid data (simplified)', async () => {
      const result = await provider.initializePayment(mockInput);

      // Just check that it returns the expected structure
      expect(result).toHaveProperty('provider', 'TELEBIRR');
      expect(result).toHaveProperty('orderId', 'test-order-123');
      expect(result).toHaveProperty('amount', 50000);
      expect(result).toHaveProperty('currency', 'ETB');
      expect(result).toHaveProperty('initializedAt');
    });
  });

  describe('handleWebhook', () => {
    const validWebhookPayload = {
      appId: 'test-app-id',
      outTradeNo: 'test-order-123',
      totalAmount: '500.00',
      currency: 'ETB',
      tradeStatus: 'SUCCESS' as const,
      timestamp: '2025-01-15T10:30:00Z',
      signature: 'valid-signature',
      buyerId: 'buyer-123',
      tradeNo: 'trade-456',
      phoneNumber: '+251911000000',
    };

    it('should process webhook successfully with valid signature', async () => {
      // Mock the webhook signature verification to return true
      jest.spyOn(provider as any, 'verifyWebhookSignature').mockReturnValue(true);

      const result = await provider.handleWebhook(validWebhookPayload);

      expect(result).toEqual({
        provider: 'TELEBIRR',
        outTradeNo: 'test-order-123',
        tradeNo: 'trade-456',
        buyerId: 'buyer-123',
        phoneNumber: '+251911000000',
        amount: 50000,
        currency: 'ETB',
        status: 'SUCCESS',
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

    it('should map TeleBirr status correctly', () => {
      const testCases = [
        { telebirr: 'SUCCESS', expected: 'SUCCESS' },
        { telebirr: 'FAILED', expected: 'FAILED' },
        { telebirr: 'CANCELLED', expected: 'CANCELLED' },
        { telebirr: 'PENDING', expected: 'PENDING' },
      ];

      testCases.forEach(({ telebirr, expected }) => {
        const result = (provider as any).mapTelebirrStatus(telebirr);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Ethiopian Market Optimizations', () => {
    it('should have extended timeout for Ethiopian connectivity', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 30000,
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

  describe('SMS Integration', () => {
    it('should send payment SMS notification', async () => {
      const input = {
        orderId: 'test-order-123',
        amountInt: 50000,
        currency: 'ETB',
        returnUrl: 'https://stanstore.et/success',
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await (provider as any).sendPaymentSMS(input, 'test-out-trade-no');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Sending payment SMS'),
      );

      consoleSpy.mockRestore();
    });

    it('should send confirmation SMS on successful payment', async () => {
      const payload = {
        appId: 'test-app-id',
        outTradeNo: 'test-order-123',
        totalAmount: '500.00',
        currency: 'ETB',
        tradeStatus: 'SUCCESS' as const,
        timestamp: '2025-01-15T10:30:00Z',
        signature: 'valid-signature',
        buyerId: 'buyer-123',
        tradeNo: 'trade-456',
        phoneNumber: '+251911000000',
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await (provider as any).sendPaymentConfirmationSMS(payload);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Sending confirmation SMS'),
      );

      consoleSpy.mockRestore();
    });
  });
});
