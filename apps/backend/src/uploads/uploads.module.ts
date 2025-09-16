import { Module } from '@nestjs/common';

import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  // Note: Bull queue can be added later for background processing
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
