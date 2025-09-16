import { Body, Controller, Param, Post } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { InitPaymentInput } from './types';

@Controller('api/payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post(':provider/init')
  init(@Param('provider') provider: string, @Body() body: InitPaymentInput) {
    return this.payments.byKey(provider).initializePayment(body);
  }

  @Post(':provider/webhook')
  webhook(@Param('provider') provider: string, @Body() body: Record<string, unknown>) {
    return this.payments.byKey(provider).handleWebhook(body);
  }
}
