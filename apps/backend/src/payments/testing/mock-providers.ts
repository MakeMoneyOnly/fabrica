import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { InitPaymentInput, PaymentProvider } from '../types';

@Injectable()
export class MockWeBirrProvider implements PaymentProvider {
  async initializePayment(input: InitPaymentInput): Promise<any> {
    return {
      provider: 'WEBIRR',
      billId: randomUUID(),
      paymentUrl: `https://mock-payment.webirr.et/pay/${randomUUID()}`,
      amount: input.amountInt,
      currency: input.currency,
      orderId: input.orderId,
      initializedAt: new Date().toISOString(),
    };
  }

  async handleWebhook(payload: any): Promise<any> {
    return {
      provider: 'WEBIRR',
      orderId: payload.orderId,
      billId: payload.billId,
      amount: payload.amount,
      currency: payload.currency,
      status: payload.status || 'SUCCESS',
      transactionId: randomUUID(),
      verified: true,
    };
  }

  async verifyPayment(payload: any): Promise<any> {
    return {
      provider: 'WEBIRR',
      billId: payload.billId,
      status: 'SUCCESS',
      verified: true,
    };
  }
}

@Injectable()
export class MockTelebirrProvider implements PaymentProvider {
  async initializePayment(input: InitPaymentInput): Promise<any> {
    return {
      provider: 'TELEBIRR',
      prepayId: randomUUID(),
      paymentUrl: `https://mock-payment.telebirr.et/pay/${randomUUID()}`,
      qrCode: `qr-code-${randomUUID()}`,
      outTradeNo: randomUUID(),
      amount: input.amountInt,
      currency: input.currency,
      orderId: input.orderId,
      timeoutExpress: '30m',
      initializedAt: new Date().toISOString(),
    };
  }

  async handleWebhook(payload: any): Promise<any> {
    return {
      provider: 'TELEBIRR',
      outTradeNo: payload.outTradeNo,
      tradeNo: randomUUID(),
      buyerId: randomUUID(),
      phoneNumber: payload.phoneNumber,
      amount: payload.amount,
      currency: payload.currency,
      status: payload.status || 'SUCCESS',
      timestamp: new Date().toISOString(),
      verified: true,
    };
  }

  async verifyPayment(payload: any): Promise<any> {
    return {
      provider: 'TELEBIRR',
      outTradeNo: payload.outTradeNo,
      status: 'SUCCESS',
      verified: true,
    };
  }
}

@Injectable()
export class MockCbeBirrProvider implements PaymentProvider {
  async initializePayment(input: InitPaymentInput): Promise<any> {
    return {
      provider: 'CBE_BIRR',
      transactionId: randomUUID(),
      paymentUrl: `https://mock-payment.cbe.et/pay/${randomUUID()}`,
      qrCode: `qr-code-${randomUUID()}`,
      reference: randomUUID(),
      amount: input.amountInt,
      currency: input.currency,
      orderId: input.orderId,
      timeout: 1800,
      initializedAt: new Date().toISOString(),
    };
  }

  async handleWebhook(payload: any): Promise<any> {
    return {
      provider: 'CBE_BIRR',
      transactionId: payload.transactionId,
      orderId: payload.orderId,
      reference: payload.transactionId,
      amount: payload.amount,
      currency: payload.currency,
      status: payload.status || 'SUCCESS',
      timestamp: new Date().toISOString(),
      customerInfo: payload.customerInfo,
      settlementInfo: payload.settlementInfo,
      verified: true,
    };
  }

  async verifyPayment(payload: any): Promise<any> {
    return {
      provider: 'CBE_BIRR',
      transactionId: payload.transactionId,
      status: 'SUCCESS',
      settlementInfo: null,
      verified: true,
    };
  }
}

@Injectable()
export class MockAmoleProvider implements PaymentProvider {
  async initializePayment(input: InitPaymentInput): Promise<any> {
    return {
      provider: 'AMOLE',
      transactionId: randomUUID(),
      paymentUrl: `https://mock-payment.amole.et/pay/${randomUUID()}`,
      qrCode: `qr-code-${randomUUID()}`,
      ussdCode: `*123#${Math.floor(Math.random() * 900000 + 100000)}`,
      amount: input.amountInt,
      currency: input.currency,
      orderId: input.orderId,
      timeout: 1800,
      initializedAt: new Date().toISOString(),
    };
  }

  async handleWebhook(payload: any): Promise<any> {
    return {
      provider: 'AMOLE',
      transactionId: payload.transactionId,
      orderId: payload.orderId,
      amount: payload.amount,
      currency: payload.currency,
      status: payload.status || 'SUCCESS',
      timestamp: new Date().toISOString(),
      customerPhone: payload.customerPhone,
      customerName: payload.customerName,
      verified: true,
    };
  }

  async verifyPayment(payload: any): Promise<any> {
    return {
      provider: 'AMOLE',
      transactionId: payload.transactionId,
      status: 'SUCCESS',
      verified: true,
    };
  }
}

// Mock failure providers for testing error scenarios
@Injectable()
export class MockFailureProvider implements PaymentProvider {
  async initializePayment(_input: InitPaymentInput): Promise<any> {
    // Validate input structure for error testing
    if (!_input.orderId) throw new Error('Invalid input: missing orderId');
    throw new Error('Mock payment provider failure');
  }

  async handleWebhook(): Promise<any> {
    throw new Error('Mock webhook provider failure');
  }

  async verifyPayment(): Promise<any> {
    throw new Error('Mock verification provider failure');
  }
}

// Mock timeout provider for testing timeout scenarios
@Injectable()
export class MockTimeoutProvider implements PaymentProvider {
  async initializePayment(input: InitPaymentInput): Promise<any> {
    // Simulate timeout by delaying response
    await new Promise(resolve => setTimeout(resolve, 35000));
    return {
      provider: 'TIMEOUT',
      transactionId: randomUUID(),
      paymentUrl: `https://mock-payment.timeout.et/pay/${randomUUID()}`,
      amount: input.amountInt,
      currency: input.currency,
      orderId: input.orderId,
      initializedAt: new Date().toISOString(),
    };
  }

  async handleWebhook(payload: any): Promise<any> {
    return {
      provider: 'TIMEOUT',
      transactionId: payload.transactionId,
      orderId: payload.orderId,
      amount: payload.amount,
      currency: payload.currency,
      status: payload.status || 'SUCCESS',
      timestamp: new Date().toISOString(),
      verified: true,
    };
  }

  async verifyPayment(payload: any): Promise<any> {
    return {
      provider: 'TIMEOUT',
      transactionId: payload.transactionId,
      status: 'SUCCESS',
      verified: true,
    };
  }
}
