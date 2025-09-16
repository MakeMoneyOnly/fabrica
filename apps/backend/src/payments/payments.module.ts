import { Module } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { WeBirrProvider } from './providers/webirr.provider';
import { TelebirrProvider } from './providers/telebirr.provider';
import { ChapaProvider } from './providers/chapa.provider';
import { AmoleProvider } from './providers/amole.provider';

@Module({
  providers: [PaymentsService, WeBirrProvider, TelebirrProvider, ChapaProvider, AmoleProvider],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
