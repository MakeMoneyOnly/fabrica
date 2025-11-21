import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  // Get the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local')
  }

  // Get the headers (await since headers() returns a Promise in App Router)
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
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
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Get the ID and type
  const { id } = evt.data
  const eventType = evt.type

  // Log webhook details for debugging and audit purposes
  // Using console.warn to make these visible in production logs
  console.warn(`Webhook received: ID=${id}, Type=${eventType}`)
  console.warn('Webhook payload:', body)

  // Handle different webhook events
  // TODO: Implement actual database operations for each event type
  switch (eventType) {
    case 'user.created':
      // Handle user creation - sync to database
      console.warn('Processing user.created event:', evt.data)
      break

    case 'user.updated':
      // Handle user updates - update database record
      console.warn('Processing user.updated event:', evt.data)
      break

    case 'user.deleted':
      // Handle user deletion - soft delete or remove from database
      console.warn('Processing user.deleted event:', evt.data)
      break

    case 'session.created':
      // Handle session creation - track user activity
      console.warn('Processing session.created event:', evt.data)
      break

    case 'session.ended':
      // Handle session ending - update session records
      console.warn('Processing session.ended event:', evt.data)
      break

    default:
      // Log unhandled events for future implementation
      console.warn(`Unhandled webhook event type: ${eventType}`)
  }

  return new Response('', { status: 200 })
}
