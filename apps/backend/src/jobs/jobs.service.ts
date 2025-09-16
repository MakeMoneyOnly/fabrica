import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
  locale?: 'en' | 'am';
  priority?: 'low' | 'normal' | 'high';
}

export interface SmsJobData {
  phoneNumber: string;
  message: string;
  priority?: 'low' | 'normal' | 'high';
}

export interface DataProcessingJobData {
  type: 'user_registration' | 'payment_processing' | 'analytics_update';
  payload: Record<string, unknown>;
  priority?: 'low' | 'normal' | 'high';
}

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('sms') private smsQueue: Queue,
    @InjectQueue('data-processing') private dataProcessingQueue: Queue,
  ) {}

  async onModuleInit() {
    this.logger.log('Job queues initialized');
  }

  /**
   * Add email job to queue
   */
  async addEmailJob(data: EmailJobData): Promise<Job<EmailJobData>> {
    const priority = this.getPriorityValue(data.priority || 'normal');
    const delay = priority === 3 ? 0 : priority === 2 ? 5000 : 30000; // High: immediate, Normal: 5s, Low: 30s

    const job = await this.emailQueue.add('send-email', data, {
      priority,
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 50,
      removeOnFail: 10,
    });

    this.logger.log(`Email job added to queue: ${job.id} - Priority: ${data.priority || 'normal'}`);
    return job;
  }

  /**
   * Add SMS job to queue
   */
  async addSmsJob(data: SmsJobData): Promise<Job<SmsJobData>> {
    const priority = this.getPriorityValue(data.priority || 'normal');

    const job = await this.smsQueue.add('send-sms', data, {
      priority,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 30,
      removeOnFail: 5,
    });

    this.logger.log(`SMS job added to queue: ${job.id} - Priority: ${data.priority || 'normal'}`);
    return job;
  }

  /**
   * Add data processing job to queue
   */
  async addDataProcessingJob(data: DataProcessingJobData): Promise<Job<DataProcessingJobData>> {
    const priority = this.getPriorityValue(data.priority || 'low');

    const job = await this.dataProcessingQueue.add('process-data', data, {
      priority,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 20,
      removeOnFail: 5,
    });

    this.logger.log(`Data processing job added to queue: ${job.id} - Type: ${data.type} - Priority: ${data.priority || 'low'}`);
    return job;
  }

  /**
   * Schedule Ethiopian analytics update
   */
  async scheduleAnalyticsUpdate(): Promise<Job<DataProcessingJobData>> {
    return this.addDataProcessingJob({
      type: 'analytics_update',
      payload: { timestamp: new Date().toISOString() },
      priority: 'low',
    });
  }

  /**
   * Bulk operations for Ethiopian market
   */
  async bulkEmailJob(emailJobs: EmailJobData[]): Promise<Job[]> {
    const jobs: Job[] = [];

    // Process in chunks to avoid overwhelming the queue
    const chunks = this.chunkArray(emailJobs, 10);

    for (const chunk of chunks) {
      for (const emailData of chunk) {
        const job = await this.addEmailJob(emailData);
        jobs.push(job);
      }

      // Small delay between chunks
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.logger.log(`Bulk email jobs queued: ${jobs.length} jobs in ${chunks.length} chunks`);
    return jobs;
  }

  private getPriorityValue(priority: 'low' | 'normal' | 'high'): number {
    switch (priority) {
      case 'high': return 3;
      case 'normal': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Get queue statistics for monitoring
   */
  async getQueueStats() {
    const emailStats = await this.emailQueue.getJobCounts();
    const smsStats = await this.smsQueue.getJobCounts();
    const dataStats = await this.dataProcessingQueue.getJobCounts();

    return {
      email: emailStats,
      sms: smsStats,
      'data-processing': dataStats,
    };
  }

  /**
   * Clean up completed jobs
   */
  async cleanCompletedJobs() {
    await Promise.all([
      this.emailQueue.clean(24 * 60 * 60 * 1000, 'completed'), // 24 hours
      this.smsQueue.clean(24 * 60 * 60 * 1000, 'completed'),
      this.dataProcessingQueue.clean(24 * 60 * 60 * 1000, 'completed'),
    ]);

    this.logger.log('Cleaned up completed jobs from all queues');
  }

  /**
   * Emergency stop all queues
   */
  async emergencyStop() {
    await Promise.all([
      this.emailQueue.pause(),
      this.smsQueue.pause(),
      this.dataProcessingQueue.pause(),
    ]);

    this.logger.warn('All job queues have been paused due to emergency stop');
  }

  /**
   * Resume all queues
   */
  async resumeQueues() {
    await Promise.all([
      this.emailQueue.resume(),
      this.smsQueue.resume(),
      this.dataProcessingQueue.resume(),
    ]);

    this.logger.log('All job queues have been resumed');
  }
}
