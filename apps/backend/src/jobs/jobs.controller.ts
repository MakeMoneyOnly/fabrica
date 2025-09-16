import { Controller, Get, Post } from '@nestjs/common';

import { JobsService } from './jobs.service';

@Controller('api/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('stats')
  async getQueueStats() {
    return this.jobsService.getQueueStats();
  }

  @Post('cleanup')
  async cleanCompletedJobs() {
    await this.jobsService.cleanCompletedJobs();
    return { success: true, message: 'Completed jobs cleaned up' };
  }

  @Post('emergency-stop')
  async emergencyStop() {
    await this.jobsService.emergencyStop();
    return { success: true, message: 'All job queues have been stopped' };
  }

  @Post('resume')
  async resumeQueues() {
    await this.jobsService.resumeQueues();
    return { success: true, message: 'All job queues have been resumed' };
  }
}
