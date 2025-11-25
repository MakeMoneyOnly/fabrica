import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { env } from '@/lib/env'
import { generateReferralCode } from '@/lib/utils/referral'

export async function POST(req: Request) {
  // Get the webhook secret from validated environment variables
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET

  // Get the headers (await since headers() returns a Promise in App Router)
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  // Get the ID and type
  const { id } = evt.data
  const eventType = evt.type

  // Log webhook details for debugging and audit purposes (without sensitive data)
  console.warn(`Webhook received: ID=${id}, Type=${eventType}`)

  // Handle different webhook events
  try {
    switch (eventType) {
      case 'user.created': {
        // Handle user creation - sync to database
        const { email_addresses, phone_numbers, first_name, last_name } = evt.data

        // Extract email and phone
        const email = email_addresses?.[0]?.email_address
        const phone = phone_numbers?.[0]?.phone_number || null
        const fullName = first_name && last_name ? `${first_name} ${last_name}` : null

        if (!email) {
          console.error('User created event missing email address')
          return new Response('Invalid user data: email required', { status: 400 })
        }

        // Create admin client for database operations
        const supabase = createAdminClient()

        // Call RPC function to create user with referral support
        const { error } = await supabase.rpc('create_user_with_referral', {
          p_clerk_user_id: id || '',
          p_email: email,
          p_phone: phone || undefined,
          p_full_name: fullName || undefined,
          p_referred_by_code: undefined, // Can be extracted from metadata if needed
        })

        if (error) {
          console.error('Failed to create user in database:', error)
          return new Response('Database sync failed', { status: 500 })
        }

        console.warn(`User created successfully: ${id}`)

        // Send welcome email
        try {
          const { sendWelcomeEmail } = await import('@/lib/email/resend')
          await sendWelcomeEmail(email, first_name || 'there')
        } catch (emailError) {
          // Log error but don't fail the webhook
          console.error('Failed to send welcome email:', emailError)
        }

        break
      }

      case 'user.updated': {
        // Handle user updates - update database record
        const { email_addresses, phone_numbers, first_name, last_name } = evt.data

        const email = email_addresses?.[0]?.email_address
        const phone = phone_numbers?.[0]?.phone_number || null
        const fullName = first_name && last_name ? `${first_name} ${last_name}` : null

        if (!email) {
          console.error('User updated event missing email address')
          return new Response('Invalid user data: email required', { status: 400 })
        }

        const supabase = createAdminClient()

        // Update user record
        const { error } = await supabase
          .from('users')
          .update({
            email,
            phone,
            full_name: fullName,
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_user_id', id || '')

        if (error) {
          console.error('Failed to update user in database:', error)
          return new Response('Database sync failed', { status: 500 })
        }

        console.warn(`User updated successfully: ${id}`)
        break
      }

      case 'user.deleted': {
        // Handle user deletion - soft delete by updating user record
        // Note: We don't actually delete the user record to preserve data integrity
        // Instead, we could add a deleted_at column in the future for soft deletes
        // For now, we'll just log the deletion
        console.warn(`User deleted event received: ${id}`)
        // Future: Implement soft delete when deleted_at column is added
        break
      }

      case 'session.created':
        // Handle session creation - track user activity (optional, can be implemented later)
        console.warn(`Session created for user: ${id}`)
        break

      case 'session.ended':
        // Handle session ending - update session records (optional, can be implemented later)
        console.warn(`Session ended for user: ${id}`)
        break

      default:
        // Log unhandled events for future implementation
        console.warn(`Unhandled webhook event type: ${eventType}`)
    }

    return new Response('', { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
