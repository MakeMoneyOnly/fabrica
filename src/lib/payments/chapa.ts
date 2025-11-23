import crypto from 'crypto'
import * as Sentry from '@sentry/nextjs'
import { env } from '@/lib/env'

/**
 * Chapa payment client configuration
 * Uses Bearer token authentication (CHASECK-xxxxx or CHASECK_TEST-xxxxx for sandbox)
 */
interface ChapaConfig {
  secretKey: string // Bearer token: CHASECK-xxxxx
}

/**
 * Payment initiation parameters
 * Compatible with existing InitiatePaymentParams interface
 */
export interface InitiatePaymentParams {
  orderId: string // Maps to tx_ref in Chapa API
  amount: number // Amount in ETB
  subject: string // Payment description (maps to customization.title)
  customerName: string // Will be split into first_name and last_name
  customerEmail: string // Customer email (required by Chapa)
  customerPhone: string // Ethiopian phone format (09xxxxxxxx or 07xxxxxxxx)
  returnUrl: string // URL to redirect after payment
  notifyUrl: string // Webhook URL for payment notification (maps to callback_url)
}

/**
 * Payment initiation result
 * Compatible with existing PaymentInitiationResult interface
 */
export interface PaymentInitiationResult {
  success: boolean
  paymentUrl?: string // Maps to checkout_url from Chapa response
  transactionId?: string // Maps to ref_id from Chapa response
  error?: string
}

/**
 * Payment verification result
 * Compatible with existing PaymentQueryResult interface
 */
export interface PaymentQueryResult {
  success: boolean
  status?: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CLOSED'
  transactionId?: string // Maps to ref_id from Chapa response
  paidAt?: string
  error?: string
}

/**
 * Chapa API client
 * Handles payment initiation, verification, and webhook signature verification
 *
 * API Documentation:
 * - Payment Initiation: https://developer.chapa.co/integrations/accept-payments
 * - Payment Verification: https://developer.chapa.co/integrations/verify-payments
 * - Webhooks: https://developer.chapa.co/integrations/webhooks
 * - Test Mode: https://developer.chapa.co/test/testing-cards
 */
export class ChapaClient {
  private config: ChapaConfig
  /**
   * Chapa API base URL
   * Production: https://api.chapa.co/v1
   * Test mode uses same URL with CHASECK_TEST-xxxxx key
   */
  private readonly apiBaseUrl = 'https://api.chapa.co/v1'

  constructor(config: ChapaConfig) {
    this.config = config
  }

  /**
   * Split customer name into first_name and last_name
   * Handles various name formats gracefully
   */
  private splitCustomerName(fullName: string): { first_name: string; last_name: string } {
    const nameParts = fullName.trim().split(/\s+/)
    if (nameParts.length === 1) {
      return {
        first_name: nameParts[0],
        last_name: nameParts[0], // Use same name if only one part
      }
    }
    return {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(' '),
    }
  }

  /**
   * Initiate payment with Chapa
   * API Documentation: https://developer.chapa.co/integrations/accept-payments
   * @param params - Payment initiation parameters
   * @returns Payment URL or error
   */
  async initiatePayment(params: InitiatePaymentParams): Promise<PaymentInitiationResult> {
    try {
      const { first_name, last_name } = this.splitCustomerName(params.customerName)

      // Prepare Chapa API request payload
      // Required fields per Chapa documentation: https://developer.chapa.co/integrations/accept-payments
      // Payload structure matches Chapa API v1 specification
      const payload = {
        amount: params.amount.toString(), // Amount as string in ETB
        currency: 'ETB', // Ethiopian Birr (Chapa's primary currency)
        email: params.customerEmail, // Customer email (required)
        first_name, // Customer first name
        last_name, // Customer last name
        phone_number: params.customerPhone, // Ethiopian phone format (09xxxxxxxx or 07xxxxxxxx)
        tx_ref: params.orderId, // Unique transaction reference (maps to our order ID)
        callback_url: params.notifyUrl, // Webhook URL for payment notifications
        return_url: params.returnUrl, // URL to redirect customer after payment
        customization: {
          title: params.subject, // Payment title shown to customer
          description: `Payment for ${params.subject}`, // Payment description
        },
      }

      // Make API request with retry logic
      let lastError: Error | null = null
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch(`${this.apiBaseUrl}/transaction/initialize`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.config.secretKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })

          const data = await response.json()

          // Chapa API response format: { status: 'success', data: { checkout_url, tx_ref, ... } }
          // Documentation: https://developer.chapa.co/integrations/responses
          if (response.ok && data.status === 'success' && data.data?.checkout_url) {
            return {
              success: true,
              paymentUrl: data.data.checkout_url, // Chapa checkout URL for customer
              transactionId: data.data.tx_ref || params.orderId, // Transaction reference
            }
          } else {
            // Handle Chapa error response
            // Error format: { status: 'error', message: '...' } or { error: '...' }
            const errorMessage =
              data.message || data.error || data.status || 'Payment initiation failed'
            return {
              success: false,
              error: errorMessage,
            }
          }
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Network error')
          // Wait before retry (exponential backoff)
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
          }
        }
      }

      // Log retry failure to Sentry
      if (lastError) {
        Sentry.captureException(lastError, {
          tags: { component: 'chapa', operation: 'initiatePayment' },
          extra: {
            orderId: params.orderId,
            amount: params.amount,
            retries: 3,
          },
        })
      }

      return {
        success: false,
        error: lastError?.message || 'Payment initiation failed after retries',
      }
    } catch (error) {
      // Log unexpected errors to Sentry
      Sentry.captureException(error, {
        tags: { component: 'chapa', operation: 'initiatePayment' },
        extra: {
          orderId: params.orderId,
          amount: params.amount,
        },
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initiation failed',
      }
    }
  }

  /**
   * Verify payment status
   * API Documentation: https://developer.chapa.co/integrations/verify-payments
   * @param txRef - Transaction reference (order ID)
   * @returns Payment status information
   */
  async verifyPayment(txRef: string): Promise<PaymentQueryResult> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/transaction/verify/${txRef}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      // Chapa verification response format: { status: 'success', data: { status, ref_id, created_at, ... } }
      // Documentation: https://developer.chapa.co/integrations/verify-payments
      if (response.ok && data.status === 'success' && data.data) {
        // Map Chapa status values to our internal status format
        // Chapa statuses: 'success', 'successful', 'failed', 'failure', 'pending', 'closed'
        const chapaStatus = data.data.status?.toLowerCase()
        let status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CLOSED' = 'PENDING'

        if (chapaStatus === 'success' || chapaStatus === 'successful') {
          status = 'SUCCESS'
        } else if (chapaStatus === 'failed' || chapaStatus === 'failure') {
          status = 'FAILED'
        } else if (chapaStatus === 'closed') {
          status = 'CLOSED'
        }

        return {
          success: true,
          status,
          transactionId: data.data.ref_id || txRef, // Chapa transaction reference ID
          paidAt: data.data.created_at || new Date().toISOString(), // Payment timestamp
        }
      } else {
        // Log API error response to Sentry
        Sentry.captureMessage('Chapa payment verification failed', {
          level: 'warning',
          tags: { component: 'chapa', operation: 'verifyPayment' },
          extra: {
            txRef,
            apiStatus: data.status,
            apiMessage: data.message || data.error,
          },
        })

        return {
          success: false,
          error: data.message || data.error || 'Payment verification failed',
        }
      }
    } catch (error) {
      // Log verification errors to Sentry
      Sentry.captureException(error, {
        tags: { component: 'chapa', operation: 'verifyPayment' },
        extra: { txRef },
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed',
      }
    }
  }

  /**
   * Query payment status (alias for verifyPayment for compatibility)
   * @param orderId - Order ID to query
   * @returns Payment status information
   */
  async queryPayment(orderId: string): Promise<PaymentQueryResult> {
    return this.verifyPayment(orderId)
  }

  /**
   * Verify webhook signature
   * Documentation: https://developer.chapa.co/integrations/webhooks
   * @param payload - Raw webhook payload string
   * @param signature - Signature from Chapa-Signature header
   * @returns true if signature is valid
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const webhookSecret = env.CHAPA_WEBHOOK_SECRET
      if (!webhookSecret) {
        Sentry.captureMessage('CHAPA_WEBHOOK_SECRET not configured', {
          level: 'error',
          tags: { component: 'chapa', operation: 'verifyWebhookSignature' },
        })
        return false
      }

      // Generate expected signature using webhook secret
      // Chapa uses HMAC-SHA256 on the JSON stringified payload
      // Documentation: https://developer.chapa.co/integrations/webhooks
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex')

      // Use timing-safe comparison to prevent timing attacks
      // Note: Chapa signature is lowercase hex, not uppercase
      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature.toLowerCase()),
        Buffer.from(expectedSignature.toLowerCase())
      )

      // Log invalid signature attempts (but not the signature itself for security)
      if (!isValid) {
        Sentry.captureMessage('Invalid Chapa webhook signature', {
          level: 'warning',
          tags: { component: 'chapa', operation: 'verifyWebhookSignature' },
        })
      }

      return isValid
    } catch (error) {
      // Log signature verification errors to Sentry
      Sentry.captureException(error, {
        tags: { component: 'chapa', operation: 'verifyWebhookSignature' },
      })
      return false
    }
  }
}

/**
 * Create Chapa client instance from environment variables
 * Uses validated environment variables from env.ts
 */
export function createChapaClient(): ChapaClient {
  const secretKey = env.CHAPA_SECRET_KEY

  if (!secretKey) {
    throw new Error(
      'Missing Chapa configuration. Please ensure CHAPA_SECRET_KEY is set. Get your key from https://developer.chapa.co/'
    )
  }

  return new ChapaClient({
    secretKey,
  })
}

/**
 * Singleton Chapa client instance
 * Lazy-loaded to prevent errors when env vars are not set
 */
let _chapaClient: ChapaClient | null = null

export function getChapaClient(): ChapaClient {
  if (!_chapaClient) {
    _chapaClient = createChapaClient()
  }
  return _chapaClient
}
