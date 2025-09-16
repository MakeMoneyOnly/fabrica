import * as crypto from 'crypto';

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

import { InitPaymentInput, PaymentProvider } from '../types';

interface WeBirrConfig {
  apiUrl: string;
  merchantId: string;
  apiKey: string;
  webhookSecret: string;
}

interface WeBirrPaymentRequest {
  apiKey: string;
  merchantId: string;
  amount: string;
  currency: string;
  orderId: string;
  callbackUrl?: string;
  returnUrl?: string;
  description?: string;
}

interface WeBirrPaymentResponse {
  apiKey?: string;
  authenticationKey?: string;
  billId?: string;
  paymentUrl?: string;
  error?: string;
  code?: string;
}

interface WeBirrWebhookPayload {
  billId: string;
  orderId: string;
  amount: string;
  currency: string;
  status: 'PAID' | 'FAILED' | 'CANCELLED';
  timestamp: string;
  signature: string;
  paymentMethod?: string;
  transactionId?: string;
}

@Injectable()
export class WeBirrProvider implements PaymentProvider {
  private readonly logger = new Logger(WeBirrProvider.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly config: WeBirrConfig;

  constructor() {
    this.config = {
      apiUrl: process.env.WEBIRR_API_URL || 'https://api.webirr.com',
      merchantId: process.env.WEBIRR_MERCHANT_ID || '',
      apiKey: process.env.WEBIRR_API_KEY || '',
      webhookSecret: process.env.WEBIRR_WEBHOOK_SECRET || '',
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 30000, // 30 seconds for Ethiopian network conditions
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'StanStore-Ethiopia/1.0',
      },
    });

    // Add request/response interceptors for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.debug(`WeBirr API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error(`WeBirr API Request Error: ${error.message}`);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug(`WeBirr API Response: ${response.status}`);
        return response;
      },
      (error) => {
        this.logger.error(`WeBirr API Response Error: ${error.response?.status} ${error.message}`);
        return Promise.reject(error);
      },
    );
  }

  async initializePayment(input: InitPaymentInput): Promise<any> {
    try {
      this.logger.log(`Initializing WeBirr payment for order: ${input.orderId}`);

      const paymentRequest: WeBirrPaymentRequest = {
        apiKey: this.config.apiKey,
        merchantId: this.config.merchantId,
        amount: (input.amountInt / 100).toFixed(2), // Convert cents to birr
        currency: input.currency,
        orderId: input.orderId,
        returnUrl: input.returnUrl,
        callbackUrl: `${process.env.BACKEND_URL}/api/payments/webhook/webirr`,
        description: `Stan Store - Order ${input.orderId}`,
      };

      const response = await this.axiosInstance.post<WeBirrPaymentResponse>(
        '/v1/merchant/payment',
        paymentRequest,
      );

      const { data } = response;

      if (data.error || !data.paymentUrl) {
        this.logger.error(`WeBirr initialization failed: ${data.error || 'No payment URL received'}`);
        throw new BadRequestException(`WeBirr payment initialization failed: ${data.error}`);
      }

      this.logger.log(`WeBirr payment initialized: ${data.billId}`);

      return {
        provider: 'WEBIRR',
        billId: data.billId,
        paymentUrl: data.paymentUrl,
        amount: input.amountInt,
        currency: input.currency,
        orderId: input.orderId,
        initializedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`WeBirr initialization error for order ${input.orderId}:`, error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle network timeouts specifically for Ethiopian connectivity
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new BadRequestException('Payment service temporarily unavailable due to network conditions');
      }

      throw new BadRequestException('Failed to initialize WeBirr payment');
    }
  }

  async handleWebhook(payload: WeBirrWebhookPayload): Promise<any> {
    try {
      this.logger.log(`Processing WeBirr webhook for bill: ${payload.billId}`);

      // Verify webhook signature for security
      const isValidSignature = this.verifyWebhookSignature(payload);
      if (!isValidSignature) {
        this.logger.error(`Invalid webhook signature for bill: ${payload.billId}`);
        throw new BadRequestException('Invalid webhook signature');
      }

      // Validate required fields
      if (!payload.orderId || !payload.status) {
        this.logger.error(`Invalid webhook payload: missing required fields`);
        throw new BadRequestException('Invalid webhook payload');
      }

      const amount = parseFloat(payload.amount) * 100; // Convert to cents
      const paymentStatus = this.mapWeBirrStatus(payload.status);

      this.logger.log(`WeBirr webhook processed: ${payload.orderId} - ${paymentStatus}`);

      return {
        provider: 'WEBIRR',
        orderId: payload.orderId,
        billId: payload.billId,
        amount: Math.round(amount),
        currency: payload.currency,
        status: paymentStatus,
        transactionId: payload.transactionId,
        paymentMethod: payload.paymentMethod,
        timestamp: payload.timestamp,
        verified: true,
      };
    } catch (error) {
      this.logger.error(`WeBirr webhook processing error:`, error);
      throw error;
    }
  }

  async verifyPayment(payload: any): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/v1/merchant/payment/${payload.billId}`, {
        params: {
          apiKey: this.config.apiKey,
          merchantId: this.config.merchantId,
        },
      });

      return {
        provider: 'WEBIRR',
        billId: payload.billId,
        status: response.data.status,
        verified: true,
      };
    } catch (error: any) {
      this.logger.error(`WeBirr payment verification error:`, error);
      return {
        provider: 'WEBIRR',
        billId: payload.billId,
        status: 'UNKNOWN',
        verified: false,
        error: error.message,
      };
    }
  }

  private verifyWebhookSignature(payload: WeBirrWebhookPayload): boolean {
    try {
      const { signature, ...payloadWithoutSignature } = payload;

      // Create signature string based on WeBirr documentation
      const signatureString = Object.keys(payloadWithoutSignature)
        .sort()
        .map(key => `${key}=${payloadWithoutSignature[key as keyof typeof payloadWithoutSignature]}`)
        .join('&');

      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(signatureString)
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      this.logger.error('Webhook signature verification error:', error);
      return false;
    }
  }

  private mapWeBirrStatus(webirrStatus: string): string {
    switch (webirrStatus.toUpperCase()) {
      case 'PAID':
        return 'SUCCESS';
      case 'FAILED':
        return 'FAILED';
      case 'CANCELLED':
        return 'CANCELLED';
      default:
        return 'PENDING';
    }
  }

  // Additional Ethiopian market optimizations
  private getEthiopianOptimizedConfig() {
    return {
      timeout: 45000, // Extended timeout for Ethiopian network conditions
      retryAttempts: 3,
      retryDelay: 1000,
    };
  }
}
