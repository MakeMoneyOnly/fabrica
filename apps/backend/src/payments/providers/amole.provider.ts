import * as crypto from 'crypto';

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

import { InitPaymentInput, PaymentProvider, PaymentInitializationResult, PaymentVerificationResult, WebhookResult } from '../types';

interface AmoleConfig {
  apiUrl: string;
  merchantId: string;
  apiKey: string;
  secretKey: string;
  webhookSecret: string;
}

interface AmolePaymentRequest {
  merchantId: string;
  amount: string;
  currency: string;
  orderId: string;
  description?: string;
  returnUrl?: string;
  notifyUrl?: string;
  customerPhone?: string;
  customerName?: string;
  timeout?: number;
}

interface AmolePaymentResponse {
  success: boolean;
  message: string;
  data?: {
    transactionId: string;
    paymentUrl: string;
    qrCode?: string;
    ussdCode?: string;
  };
}

interface AmoleWebhookPayload {
  merchantId: string;
  transactionId: string;
  orderId: string;
  amount: string;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED';
  timestamp: string;
  signature: string;
  customerPhone?: string;
  customerName?: string;
}

@Injectable()
export class AmoleProvider implements PaymentProvider {
  private readonly logger = new Logger(AmoleProvider.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly config: AmoleConfig;

  constructor() {
    this.config = {
      apiUrl: process.env.AMOLE_API_URL || 'https://api.amole.et',
      merchantId: process.env.AMOLE_MERCHANT_ID || '',
      apiKey: process.env.AMOLE_API_KEY || '',
      secretKey: process.env.AMOLE_SECRET_KEY || '',
      webhookSecret: process.env.AMOLE_WEBHOOK_SECRET || '',
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 45000, // Extended timeout for Ethiopian mobile network
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'StanStore-Amole-Ethiopia/1.0',
        'X-API-Key': this.config.apiKey,
      },
    });

    // Add request/response interceptors for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.debug(`Amole API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error(`Amole API Request Error: ${error.message}`);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug(`Amole API Response: ${response.status}`);
        return response;
      },
      (error) => {
        this.logger.error(`Amole API Response Error: ${error.response?.status} ${error.message}`);
        return Promise.reject(error);
      },
    );
  }

  async initializePayment(input: InitPaymentInput): Promise<PaymentInitializationResult> {
    try {
      this.logger.log(`Initializing Amole payment for order: ${input.orderId}`);

      const paymentRequest: AmolePaymentRequest = {
        merchantId: this.config.merchantId,
        amount: (input.amountInt / 100).toFixed(2), // Convert cents to USD/ETB
        currency: input.currency,
        orderId: input.orderId,
        description: `Stan Store - Order ${input.orderId}`,
        returnUrl: input.returnUrl,
        notifyUrl: `${process.env.BACKEND_URL || 'https://api.stanstore.et'}/api/payments/webhook/amole`,
        customerPhone: this.extractCustomerPhone(),
        customerName: this.extractCustomerName(),
        timeout: 1800, // 30 minutes
      };

      const response = await this.axiosInstance.post<AmolePaymentResponse>(
        '/v1/payments/initiate',
        paymentRequest,
        {
          headers: {
            'X-Signature': this.generateRequestSignature(paymentRequest),
          },
        },
      );

      const { data } = response;

      if (!data.success || !data.data?.paymentUrl) {
        this.logger.error(`Amole initialization failed: ${data.message || 'No payment URL received'}`);
        throw new BadRequestException(`Amole payment initialization failed: ${data.message}`);
      }

      this.logger.log(`Amole payment initialized: ${data.data.transactionId}`);

      return {
        provider: 'AMOLE',
        transactionId: data.data.transactionId,
        paymentUrl: data.data.paymentUrl,
        qrCode: data.data.qrCode,
        ussdCode: data.data.ussdCode,
        amount: input.amountInt,
        currency: input.currency,
        orderId: input.orderId,
        timeout: paymentRequest.timeout,
        initializedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error(`Amole initialization error for order ${input.orderId}:`, error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      // Check if error has axios-like properties
      const axiosError = error as any;
      if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
        throw new BadRequestException('Amole service temporarily unavailable due to network conditions');
      }

      throw new BadRequestException('Failed to initialize Amole payment');
    }
  }

  async handleWebhook(payload: Record<string, any>): Promise<WebhookResult> {
    try {
      this.logger.log(`Processing Amole webhook for transaction: ${payload.transactionId}`);

      const isValidSignature = this.verifyWebhookSignature(payload as AmoleWebhookPayload);
      if (!isValidSignature) {
        this.logger.error(`Invalid webhook signature for transaction: ${payload.transactionId}`);
        throw new BadRequestException('Invalid webhook signature');
      }

      if (!payload.transactionId || !payload.status) {
        this.logger.error('Invalid webhook payload: missing required fields');
        throw new BadRequestException('Invalid webhook payload');
      }

      const amount = parseFloat(payload.amount) * 100; // Convert to cents
      const paymentStatus = this.mapAmoleStatus(payload.status);

      this.logger.log(`Amole webhook processed: ${payload.transactionId} - ${paymentStatus}`);

      return {
        provider: 'AMOLE',
        transactionId: payload.transactionId,
        orderId: payload.orderId,
        amount: Math.round(amount),
        currency: payload.currency,
        status: paymentStatus,
        timestamp: payload.timestamp,
        customerPhone: payload.customerPhone,
        customerName: payload.customerName,
        verified: true,
      };
    } catch (error: unknown) {
      this.logger.error('Amole webhook processing error:', error);
      throw error;
    }
  }

  async verifyPayment(payload: Record<string, any>): Promise<PaymentVerificationResult> {
    try {
      const response = await this.axiosInstance.get('/v1/payments/status', {
        params: {
          merchantId: this.config.merchantId,
          transactionId: payload.transactionId,
        },
        headers: {
          'X-Signature': this.generateStatusRequestSignature(payload.transactionId),
        },
      });

      return {
        provider: 'AMOLE',
        transactionId: payload.transactionId,
        status: response.data.data?.status || 'UNKNOWN',
        verified: true,
      };
    } catch (error: unknown) {
      this.logger.error('Amole payment verification error:', error);
      const axiosError = error as any;
      return {
        provider: 'AMOLE',
        transactionId: payload.transactionId,
        status: 'UNKNOWN',
        verified: false,
        error: axiosError.message || 'Unknown verification error',
      };
    }
  }

  private generateRequestSignature(request: AmolePaymentRequest): string {
    const payload = JSON.stringify({
      merchantId: request.merchantId,
      amount: request.amount,
      currency: request.currency,
      orderId: request.orderId,
    });

    return crypto
      .createHmac('sha256', this.config.secretKey)
      .update(payload)
      .digest('hex');
  }

  private generateStatusRequestSignature(transactionId: string): string {
    const payload = `${this.config.merchantId}:${transactionId}`;
    return crypto
      .createHmac('sha256', this.config.secretKey)
      .update(payload)
      .digest('hex');
  }

  private verifyWebhookSignature(payload: AmoleWebhookPayload): boolean {
    try {
      const { signature, ...payloadWithoutSignature } = payload;
      const payloadString = JSON.stringify(payloadWithoutSignature);

      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payloadString)
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      this.logger.error('Webhook signature verification error:', error);
      return false;
    }
  }

  private mapAmoleStatus(amoleStatus: string): string {
    switch (amoleStatus.toUpperCase()) {
      case 'SUCCESS':
        return 'SUCCESS';
      case 'FAILED':
        return 'FAILED';
      case 'CANCELLED':
        return 'CANCELLED';
      case 'PENDING':
        return 'PENDING';
      default:
        return 'UNKNOWN';
    }
  }

  private extractCustomerPhone(): string {
    // In a real implementation, this would be extracted from the order/customer data
    return '+251911000000';
  }

  private extractCustomerName(): string {
    // In a real implementation, this would be extracted from the order/customer data
    return 'Customer Name';
  }
}
