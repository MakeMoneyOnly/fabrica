import { NextRequest, NextResponse } from 'next/server'
import { getChapaClient } from '@/lib/payments/chapa'
import { initiatePaymentSchema } from '@/lib/validations/payments'
import { validateRequest, validationErrorResponse } from '@/lib/validations/utils'
import { paymentLimiter } from '@/lib/ratelimit'
import { withRateLimit, rateLimitErrorResponse } from '@/lib/ratelimit/middleware'
import { createAdminClient } from '@/lib/supabase/admin'
import { NotFoundError, BadGatewayError } from '@/lib/api/errors'
import { handleApiError, withErrorHandling } from '@/lib/api/middleware'
import { successResponse } from '@/lib/api/response'

/**
 * POST /api/payments/initiate
 * Initiate a Chapa payment for an order
 * Documentation: https://developer.chapa.co/integrations/accept-payments
 */
async function handler(req: NextRequest): Promise<NextResponse> {
  // Apply rate limiting
  const rateLimitResult = await withRateLimit(paymentLimiter, req)
  if (!rateLimitResult.success) {
    return rateLimitErrorResponse(
      rateLimitResult.limit,
      rateLimitResult.remaining,
      rateLimitResult.reset
    )
  }

  // Parse and validate request body
  const body = await req.json()
  const validation = validateRequest(initiatePaymentSchema, body)

  if (!validation.success) {
    return validationErrorResponse(validation.error)
  }

  const { productId, customerEmail, customerName, customerPhone } = validation.data

  try {
    const supabase = createAdminClient()

    // Verify product exists and is available
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      throw new NotFoundError('Product not found')
    }

    // Check for existing pending order (idempotency)
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id, metadata')
      .eq('product_id', productId)
      .eq('customer_email', customerEmail)
      .eq('payment_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (
      existingOrder &&
      existingOrder.metadata &&
      typeof existingOrder.metadata === 'object' &&
      'paymentUrl' in existingOrder.metadata
    ) {
      // Return existing payment URL
      return successResponse({
        paymentUrl: (existingOrder.metadata as { paymentUrl: string }).paymentUrl,
        orderId: existingOrder.id,
      })
    }

    // Generate order number using RPC function
    const { data: orderNumberData, error: orderNumberError } =
      await supabase.rpc('generate_order_number')

    if (orderNumberError || !orderNumberData) {
      throw new Error('Failed to generate order number')
    }

    const orderNumber = orderNumberData as string

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        product_id: productId,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        amount: product.price || 0,
        payment_status: 'pending',
        payment_provider: 'chapa',
      })
      .select()
      .single()

    if (orderError || !order) {
      throw new Error('Failed to create order')
    }

    // Initiate payment with Chapa
    const chapaClient = getChapaClient()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const paymentResult = await chapaClient.initiatePayment({
      orderId: order.id,
      amount: product.price || 0,
      subject: product.title,
      customerName,
      customerEmail,
      customerPhone,
      returnUrl: `${baseUrl}/orders/${order.id}/success`,
      notifyUrl: `${baseUrl}/api/webhooks/chapa`,
    })

    if (!paymentResult.success || !paymentResult.paymentUrl) {
      // Update order status to failed
      await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', order.id)
      throw new BadGatewayError(paymentResult.error || 'Payment initiation failed')
    }

    // Update order with payment URL in metadata
    await supabase
      .from('orders')
      .update({ metadata: { paymentUrl: paymentResult.paymentUrl } })
      .eq('id', order.id)

    return successResponse({
      paymentUrl: paymentResult.paymentUrl,
      orderId: order.id,
      transactionId: paymentResult.transactionId,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const POST = withErrorHandling(handler)
