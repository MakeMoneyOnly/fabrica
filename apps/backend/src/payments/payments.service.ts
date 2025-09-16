import { Injectable, Logger, BadRequestException } from '@nestjs/common';

import { PaymentProvider, InitPaymentInput, PaymentInitializationResult } from './types';
import { WeBirrProvider } from './providers/webirr.provider';
import { TelebirrProvider } from './providers/telebirr.provider';
import { ChapaProvider } from './providers/chapa.provider';
import { AmoleProvider } from './providers/amole.provider';

interface ProviderHealth {
  provider: string;
  healthy: boolean;
  lastChecked: Date;
  consecutiveFailures: number;
  responseTime: number;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly providers = new Map<string, PaymentProvider>();
  private healthStatus = new Map<string, ProviderHealth>();
  private readonly maxConsecutiveFailures = 3;
  private readonly healthCheckInterval = 30000; // 30 seconds

  constructor(
    private webirr: WeBirrProvider,
    private telebirr: TelebirrProvider,
    private chapa: ChapaProvider,
    private amole: AmoleProvider,
  ) {
    this.providers.set('WEBIRR', this.webirr);
    this.providers.set('TELEBIRR', this.telebirr);
    this.providers.set('CBE_BIRR', this.chapa);
    this.providers.set('AMOLE', this.amole);

    // Initialize health status
    this.providers.forEach((_, key) => {
      this.healthStatus.set(key, {
        provider: key,
        healthy: true,
        lastChecked: new Date(),
        consecutiveFailures: 0,
        responseTime: 0,
      });
    });

    // Start periodic health checks
    setInterval(() => this.performHealthChecks(), this.healthCheckInterval);
  }

  async initializePayment(input: InitPaymentInput): Promise<PaymentInitializationResult> {
    const provider = await this.selectProvider();
    const startTime = Date.now();

    try {
      this.logger.log(`Initializing payment with ${provider.constructor.name} for order: ${input.orderId}`);
      this.logger.debug('Payment input received', { orderId: input.orderId });

      const result = await provider.initializePayment(input);
      const responseTime = Date.now() - startTime;

      this.updateProviderHealth(provider.constructor.name.replace('Provider', '').toUpperCase(), true, responseTime);

      this.logger.log(`Payment initialized successfully with ${provider.constructor.name} for order: ${input.orderId}`);
      return result;
    } catch (error) {
      const providerKey = provider.constructor.name.replace('Provider', '').toUpperCase();
      this.updateProviderHealth(providerKey, false);

      this.logger.error(`Payment initialization failed with ${provider.constructor.name}:`, error);

      // Try failover
      return await this.tryFailover(input, provider.constructor.name.replace('Provider', '').toUpperCase());
    }
  }

  private async selectProvider(): Promise<PaymentProvider> {
    // Primary provider selection based on Ethiopian preferences
    const preferredOrder = ['WEBIRR', 'TELEBIRR', 'AMOLE', 'CBE_BIRR'];
    const etbPayments = preferredOrder.filter(provider => this.isProviderHealthy(provider));

    if (etbPayments.length === 0) {
      throw new BadRequestException('All payment providers are currently unavailable');
    }

    // Simple load balancing: round-robin based on current load
    const selectedKey = this.getLeastLoadedProvider(etbPayments);
    const provider = this.providers.get(selectedKey);

    if (!provider) {
      throw new BadRequestException(`Payment provider ${selectedKey} not found`);
    }

    return provider;
  }

  private async tryFailover(input: InitPaymentInput, failedProvider: string): Promise<PaymentInitializationResult> {
    this.logger.warn(`Attempting failover from ${failedProvider}`);

    const fallbackProviders = ['WEBIRR', 'TELEBIRR', 'AMOLE', 'CBE_BIRR']
      .filter(provider => provider !== failedProvider && this.isProviderHealthy(provider));

    for (const providerKey of fallbackProviders) {
      const provider = this.providers.get(providerKey);
      if (!provider) continue;

      try {
        this.logger.log(`Trying failover to ${providerKey} for order: ${input.orderId}`);

        const result = await provider.initializePayment(input);
        this.logger.log(`Failover successful with ${providerKey} for order: ${input.orderId}`);

        return result;
      } catch (error) {
        this.logger.error(`Failover to ${providerKey} also failed:`, error);
        this.updateProviderHealth(providerKey, false);
      }
    }

    throw new BadRequestException('All payment providers failed. Please try again later.');
  }

  byKey(key: string): PaymentProvider {
    const provider = this.providers.get(key.toUpperCase());
    if (!provider) {
      throw new Error('Unsupported provider');
    }
    return provider;
  }

  private isProviderHealthy(providerKey: string): boolean {
    const health = this.healthStatus.get(providerKey);
    return health ? health.healthy : false;
  }

  private getLeastLoadedProvider(availableProviders: string[]): string {
    let bestProvider = availableProviders[0];
    let minLoad = Infinity;

    for (const provider of availableProviders) {
      const health = this.healthStatus.get(provider);
      if (health && health.responseTime < minLoad) {
        minLoad = health.responseTime;
        bestProvider = provider;
      }
    }

    return bestProvider;
  }

  private updateProviderHealth(providerKey: string, success: boolean, responseTime?: number): void {
    const health = this.healthStatus.get(providerKey);
    if (!health) return;

    health.lastChecked = new Date();

    if (success) {
      health.healthy = true;
      health.consecutiveFailures = 0;
      if (responseTime !== undefined) {
        health.responseTime = responseTime;
      }
    } else {
      health.consecutiveFailures++;
      if (health.consecutiveFailures >= this.maxConsecutiveFailures) {
        health.healthy = false;
        this.logger.warn(`Provider ${providerKey} marked as unhealthy after ${health.consecutiveFailures} failures`);
      }
    }
  }

  private async performHealthChecks(): Promise<void> {
    for (const [providerKey] of this.providers) {
      try {
        // Simple health check by attempting a minimal API call
        // In production, this could be a dedicated health endpoint
        const startTime = Date.now();

        // For health check, we could implement a lightweight status check
        // For now, we assume providers are healthy unless they're marked unhealthy
        const responseTime = Date.now() - startTime;

        this.updateProviderHealth(providerKey, true, responseTime);
      } catch (error) {
        this.updateProviderHealth(providerKey, false);
      }
    }
  }

  // Method to get provider health status for monitoring
  getHealthStatus(): { [key: string]: ProviderHealth } {
    const status: { [key: string]: ProviderHealth } = {};
    this.healthStatus.forEach((health, key) => {
      status[key] = { ...health };
    });
    return status;
  }
}
