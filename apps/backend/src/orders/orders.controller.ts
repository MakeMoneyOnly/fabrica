import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  create(@Body() body: { storeId: string; productId: string; customerEmail: string; customerName?: string }) {
    const { storeId, productId, customerEmail, customerName } = body;
    return this.orders.create(storeId, productId, customerEmail, customerName);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.orders.get(id);
  }
}
