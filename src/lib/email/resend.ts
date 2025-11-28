import { Resend } from 'resend'
import { env } from '@/lib/env'

// Initialize Resend client
const resend = new Resend(env.RESEND_API_KEY)

// Email sender configuration
// Using test mode email until custom domain is verified
const FROM_EMAIL_TEST = 'onboarding@resend.dev' // Test mode email

// Use test email for now (will update when domain is verified)
const getFromEmail = () => FROM_EMAIL_TEST

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(to: string, userName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to,
      subject: 'Welcome to Fabrica! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Fabrica</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
              <h1 style="color: #000; margin-bottom: 20px;">Welcome to Fabrica! 🎉</h1>
              <p style="font-size: 16px; margin-bottom: 15px;">Hi ${userName},</p>
              <p style="font-size: 16px; margin-bottom: 15px;">
                We're excited to have you join the Fabrica community! You're now part of Ethiopia's fastest-growing creator economy platform.
              </p>
              <p style="font-size: 16px; margin-bottom: 15px;">
                Here's what you can do next:
              </p>
              <ul style="font-size: 16px; margin-bottom: 20px;">
                <li style="margin-bottom: 10px;">Complete your onboarding to set up your storefront</li>
                <li style="margin-bottom: 10px;">Create your first digital product or booking service</li>
                <li style="margin-bottom: 10px;">Connect your payment account to start earning</li>
                <li style="margin-bottom: 10px;">Share your unique storefront link with your audience</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${env.NEXT_PUBLIC_APP_URL}/onboarding" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600;">
                  Complete Your Setup
                </a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Need help? Reply to this email or visit our <a href="${env.NEXT_PUBLIC_APP_URL}/help" style="color: #000;">Help Center</a>.
              </p>
              <p style="font-size: 14px; color: #666;">
                Best regards,<br>
                The Fabrica Team
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error }
    }

    console.log('Welcome email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(
  to: string,
  orderDetails: {
    orderNumber: string
    productTitle: string
    amount: number
    currency: string
    downloadUrl?: string
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to,
      subject: `Order Confirmation - ${orderDetails.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
              <h1 style="color: #000; margin-bottom: 20px;">Thank you for your purchase! ✅</h1>
              <p style="font-size: 16px; margin-bottom: 15px;">
                Your order has been confirmed and is ready for you.
              </p>
              <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #000; font-size: 18px; margin-bottom: 15px;">Order Details</h2>
                <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Product:</strong> ${orderDetails.productTitle}</p>
                <p style="margin: 5px 0;"><strong>Amount:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
              </div>
              ${
                orderDetails.downloadUrl
                  ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${orderDetails.downloadUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600;">
                  Download Your Product
                </a>
              </div>
              <p style="font-size: 14px; color: #666; text-align: center;">
                This download link will expire in 7 days and can be used up to 3 times.
              </p>
              `
                  : ''
              }
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                If you have any questions, please contact the creator directly or reach out to our support team.
              </p>
              <p style="font-size: 14px; color: #666;">
                Best regards,<br>
                The Fabrica Team
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending order confirmation email:', error)
      return { success: false, error }
    }

    console.log('Order confirmation email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return { success: false, error }
  }
}

/**
 * Send new order notification to creator
 */
export async function sendNewOrderNotification(
  to: string,
  orderDetails: {
    orderNumber: string
    productTitle: string
    customerName: string
    amount: number
    currency: string
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to,
      subject: `New Order: ${orderDetails.productTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Order</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
              <h1 style="color: #000; margin-bottom: 20px;">You have a new order! 🎉</h1>
              <p style="font-size: 16px; margin-bottom: 15px;">
                Congratulations! You just made a sale.
              </p>
              <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h2 style="color: #000; font-size: 18px; margin-bottom: 15px;">Order Details</h2>
                <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Product:</strong> ${orderDetails.productTitle}</p>
                <p style="margin: 5px 0;"><strong>Customer:</strong> ${orderDetails.customerName}</p>
                <p style="margin: 5px 0;"><strong>Amount:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard/orders" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600;">
                  View Order Details
                </a>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Keep up the great work!
              </p>
              <p style="font-size: 14px; color: #666;">
                Best regards,<br>
                The Fabrica Team
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending new order notification:', error)
      return { success: false, error }
    }

    console.log('New order notification sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send new order notification:', error)
    return { success: false, error }
  }
}

export { resend }
