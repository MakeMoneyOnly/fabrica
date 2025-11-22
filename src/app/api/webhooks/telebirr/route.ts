import { NextRequest, NextResponse } from 'next/server'
import { getTelebirrClient } from '@/lib/payments/telebirr'
import { createAdminClient } from '@/lib/supabase/admin'
import { UnauthorizedError } from '@/lib/api/errors'
import { handleApiError, withErrorHandling } from '@/lib/api/middleware'
import { successResponse } from '@/lib/api/response'

/**
 * POST /api/webhooks/telebirr
 * Handle Telebirr payment webhook notifications
 */
async function handler(req: NextRequest): Promise<NextResponse> {
  // Get webhook signature from header
  const signature = req.headers.get('x-telebirr-signature')
  if (!signature) {
    throw new UnauthorizedError('Missing webhook signature')
  }

  // Get raw payload for signature verification
  const payload = await req.text()
  const telebirrClient = getTelebirrClient()

  // Verify webhook signature
  if (!telebirrClient.verifyWebhookSignature(payload, signature)) {
    throw new UnauthorizedError('Invalid webhook signature')
  }

  // Parse webhook payload
  const webhookData = JSON.parse(payload)
  const { outTradeNo, tradeStatus, transactionId, amount, paidAt } = webhookData

  if (!outTradeNo) {
    return successResponse({ message: 'Webhook received but missing order ID' })
  }

  try {
    const supabase = createAdminClient()

    // Find order by ID
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', outTradeNo)
      .single()

    if (orderError || !order) {
      console.error('Order not found for webhook:', outTradeNo)
      return successResponse({ message: 'Order not found' }) // Return 200 to prevent retries
    }

    // Check if payment already processed (idempotency)
    if (order.payment_status === 'completed') {
      console.warn('Payment already processed for order:', outTradeNo)
      return successResponse({ message: 'Payment already processed' })
    }

    // Handle payment success
    if (tradeStatus === 'SUCCESS') {
      // Call process_payment RPC function to atomically update order and product
      const { data: paymentResult, error: paymentError } = await supabase.rpc('process_payment', {
        p_order_id: order.id,
        p_payment_provider_id: transactionId || 'telebirr',
        p_amount: parseFloat(amount) || order.amount,
      })

      if (paymentError) {
        console.error('Failed to process payment:', paymentError)
        // Don't throw - return success to prevent webhook retries
        // Log for manual investigation
        return successResponse({ message: 'Payment processing failed, logged for investigation' })
      }

      // TODO: Send email notification (stub for Resend integration)
      // await sendOrderConfirmationEmail(order.customer_email, order)

      return successResponse({ message: 'Payment processed successfully' })
    }

    // Handle payment failure
    if (tradeStatus === 'FAILED' || tradeStatus === 'CLOSED') {
      await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', order.id)

      // TODO: Send failure notification email (stub)
      // await sendPaymentFailureEmail(order.customer_email, order)

      return successResponse({ message: 'Payment failure recorded' })
    }

    // Handle pending status (no action needed)
    return successResponse({ message: 'Payment pending' })
  } catch (error) {
    // Log error but return success to prevent webhook retries
    // Errors will be investigated manually
    console.error('Error processing Telebirr webhook:', error)
    return successResponse({ message: 'Webhook received, error logged for investigation' })
  }
}

export const POST = withErrorHandling(handler)
