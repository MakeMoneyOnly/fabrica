import { Module } from '@nestjs/common';

import { PaymentsModule } from '../payments/payments.module';

import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';

@Module({
  imports: [PaymentsModule],
  providers: [CheckoutService],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
