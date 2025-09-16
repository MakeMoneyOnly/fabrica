import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

export interface SmsMessage {
  to: string;
  message: string;
  type?: 'otp' | 'notification' | 'marketing';
}

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: process.env.SMS_API_URL || 'https://api.ethiotelecom.et',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
      },
    });
  }

  /**
   * Send SMS to Ethiopian phone number
   * Supports format: +251XXXXXXXXX or 09XXXXXXXX
   */
  async sendSms(message: SmsMessage): Promise<SmsResult> {
    try {
      const formattedPhone = this.formatEthiopianPhone(message.to);
      if (!formattedPhone) {
        return { success: false, error: 'Invalid Ethiopian phone number' };
      }

      const payload = {
        to: formattedPhone,
        message: message.message,
        from: process.env.SMS_FROM || 'StanStore',
        type: message.type || 'notification',
      };

      this.logger.log(`Sending SMS to ${formattedPhone}: ${message.message.substring(0, 50)}...`);

      const response = await this.httpClient.post('/send', payload);

      return {
        success: true,
        messageId: response.data?.messageId,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`SMS sending failed: ${errorMessage}`, errorStack);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send OTP SMS for authentication
   */
  async sendOtp(phoneNumber: string, otp: string): Promise<SmsResult> {
    const message = `Stan Store: Your verification code is ${otp}. Valid for 10 minutes.`;
    return this.sendSms({
      to: phoneNumber,
      message,
      type: 'otp',
    });
  }

  /**
   * Send welcome SMS to new users
   */
  async sendWelcomeMessage(phoneNumber: string, userName: string): Promise<SmsResult> {
    const message = `እንኳን ደህና መጣህ ${userName}! በStan Store ተመዘገብክ። እንኳን ደህና መጣህ!\n\nWelcome ${userName} to Stan Store!`;
    return this.sendSms({
      to: phoneNumber,
      message,
      type: 'notification',
    });
  }

  /**
   * Send purchase confirmation SMS
   */
  async sendPurchaseConfirmation(phoneNumber: string, amount: number, productName: string): Promise<SmsResult> {
    const message = `Stan Store: Your purchase of ${productName} for ETB ${amount} is confirmed. Thank you!`;
    return this.sendSms({
      to: phoneNumber,
      message,
      type: 'notification',
    });
  }

  /**
   * Format Ethiopian phone numbers to international format
   */
  formatEthiopianPhone(phone: string): string | null {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Handle different Ethiopian phone number formats
    if (cleaned.startsWith('251')) {
      // Already in international format
      return `+${cleaned}`;
    } else if (cleaned.startsWith('09')) {
      // Local format: 09XXXXXXXX
      return `+251${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      // 9 digits: XXXXXXXXX
      return `+251${cleaned}`;
    }

    return null; // Invalid format
  }

  /**
   * Generate OTP code
   */
  generateOtp(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  /**
   * Validate Ethiopian phone number
   */
  validateEthiopianPhone(phone: string): boolean {
    return this.formatEthiopianPhone(phone) !== null;
  }
}
