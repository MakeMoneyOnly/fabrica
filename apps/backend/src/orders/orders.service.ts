import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(storeId: string, productId: string, customerEmail: string, customerName?: string) {
    const store = await this.prisma.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new Error('Store not found');
    const product = await this.prisma.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    let customer = await this.prisma.prisma.customer.findUnique({ where: { email: customerEmail } });
    if (!customer) {
      customer = await this.prisma.prisma.customer.create({ data: { email: customerEmail, name: customerName } });
    }

    const order = await this.prisma.prisma.order.create({
      data: {
        storeId: store.id,
        productId: product.id,
        customerId: customer.id,
        amountInt: product.priceInt,
        currency: store.currency,
      },
    });

    return order;
  }

  get(id: string) {
    return this.prisma.prisma.order.findUnique({ where: { id } });
  }
}
