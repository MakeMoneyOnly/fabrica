import * as crypto from 'crypto';
import * as fs from 'fs';
import * as https from 'https';

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

import { InitPaymentInput, PaymentProvider } from '../types';

interface CbeBirrConfig {
  apiUrl: string;
  merchantId: string;
  apiKey: string;
  webhookSecret: string;
  certificatePath?: string;
}

interface CbeBirrPaymentRequest {
  merchantId: string;
  amount: string;
  currency: string;
  orderId: string;
  description?: string;
  returnUrl?: string;
  notifyUrl?: string;
  timeout?: number;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface CbeBirrPaymentResponse {
  success: boolean;
  message: string;
  data?: {
    transactionId: string;
    paymentUrl: string;
    qrCode?: string;
    reference: string;
  };
}

interface CbeBirrWebhookPayload {
  merchantId: string;
  transactionId: string;
  orderId: string;
  amount: string;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED';
  timestamp: string;
  signature: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  settlementInfo?: {
    settlementDate?: string;
    bankReference?: string;
    fees?: string;
  };
}

@Injectable()
export class ChapaProvider implements PaymentProvider {
  private readonly logger = new Logger(ChapaProvider.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly config: CbeBirrConfig;

  constructor() {
    this.config = {
      apiUrl: process.env.CBE_BIRR_API_URL || 'https://api.cbe.et/birr',
      merchantId: process.env.CBE_BIRR_MERCHANT_ID || '',
      apiKey: process.env.CBE_BIRR_API_KEY || '',
      webhookSecret: process.env.CBE_BIRR_WEBHOOK_SECRET || '',
      certificatePath: process.env.CBE_BIRR_CERTIFICATE_PATH,
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 30000, // 30 seconds for Ethiopian banking network
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'StanStore-CBE-Ethiopia/1.0',
        'X-Merchant-ID': this.config.merchantId,
      },
      httpsAgent: this.config.certificatePath ? this.createHttpsAgent() : undefined,
    });

    // Add request/response interceptors for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.debug(`CBE Birr API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error(`CBE Birr API Request Error: ${error.message}`);
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug(`CBE Birr API Response: ${response.status}`);
        return response;
      },
      (error) => {
        this.logger.error(`CBE Birr API Response Error: ${error.response?.status} ${error.message}`);
        return Promise.reject(error);
      },
    );
  }

  async initializePayment(input: InitPaymentInput): Promise<any> {
    try {
      this.logger.log(`Initializing CBE Birr payment for order: ${input.orderId}`);

      const paymentRequest: CbeBirrPaymentRequest = {
        merchantId: this.config.merchantId,
        amount: (input.amountInt / 100).toFixed(2), // Convert cents to birr
        currency: input.currency,
        orderId: input.orderId,
        description: `Stan Store - Order ${input.orderId}`,
        returnUrl: input.returnUrl,
        notifyUrl: `${process.env.BACKEND_URL || 'https://api.stanstore.et'}/api/payments/webhook/cbe-birr`,
        timeout: 1800, // 30 minutes for banking transactions
        customerInfo: {
          name: this.extractCustomerName(),
          phone: this.extractCustomerPhone(),
        },
      };

      const response = await this.axiosInstance.post<CbeBirrPaymentResponse>(
        '/v2/payments/initiate',
        paymentRequest,
        {
          headers: {
            'X-API-Key': this.config.apiKey,
            'X-Signature': this.generateRequestSignature(paymentRequest),
          },
        },
      );

      const { data } = response;

      if (!data.success || !data.data?.paymentUrl) {
        this.logger.error(`CBE Birr initialization failed: ${data.message || 'No payment URL received'}`);
        throw new BadRequestException(`CBE Birr payment initialization failed: ${data.message}`);
      }

      this.logger.log(`CBE Birr payment initialized: ${data.data.transactionId}`);

      return {
        provider: 'CBE_BIRR',
        transactionId: data.data.transactionId,
        paymentUrl: data.data.paymentUrl,
        qrCode: data.data.qrCode,
        reference: data.data.reference,
        amount: input.amountInt,
        currency: input.currency,
        orderId: input.orderId,
        timeout: paymentRequest.timeout,
        initializedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`CBE Birr initialization error for order ${input.orderId}:`, error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle network timeouts specifically for Ethiopian banking
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new BadRequestException('Banking service temporarily unavailable due to network conditions');
      }

      throw new BadRequestException('Failed to initialize CBE Birr payment');
    }
  }

  async handleWebhook(payload: CbeBirrWebhookPayload): Promise<any> {
    try {
      this.logger.log(`Processing CBE Birr webhook for transaction: ${payload.transactionId}`);

      // Verify webhook signature for security
      const isValidSignature = this.verifyWebhookSignature(payload);
      if (!isValidSignature) {
        this.logger.error(`Invalid webhook signature for transaction: ${payload.transactionId}`);
        throw new BadRequestException('Invalid webhook signature');
      }

      // Validate required fields
      if (!payload.transactionId || !payload.status) {
        this.logger.error(`Invalid webhook payload: missing required fields`);
        throw new BadRequestException('Invalid webhook payload');
      }

      const amount = parseFloat(payload.amount) * 100; // Convert to cents
      const paymentStatus = this.mapCbeBirrStatus(payload.status);

      this.logger.log(`CBE Birr webhook processed: ${payload.transactionId} - ${paymentStatus}`);

      return {
        provider: 'CBE_BIRR',
        transactionId: payload.transactionId,
        orderId: payload.orderId,
        reference: payload.transactionId,
        amount: Math.round(amount),
        currency: payload.currency,
        status: paymentStatus,
        timestamp: payload.timestamp,
        customerInfo: payload.customerInfo,
        settlementInfo: payload.settlementInfo,
        verified: true,
      };
    } catch (error: any) {
      this.logger.error(`CBE Birr webhook processing error:`, error);
      throw error;
    }
  }

  async getSettlementInfo(transactionId: string): Promise<any> {
    try {
      this.logger.log(`Getting settlement info for transaction: ${transactionId}`);

      const response = await this.axiosInstance.get('/v2/settlements/transaction', {
        params: {
          merchantId: this.config.merchantId,
          transactionId: transactionId,
        },
        headers: {
          'X-API-Key': this.config.apiKey,
        },
      });

      const settlement = response.data.data;

      return {
        provider: 'CBE_BIRR',
        transactionId,
        settlementDate: settlement.settlementDate,
        bankReference: settlement.bankReference,
        fees: settlement.fees,
        netAmount: settlement.netAmount,
        availableForSettlement: settlement.status === 'SETTLED',
      };
    } catch (error: any) {
      this.logger.error(`CBE Birr settlement info error:`, error);
      return {
        provider: 'CBE_BIRR',
        transactionId,
        settlementDate: null,
        bankReference: null,
        fees: null,
        netAmount: 0,
        availableForSettlement: false,
        error: error.message,
      };
    }
  }

  async verifyPayment(payload: any): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/v2/payments/status', {
        params: {
          merchantId: this.config.merchantId,
          transactionId: payload.transactionId,
        },
        headers: {
          'X-API-Key': this.config.apiKey,
        },
      });

      return {
        provider: 'CBE_BIRR',
        transactionId: payload.transactionId,
        status: response.data.data?.status || 'UNKNOWN',
        settlementInfo: response.data.data?.settlementInfo,
        verified: true,
      };
    } catch (error: any) {
      this.logger.error(`CBE Birr payment verification error:`, error);
      return {
        provider: 'CBE_BIRR',
        transactionId: payload.transactionId,
        status: 'UNKNOWN',
        verified: false,
        error: error.message,
      };
    }
  }

  private generateRequestSignature(request: CbeBirrPaymentRequest): string {
    const payload = JSON.stringify(request);
    return crypto
      .createHmac('sha256', this.config.apiKey)
      .update(payload)
      .digest('hex');
  }

  private verifyWebhookSignature(payload: CbeBirrWebhookPayload): boolean {
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

  private mapCbeBirrStatus(cbeStatus: string): string {
    switch (cbeStatus.toUpperCase()) {
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

  private extractCustomerName(): string {
    // In a real implementation, this would be extracted from the order/customer data
    return 'Customer Name';
  }

  private extractCustomerPhone(): string {
    // In a real implementation, this would be extracted from the order/customer data
    return '+251911000000';
  }

  private createHttpsAgent() {
    // For CBE Birr banking integration, client certificates may be required
    if (this.config.certificatePath && fs.existsSync(this.config.certificatePath)) {
      return new https.Agent({
        pfx: fs.readFileSync(this.config.certificatePath),
        passphrase: process.env.CBE_BIRR_CERTIFICATE_PASSPHRASE,
      });
    }
    return undefined;
  }
}
