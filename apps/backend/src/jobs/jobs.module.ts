import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'sms' },
      { name: 'data-processing' },
    ),
  ],
  providers: [JobsService],
  controllers: [JobsController],
  exports: [JobsService],
})
export class JobsModule {}
