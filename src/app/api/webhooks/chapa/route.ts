import { NextRequest, NextResponse } from 'next/server'
import { getChapaClient } from '@/lib/payments/chapa'
import { createAdminClient } from '@/lib/supabase/admin'
import { UnauthorizedError } from '@/lib/api/errors'
import { withErrorHandling } from '@/lib/api/middleware'
import { successResponse } from '@/lib/api/response'
import * as Sentry from '@sentry/nextjs'

/**
 * POST /api/webhooks/chapa
 * Handle Chapa payment webhook notifications
 * Documentation: https://developer.chapa.co/integrations/webhooks
 */
async function handler(req: NextRequest): Promise<NextResponse> {
  // Get webhook signature from header
  // Chapa uses 'Chapa-Signature' or 'x-chapa-signature' header (per official documentation)
  // Check both header names for compatibility
  const signature = req.headers.get('Chapa-Signature') || req.headers.get('x-chapa-signature')
  if (!signature) {
    throw new UnauthorizedError('Missing webhook signature')
  }

  // Get raw payload for signature verification
  const payload = await req.text()
  const chapaClient = getChapaClient()

  // Verify webhook signature using HMAC-SHA256
  if (!chapaClient.verifyWebhookSignature(payload, signature)) {
    throw new UnauthorizedError('Invalid webhook signature')
  }

  // Parse webhook payload
  // Chapa webhook structure: {trx_ref, ref_id, status}
  const webhookData = JSON.parse(payload)
  const { trx_ref, ref_id, status } = webhookData

  // trx_ref maps to the order ID (tx_ref used in payment initiation)
  if (!trx_ref) {
    return successResponse({ message: 'Webhook received but missing transaction reference' })
  }

  try {
    const supabase = createAdminClient()

    // Find order by ID (trx_ref is the order ID)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', trx_ref)
      .single()

    if (orderError || !order) {
      Sentry.captureMessage('Order not found for Chapa webhook', {
        level: 'warning',
        tags: { component: 'webhook', operation: 'chapa', event: 'order_not_found' },
        extra: { trx_ref },
      })
      return successResponse({ message: 'Order not found' }) // Return 200 to prevent retries
    }

    // Check if payment already processed (idempotency)
    if (order.payment_status === 'completed') {
      Sentry.addBreadcrumb({
        category: 'webhook',
        message: 'Duplicate webhook received for completed order',
        level: 'info',
        data: { orderId: trx_ref },
      })
      return successResponse({ message: 'Payment already processed' })
    }

    // Handle payment success
    // Chapa status values: "success", "failed", "pending"
    if (status === 'success' || status === 'successful') {
      // Call process_payment RPC function to atomically update order and product
      const { error: paymentError } = await supabase.rpc('process_payment', {
        p_order_id: order.id,
        p_payment_provider_id: ref_id || 'chapa',
        p_amount: order.amount,
      })

      if (paymentError) {
        Sentry.captureException(paymentError, {
          tags: { component: 'webhook', operation: 'chapa', event: 'payment_processing_failed' },
          extra: {
            orderId: order.id,
            trx_ref,
            ref_id,
            status,
          },
        })
        // Don't throw - return success to prevent webhook retries
        // Log for manual investigation
        return successResponse({ message: 'Payment processing failed, logged for investigation' })
      }

      // TODO: Send email notification (stub for Resend integration)
      // await sendOrderConfirmationEmail(order.customer_email, order)

      return successResponse({ message: 'Payment processed successfully' })
    }

    // Handle payment failure
    if (status === 'failed' || status === 'failure') {
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
    Sentry.captureException(error, {
      tags: { component: 'webhook', operation: 'chapa', event: 'webhook_processing_error' },
      extra: {
        trx_ref,
        ref_id,
        status,
      },
    })
    return successResponse({ message: 'Webhook received, error logged for investigation' })
  }
}

export const POST = withErrorHandling(handler)
