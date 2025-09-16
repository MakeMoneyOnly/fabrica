import { Injectable } from '@nestjs/common';

import { PaymentsService } from '../payments/payments.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CheckoutService {
  constructor(private payments: PaymentsService, private prisma: PrismaService) {}

  async createSession(provider: string, orderId: string) {
    const order = await this.prisma.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');
    const input = { orderId, amountInt: order.amountInt, currency: order.currency };
    return this.payments.byKey(provider).initializePayment(input);
  }
}
