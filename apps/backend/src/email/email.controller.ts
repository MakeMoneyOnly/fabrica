import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '../auth/public.decorator';

import { EmailService } from './email.service';

@Controller('api/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post('test')
  async testEmail(@Body() body: { email: string; message?: string }) {
    return this.emailService.sendEmail({
      to: body.email,
      subject: 'Test Email from Stan Store',
      html: body.message || '<h1>Hello!</h1><p>This is a test email from Stan Store.</p>',
    });
  }

  @Post('welcome')
  async sendWelcome(@Body() body: { email: string; userName: string; locale?: 'en' | 'am' }) {
    return this.emailService.sendWelcomeEmail(body.email, body.userName, body.locale);
  }

  @Post('purchase-confirmation')
  async sendPurchaseConfirmation(@Body() body: {
    email: string;
    userName: string;
    productName: string;
    amount: number;
    transactionId: string;
    locale?: 'en' | 'am';
  }) {
    return this.emailService.sendPurchaseConfirmationEmail(
      body.email,
      body.userName,
      body.productName,
      body.amount,
      body.transactionId,
      body.locale
    );
  }

  @Post('creator-notification')
  async sendCreatorNotification(@Body() body: {
    email: string;
    creatorName: string;
    saleAmount: number;
    productName: string;
    buyerName: string;
    locale?: 'en' | 'am';
  }) {
    return this.emailService.sendCreatorNotificationEmail(
      body.email,
      body.creatorName,
      body.saleAmount,
      body.productName,
      body.buyerName,
      body.locale
    );
  }
}
