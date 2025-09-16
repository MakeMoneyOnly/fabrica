import { Body, Controller, Param, Post } from '@nestjs/common';

import { CheckoutService } from './checkout.service';

@Controller('api/checkout')
export class CheckoutController {
  constructor(private checkout: CheckoutService) {}

  @Post(':provider/session')
  create(@Param('provider') provider: string, @Body() body: { orderId: string }) {
    return this.checkout.createSession(provider, body.orderId);
  }
}
