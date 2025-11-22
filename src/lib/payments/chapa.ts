import crypto from 'crypto'

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
 * Documentation: https://developer.chapa.co/
 */
export class ChapaClient {
  private config: ChapaConfig
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
      // Required fields per Chapa documentation
      const payload = {
        amount: params.amount.toString(),
        currency: 'ETB',
        email: params.customerEmail,
        first_name,
        last_name,
        phone_number: params.customerPhone,
        tx_ref: params.orderId, // Unique transaction reference (order ID)
        callback_url: params.notifyUrl, // Webhook URL
        return_url: params.returnUrl,
        customization: {
          title: params.subject,
          description: `Payment for ${params.subject}`,
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

          // Chapa API returns status field in response
          if (response.ok && data.status === 'success' && data.data?.checkout_url) {
            return {
              success: true,
              paymentUrl: data.data.checkout_url,
              transactionId: data.data.tx_ref || params.orderId,
            }
          } else {
            // Handle Chapa error response
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

      return {
        success: false,
        error: lastError?.message || 'Payment initiation failed after retries',
      }
    } catch (error) {
      console.error('Chapa initiate payment error:', error)
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

      if (response.ok && data.status === 'success' && data.data) {
        // Map Chapa status to our internal status format
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
          transactionId: data.data.ref_id || txRef,
          paidAt: data.data.created_at || new Date().toISOString(),
        }
      } else {
        return {
          success: false,
          error: data.message || data.error || 'Payment verification failed',
        }
      }
    } catch (error) {
      console.error('Chapa verify payment error:', error)
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
      const webhookSecret = process.env.CHAPA_WEBHOOK_SECRET
      if (!webhookSecret) {
        console.error('CHAPA_WEBHOOK_SECRET not configured')
        return false
      }

      // Generate expected signature using webhook secret
      // Chapa uses HMAC-SHA256 on the JSON stringified payload
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex')

      // Use timing-safe comparison to prevent timing attacks
      // Note: Chapa signature is lowercase hex, not uppercase
      return crypto.timingSafeEqual(
        Buffer.from(signature.toLowerCase()),
        Buffer.from(expectedSignature.toLowerCase())
      )
    } catch (error) {
      console.error('Error verifying webhook signature:', error)
      return false
    }
  }
}

/**
 * Create Chapa client instance from environment variables
 */
export function createChapaClient(): ChapaClient {
  const secretKey = process.env.CHAPA_SECRET_KEY

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
