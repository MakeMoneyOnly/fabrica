import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private smsService: SmsService,
    private emailService: EmailService,
  ) {}

  async register(email: string, password: string, name?: string, phoneNumber?: string) {
    const existing = await this.prisma.prisma.user.findUnique({ where: { email } });
    if (existing) throw new UnauthorizedException('Email in use');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.prisma.user.create({ data: { email, passwordHash, name } });

    // Send welcome SMS if phone number is provided
    if (phoneNumber) {
      try {
        await this.smsService.sendWelcomeMessage(phoneNumber, name || 'User');
      } catch (error: unknown) {
        // Log error but don't fail registration if SMS fails
        this.logger.warn('Failed to send welcome SMS:', error instanceof Error ? error.message : String(error));
      }
    }

    return this.sign(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user.id, user.email);
  }

  async refreshToken(userId: string, email: string) {
    const user = await this.prisma.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true }
    });
    if (!user) throw new UnauthorizedException('User not found');
    // Verify email matches for security
    if (user.email !== email) throw new UnauthorizedException('Email verification failed');
    return this.sign(user.id, user.email);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  private sign(id: string, email: string) {
    const token = this.jwt.sign({ sub: id, email });
    return { access_token: token };
  }
}
