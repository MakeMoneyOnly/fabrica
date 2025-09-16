import { promises as fs } from 'fs';
import * as path from 'path';

import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  context?: Record<string, unknown>;
  locale?: 'en' | 'am';
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private templateCache: Map<string, Handlebars.TemplateDelegate> = new Map();

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethiotelecom.et',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Send email with template support
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const { html, text } = await this.processTemplate(options);

      const mailOptions = {
        from: `"Stan Store" <${process.env.EMAIL_FROM || 'noreply@stanstore.et'}>`,
        to: options.to,
        subject: options.subject,
        html,
        text,
      };

      this.logger.log(`Sending email to ${options.to}: ${options.subject}`);

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Email sending failed: ${errorMessage}`, errorStack);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(email: string, userName: string, locale: 'en' | 'am' = 'en'): Promise<EmailResult> {
    return this.sendEmail({
      to: email,
      subject: locale === 'am' ? 'እንኳን ደህና መጣህ!' : 'Welcome to Stan Store!',
      template: 'welcome',
      context: {
        userName,
        loginUrl: process.env.FRONTEND_URL || 'https://stanstore.et',
        year: new Date().getFullYear(),
      },
      locale,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string, locale: 'en' | 'am' = 'en'): Promise<EmailResult> {
    const resetUrl = `${process.env.FRONTEND_URL || 'https://stanstore.et'}/reset-password?token=${resetToken}`;

    return this.sendEmail({
      to: email,
      subject: locale === 'am' ? 'የይለፍ ቃል ለ መለወጥ' : 'Reset Your Password',
      template: 'password-reset',
      context: {
        resetUrl,
        validHours: 24,
      },
      locale,
    });
  }

  /**
   * Send purchase confirmation email
   */
  async sendPurchaseConfirmationEmail(
    email: string,
    userName: string,
    productName: string,
    amount: number,
    transactionId: string,
    locale: 'en' | 'am' = 'en'
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: email,
      subject: locale === 'am' ? 'ገዛዎ በተሳካ ሁኔታ ተስኪዋል' : 'Purchase Confirmation',
      template: 'purchase-confirmation',
      context: {
        userName,
        productName,
        amount,
        transactionId,
        downloadUrl: `${process.env.FRONTEND_URL || 'https://stanstore.et'}/downloads`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@stanstore.et',
      },
      locale,
    });
  }

  /**
   * Send creator notification email
   */
  async sendCreatorNotificationEmail(
    email: string,
    creatorName: string,
    saleAmount: number,
    productName: string,
    buyerName: string,
    locale: 'en' | 'am' = 'en'
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: email,
      subject: locale === 'am' ? 'አዲስ ሽያጭ!' : 'New Sale Notification',
      template: 'creator-sale',
      context: {
        creatorName,
        saleAmount,
        productName,
        buyerName,
        dashboardUrl: `${process.env.FRONTEND_URL || 'https://stanstore.et'}/creator/dashboard`,
      },
      locale,
    });
  }

  /**
   * Process email templates
   */
  private async processTemplate(options: EmailOptions): Promise<{ html: string; text: string }> {
    if (options.template) {
      const templateResult = await this.renderTemplate(options.template, options.context || {}, options.locale);
      return templateResult;
    }

    return {
      html: options.html || '',
      text: options.text || '',
    };
  }

  /**
   * Render Handlebars template with localization
   */
  private async renderTemplate(templateName: string, context: Record<string, unknown>, locale: 'en' | 'am' = 'en'): Promise<{ html: string; text: string }> {
    const templateKey = `${templateName}_${locale}`;
    let template = this.templateCache.get(templateKey);

    if (!template) {
      const templatePath = path.join(__dirname, 'templates', locale, `${templateName}.hbs`);
      try {
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        template = Handlebars.compile(templateContent);
        this.templateCache.set(templateKey, template);
      } catch {
        // Fallback to English template if locale-specific doesn't exist
        if (locale !== 'en') {
          return this.renderTemplate(templateName, context, 'en');
        }
        throw new Error(`Template ${templateName} not found`);
      }
    }

    // Add common template variables
    const fullContext = {
      ...context,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@stanstore.et',
      companyName: 'Stan Store',
      year: new Date().getFullYear(),
    };

    const html = template(fullContext);

    // Generate text version by stripping HTML
    const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    return { html, text };
  }

  /**
   * Validate email address
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get available locales
   */
  getAvailableLocales(): string[] {
    return ['en', 'am'];
  }
}
