import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '../auth/public.decorator';

import { SmsService } from './sms.service';

@Controller('api/sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Public()
  @Post('send-otp')
  async sendOtp(@Body() body: { phoneNumber: string }) {
    const otp = this.smsService.generateOtp();
    const result = await this.smsService.sendOtp(body.phoneNumber, otp);
    return {
      ...result,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Only return OTP in development
    };
  }

  @Public()
  @Post('test')
  async testSms(@Body() body: { phoneNumber: string; message?: string }) {
    const result = await this.smsService.sendSms({
      to: body.phoneNumber,
      message: body.message || 'Test SMS from Stan Store',
      type: 'notification',
    });
    return result;
  }

  @Post('welcome')
  async sendWelcome(@Body() body: { phoneNumber: string; userName: string }) {
    return this.smsService.sendWelcomeMessage(body.phoneNumber, body.userName);
  }

  @Post('purchase-confirmation')
  async sendPurchaseConfirmation(@Body() body: { phoneNumber: string; amount: number; productName: string }) {
    return this.smsService.sendPurchaseConfirmation(body.phoneNumber, body.amount, body.productName);
  }
}
