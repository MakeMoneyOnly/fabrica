import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { AmoleProvider } from './amole.provider';

describe('AmoleProvider', () => {
  let provider: AmoleProvider;

  beforeEach(async () => {
    process.env.AMOLE_API_URL = 'https://api.amole.et';
    process.env.AMOLE_MERCHANT_ID = 'test-merchant';
    process.env.AMOLE_API_KEY = 'test-api-key';
    process.env.AMOLE_SECRET_KEY = 'test-secret-key';
    process.env.AMOLE_WEBHOOK_SECRET = 'test-webhook-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [AmoleProvider],
    }).compile();

    provider = module.get<AmoleProvider>(AmoleProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('initializePayment', () => {
    it('should initialize payment successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Payment initiated',
          data: {
            transactionId: 'TXN-123',
            paymentUrl: 'https://payment.amole.et/pay/TXN-123',
            qrCode: 'qr-code-data',
            ussdCode: '*123#',
          },
        },
      };

      jest.spyOn(provider['axiosInstance'], 'post').mockResolvedValue(mockResponse);

      const input = {
        orderId: 'ORDER-123',
        amountInt: 10000, // 100 ETB in cents
        currency: 'ETB',
        returnUrl: 'https://stanstore.et/return',
      };

      const result = await provider.initializePayment(input);

      expect(result).toEqual({
        provider: 'AMOLE',
        transactionId: 'TXN-123',
        paymentUrl: 'https://payment.amole.et/pay/TXN-123',
        qrCode: 'qr-code-data',
        ussdCode: '*123#',
        amount: 10000,
        currency: 'ETB',
        orderId: 'ORDER-123',
        timeout: 1800,
        initializedAt: expect.any(String),
      });
    });

    it('should handle payment initialization failure', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Invalid merchant',
        },
      };

      jest.spyOn(provider['axiosInstance'], 'post').mockResolvedValue(mockResponse);

      const input = {
        orderId: 'ORDER-123',
        amountInt: 10000,
        currency: 'ETB',
      };

      await expect(provider.initializePayment(input)).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleWebhook', () => {
    it('should handle webhook successfully', async () => {
      const payload = {
        merchantId: 'test-merchant',
        transactionId: 'TXN-123',
        orderId: 'ORDER-123',
        amount: '100.00',
        currency: 'ETB',
        status: 'SUCCESS' as const,
        timestamp: '2023-12-01T10:00:00Z',
        signature: 'valid-signature',
        customerPhone: '+251911000000',
        customerName: 'Test Customer',
      };

      jest.spyOn(provider as any, 'verifyWebhookSignature').mockReturnValue(true);

      const result = await provider.handleWebhook(payload);

      expect(result).toEqual({
        provider: 'AMOLE',
        transactionId: 'TXN-123',
        orderId: 'ORDER-123',
        amount: 10000,
        currency: 'ETB',
        status: 'SUCCESS',
        timestamp: '2023-12-01T10:00:00Z',
        customerPhone: '+251911000000',
        customerName: 'Test Customer',
        verified: true,
      });
    });

    it('should reject invalid webhook signature', async () => {
      const payload = {
        merchantId: 'test-merchant',
        transactionId: 'TXN-123',
        orderId: 'ORDER-123',
        amount: '100.00',
        currency: 'ETB',
        status: 'SUCCESS' as const,
        timestamp: '2023-12-01T10:00:00Z',
        signature: 'invalid-signature',
      };

      jest.spyOn(provider as any, 'verifyWebhookSignature').mockReturnValue(false);

      await expect(provider.handleWebhook(payload)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            status: 'SUCCESS',
          },
        },
      };

      jest.spyOn(provider['axiosInstance'], 'get').mockResolvedValue(mockResponse);

      const payload = { transactionId: 'TXN-123' };
      const result = await provider.verifyPayment(payload);

      expect(result).toEqual({
        provider: 'AMOLE',
        transactionId: 'TXN-123',
        status: 'SUCCESS',
        verified: true,
      });
    });

    it('should handle verification error', async () => {
      jest.spyOn(provider['axiosInstance'], 'get').mockRejectedValue(new Error('Network error'));

      const payload = { transactionId: 'TXN-123' };
      const result = await provider.verifyPayment(payload);

      expect(result).toEqual({
        provider: 'AMOLE',
        transactionId: 'TXN-123',
        status: 'UNKNOWN',
        verified: false,
        error: 'Network error',
      });
    });
  });
});
