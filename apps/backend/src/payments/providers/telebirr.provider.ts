import * as crypto from 'crypto';

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

import { InitPaymentInput, PaymentProvider } from '../types';

interface TelebirrConfig {
  apiUrl: string;
  appId: string;
  appKey: string;
  publicKey: string;
  webhookSecret: string;
}

interface TelebirrPaymentRequest {
  appId: string;
  appKey: string;
  amount: string;
  currency: string;
  orderId: string;
  returnUrl?: string;
  notifyUrl?: string;
  subject?: string;
  timeoutExpress?: string;
}

interface TelebirrPaymentResponse {
  code: string;
  message: string;
  data?: {
    qrCode?: string;
    paymentUrl?: string;
    outTradeNo?: string;
    prepayId?: string;
  };
}

interface TelebirrWebhookPayload {
  appId: string;
  outTradeNo: string;
  totalAmount: string;
  currency: string;
  tradeStatus: 'SUCCESS' | 'FAILED' | 'CANCELLED';
  timestamp: string;
  signature: string;
  buyerId?: string;
  tradeNo?: string;
  phoneNumber?: string;
}



@Injectable()
export class TelebirrProvider implements PaymentProvider {
  private readonly logger = new Logger(TelebirrProvider.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly config: TelebirrConfig;

  constructor() {
    this.config = {
      apiUrl: process.env.TELEBIRR_API_URL || 'https://api.telebirr.et',
      appId: process.env.TELEBIRR_APP_ID || '',
      appKey: process.env.TELEBIRR_APP_KEY || '',
      publicKey: process.env.TELEBIRR_PUBLIC_KEY || '',
      webhookSecret: process.env.TELEBIRR_WEBHOOK_SECRET || '',
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
        this.logger.debug(`TeleBirr API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error(`TeleBirr API Request Error: ${error.message}`);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug(`TeleBirr API Response: ${response.status}`);
        return response;
      },
      (error) => {
        this.logger.error(`TeleBirr API Response Error: ${error.response?.status} ${error.message}`);
        return Promise.reject(error);
      },
    );
  }

  async initializePayment(input: InitPaymentInput): Promise<any> {
    try {
      this.logger.log(`Initializing TeleBirr payment for order: ${input.orderId}`);

      const paymentRequest: TelebirrPaymentRequest = {
        appId: this.config.appId,
        appKey: this.config.appKey,
        amount: (input.amountInt / 100).toFixed(2), // Convert cents to birr
        currency: input.currency,
        orderId: input.orderId,
        returnUrl: input.returnUrl,
        notifyUrl: `${process.env.BACKEND_URL || 'https://api.stanstore.et'}/api/payments/webhook/telebirr`,
        subject: `Stan Store - Order ${input.orderId}`,
        timeoutExpress: '30m', // 30 minutes for Ethiopian mobile payments
      };

      const response = await this.axiosInstance.post<TelebirrPaymentResponse>(
        '/v1/payment/prepay',
        paymentRequest,
      );

      const { data } = response;

      if (data.code !== 'SUCCESS' || !data.data?.paymentUrl) {
        this.logger.error(`TeleBirr initialization failed: ${data.message || 'No payment URL received'}`);
        throw new BadRequestException(`TeleBirr payment initialization failed: ${data.message}`);
      }

      // Send SMS notification to user about payment
      if (data.data.outTradeNo) {
        await this.sendPaymentSMS(input, data.data.outTradeNo);
      }

      this.logger.log(`TeleBirr payment initialized: ${data.data.outTradeNo}`);

      return {
        provider: 'TELEBIRR',
        prepayId: data.data.prepayId,
        paymentUrl: data.data.paymentUrl,
        qrCode: data.data.qrCode,
        outTradeNo: data.data.outTradeNo,
        amount: input.amountInt,
        currency: input.currency,
        orderId: input.orderId,
        timeoutExpress: paymentRequest.timeoutExpress,
        initializedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`TeleBirr initialization error for order ${input.orderId}:`, error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle network timeouts specifically for Ethiopian connectivity
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new BadRequestException('Payment service temporarily unavailable due to network conditions');
      }

      throw new BadRequestException('Failed to initialize TeleBirr payment');
    }
  }

  async handleWebhook(payload: TelebirrWebhookPayload): Promise<any> {
    try {
      this.logger.log(`Processing TeleBirr webhook for trade: ${payload.outTradeNo}`);

      // Verify webhook signature for security
      const isValidSignature = this.verifyWebhookSignature(payload);
      if (!isValidSignature) {
        this.logger.error(`Invalid webhook signature for trade: ${payload.outTradeNo}`);
        throw new BadRequestException('Invalid webhook signature');
      }

      // Validate required fields
      if (!payload.outTradeNo || !payload.tradeStatus) {
        this.logger.error(`Invalid webhook payload: missing required fields`);
        throw new BadRequestException('Invalid webhook payload');
      }

      const amount = parseFloat(payload.totalAmount) * 100; // Convert to cents
      const paymentStatus = this.mapTelebirrStatus(payload.tradeStatus);

      // Send SMS confirmation to user
      if (paymentStatus === 'SUCCESS' && payload.phoneNumber) {
        await this.sendPaymentConfirmationSMS(payload);
      }

      this.logger.log(`TeleBirr webhook processed: ${payload.outTradeNo} - ${paymentStatus}`);

      return {
        provider: 'TELEBIRR',
        outTradeNo: payload.outTradeNo,
        tradeNo: payload.tradeNo,
        buyerId: payload.buyerId,
        phoneNumber: payload.phoneNumber,
        amount: Math.round(amount),
        currency: payload.currency,
        status: paymentStatus,
        timestamp: payload.timestamp,
        verified: true,
      };
    } catch (error: any) {
      this.logger.error(`TeleBirr webhook processing error:`, error);
      throw error;
    }
  }

  async verifyPayment(payload: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/v1/payment/query', {
        appId: this.config.appId,
        appKey: this.config.appKey,
        outTradeNo: payload.outTradeNo,
      });

      return {
        provider: 'TELEBIRR',
        outTradeNo: payload.outTradeNo,
        status: response.data.data?.tradeStatus || 'UNKNOWN',
        verified: true,
      };
    } catch (error: any) {
      this.logger.error(`TeleBirr payment verification error:`, error);
      return {
        provider: 'TELEBIRR',
        outTradeNo: payload.outTradeNo,
        status: 'UNKNOWN',
        verified: false,
        error: error.message,
      };
    }
  }

  private verifyWebhookSignature(payload: TelebirrWebhookPayload): boolean {
    try {
      const { signature, ...payloadWithoutSignature } = payload;

      // Create signature string based on TeleBirr documentation
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

  private mapTelebirrStatus(telebirrStatus: string): string {
    switch (telebirrStatus.toUpperCase()) {
      case 'SUCCESS':
        return 'SUCCESS';
      case 'FAILED':
        return 'FAILED';
      case 'CANCELLED':
        return 'CANCELLED';
      default:
        return 'PENDING';
    }
  }

  private async sendPaymentSMS(input: InitPaymentInput, _outTradeNo: string): Promise<void> {
    try {
      // Mark outTradeNo parameter as used
      _outTradeNo;
      this.logger.log(`Sending payment SMS to ${this.extractPhoneNumber(input)} for order ${input.orderId}: Click to pay ${input.currency} ${(input.amountInt / 100).toFixed(2)}`);

      // Note: SMS integration would be implemented here with Ethiopian telecom providers
      // For now, we log the SMS that would be sent
    } catch (error: any) {
      this.logger.error('Failed to send payment SMS:', error);
      // Don't throw error for SMS failure as payment can still proceed
    }
  }

  private async sendPaymentConfirmationSMS(payload: TelebirrWebhookPayload): Promise<void> {
    try {
      if (!payload.phoneNumber) return;

      this.logger.log(`Sending confirmation SMS to ${payload.phoneNumber} for trade ${payload.outTradeNo}: Payment confirmed! Amount: ${payload.currency} ${payload.totalAmount}`);

      // Note: SMS integration would be implemented here with Ethiopian telecom providers
    } catch (error: any) {
      this.logger.error('Failed to send confirmation SMS:', error);
      // Don't throw error for SMS failure
    }
  }

  private extractPhoneNumber(_input: InitPaymentInput): string {
    // Extract phone number from input - this would be part of the payment initiation
    // For now, return a placeholder (marked as used with underscore to satisfy linting)
    _input; // Mark as used
    return '+251911000000'; // Ethiopian phone number format
  }

  // Additional Ethiopian market optimizations
  private getEthiopianOptimizedConfig() {
    return {
      timeout: 45000, // Extended timeout for Ethiopian network conditions
      retryAttempts: 3,
      retryDelay: 1000,
      smsEnabled: true, // SMS notifications for Ethiopian users
    };
  }
}
