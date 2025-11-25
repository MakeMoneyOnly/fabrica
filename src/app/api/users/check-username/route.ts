import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { usernameSchema } from '@/lib/validations/onboarding'

/**
 * Check username availability
 * GET /api/users/check-username?username=johndoe
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // Validate username format
    const validation = usernameSchema.safeParse(username)
    if (!validation.success) {
      return NextResponse.json(
        {
          available: false,
          error: validation.error.issues[0].message,
        },
        { status: 200 }
      )
    }

    // Check if username exists in database
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username.toLowerCase())
      .maybeSingle()

    if (error) {
      console.error('Error checking username:', error)
      return NextResponse.json({ error: 'Failed to check username availability' }, { status: 500 })
    }

    const available = !data

    // Generate suggestions if username is taken
    let suggestions: string[] = []
    if (!available) {
      suggestions = [
        `${username}${Math.floor(Math.random() * 100)}`,
        `${username}${Math.floor(Math.random() * 1000)}`,
        `${username}_official`,
        `the_${username}`,
      ]
    }

    return NextResponse.json({
      available,
      username: username.toLowerCase(),
      suggestions: available ? [] : suggestions,
    })
  } catch (error) {
    console.error('Error in check-username API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
