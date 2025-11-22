import crypto from 'crypto'

/**
 * Telebirr payment client configuration
 */
interface TelebirrConfig {
  appId: string
  appKey: string
  merchantCode: string
  apiUrl: string
}

/**
 * Payment initiation parameters
 */
export interface InitiatePaymentParams {
  orderId: string
  amount: number // Amount in ETB
  subject: string // Payment description
  customerName: string
  customerPhone: string // Ethiopian phone format
  returnUrl: string // URL to redirect after payment
  notifyUrl: string // Webhook URL for payment notification
}

/**
 * Payment initiation result
 */
export interface PaymentInitiationResult {
  success: boolean
  paymentUrl?: string
  transactionId?: string
  error?: string
}

/**
 * Payment query result
 */
export interface PaymentQueryResult {
  success: boolean
  status?: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CLOSED'
  transactionId?: string
  paidAt?: string
  error?: string
}

/**
 * Telebirr API client
 * Handles payment initiation, querying, and webhook signature verification
 */
export class TelebirrClient {
  private config: TelebirrConfig

  constructor(config: TelebirrConfig) {
    this.config = config
  }

  /**
   * Generate signature for API request
   * Telebirr signature algorithm:
   * 1. Sort parameters alphabetically
   * 2. Create query string: key1=value1&key2=value2
   * 3. Append &key={appKey}
   * 4. Generate HMAC-SHA256 signature
   * 5. Return uppercase hex string
   */
  private generateSignature(params: Record<string, string | number>): string {
    // Sort parameters alphabetically
    const sortedKeys = Object.keys(params).sort()

    // Create query string
    const queryString = sortedKeys.map((key) => `${key}=${params[key]}`).join('&')

    // Add app key
    const signString = queryString + '&key=' + this.config.appKey

    // Generate HMAC-SHA256 signature
    const signature = crypto
      .createHmac('sha256', this.config.appKey)
      .update(signString)
      .digest('hex')
      .toUpperCase()

    return signature
  }

  /**
   * Initiate payment with Telebirr
   * @param params - Payment initiation parameters
   * @returns Payment URL or error
   */
  async initiatePayment(params: InitiatePaymentParams): Promise<PaymentInitiationResult> {
    try {
      const nonce = crypto.randomBytes(16).toString('hex')
      const timestamp = Date.now()

      const requestParams = {
        appId: this.config.appId,
        merchantCode: this.config.merchantCode,
        transactionId: `FAB_${timestamp}`,
        amount: params.amount.toFixed(2),
        subject: params.subject,
        outTradeNo: params.orderId,
        notifyUrl: params.notifyUrl,
        returnUrl: params.returnUrl,
        timeoutExpress: '30m',
        nonce,
        timestamp: timestamp.toString(),
      }

      // Generate signature
      const sign = this.generateSignature(requestParams)

      // Make API request with retry logic
      let lastError: Error | null = null
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch(`${this.config.apiUrl}/payment/initiate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...requestParams,
              sign,
            }),
          })

          const data = await response.json()

          if (data.code === '0') {
            return {
              success: true,
              paymentUrl: data.data.toPayUrl,
              transactionId: data.data.transactionId,
            }
          } else {
            return {
              success: false,
              error: data.msg || 'Payment initiation failed',
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
      console.error('Telebirr initiate payment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initiation failed',
      }
    }
  }

  /**
   * Query payment status
   * @param orderId - Order ID to query
   * @returns Payment status information
   */
  async queryPayment(orderId: string): Promise<PaymentQueryResult> {
    try {
      const nonce = crypto.randomBytes(16).toString('hex')
      const timestamp = Date.now()

      const requestParams = {
        appId: this.config.appId,
        merchantCode: this.config.merchantCode,
        outTradeNo: orderId,
        nonce,
        timestamp: timestamp.toString(),
      }

      const sign = this.generateSignature(requestParams)

      const response = await fetch(`${this.config.apiUrl}/payment/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestParams,
          sign,
        }),
      })

      const data = await response.json()

      if (data.code === '0') {
        return {
          success: true,
          status: data.data.tradeStatus as 'SUCCESS' | 'FAILED' | 'PENDING' | 'CLOSED',
          transactionId: data.data.transactionId,
          paidAt: data.data.paidAt,
        }
      } else {
        return {
          success: false,
          error: data.msg || 'Payment query failed',
        }
      }
    } catch (error) {
      console.error('Telebirr query payment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment query failed',
      }
    }
  }

  /**
   * Verify webhook signature
   * @param payload - Raw webhook payload string
   * @param signature - Signature from x-telebirr-signature header
   * @returns true if signature is valid
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const webhookSecret = process.env.TELEBIRR_WEBHOOK_SECRET
      if (!webhookSecret) {
        console.error('TELEBIRR_WEBHOOK_SECRET not configured')
        return false
      }

      // Generate expected signature using webhook secret
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex')
        .toUpperCase()

      // Use timing-safe comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(signature.toUpperCase()),
        Buffer.from(expectedSignature)
      )
    } catch (error) {
      console.error('Error verifying webhook signature:', error)
      return false
    }
  }
}

/**
 * Create Telebirr client instance from environment variables
 */
export function createTelebirrClient(): TelebirrClient {
  const appId = process.env.TELEBIRR_APP_ID
  const appKey = process.env.TELEBIRR_APP_KEY
  const merchantCode = process.env.TELEBIRR_MERCHANT_CODE
  const apiUrl = process.env.TELEBIRR_API_URL

  if (!appId || !appKey || !merchantCode || !apiUrl) {
    throw new Error(
      'Missing Telebirr configuration. Please ensure TELEBIRR_APP_ID, TELEBIRR_APP_KEY, TELEBIRR_MERCHANT_CODE, and TELEBIRR_API_URL are set.'
    )
  }

  return new TelebirrClient({
    appId,
    appKey,
    merchantCode,
    apiUrl,
  })
}

/**
 * Singleton Telebirr client instance
 * Lazy-loaded to prevent errors when env vars are not set
 */
let _telebirrClient: TelebirrClient | null = null

export function getTelebirrClient(): TelebirrClient {
  if (!_telebirrClient) {
    _telebirrClient = createTelebirrClient()
  }
  return _telebirrClient
}
