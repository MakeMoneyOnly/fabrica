/**
 * Diagnostic script to check Clerk configuration
 * Run with: node scripts/check-clerk-config.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local')
let envVars = {}

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim()
      }
    }
  })
} else {
  console.error('❌ .env.local file not found!')
  process.exit(1)
}

console.log('\n🔍 Checking Clerk Configuration...\n')

// Check publishable key
const publishableKey = envVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
console.log('📋 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:')
console.log(`   Exists: ${publishableKey ? '✅ Yes' : '❌ No'}`)
console.log(`   Length: ${publishableKey.length}`)
console.log(`   Value: ${publishableKey.substring(0, 20)}...${publishableKey.substring(publishableKey.length - 10)}`)
console.log(`   Starts with pk_test_: ${publishableKey.startsWith('pk_test_') ? '✅' : '❌'}`)
console.log(`   Starts with pk_live_: ${publishableKey.startsWith('pk_live_') ? '✅' : '❌'}`)
console.log(`   Contains "your_": ${publishableKey.includes('your_') ? '❌ Yes (INVALID)' : '✅ No'}`)
console.log(`   Contains "xxx": ${publishableKey.includes('xxx') ? '❌ Yes (INVALID)' : '✅ No'}`)

// Validation check
const isValid =
  !!publishableKey &&
  publishableKey.length > 20 &&
  (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_')) &&
  !publishableKey.includes('your_') &&
  !publishableKey.includes('xxx')

console.log(`\n✅ Valid: ${isValid ? 'YES' : 'NO'}`)

if (!isValid) {
  console.log('\n❌ Issues found:')
  if (!publishableKey) {
    console.log('   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing')
  }
  if (publishableKey.length <= 20) {
    console.log(`   - Key is too short (${publishableKey.length} characters, need > 20)`)
  }
  if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
    console.log('   - Key does not start with pk_test_ or pk_live_')
  }
  if (publishableKey.includes('your_') || publishableKey.includes('xxx')) {
    console.log('   - Key contains placeholder text (your_ or xxx)')
  }
}

// Check secret key
const secretKey = envVars.CLERK_SECRET_KEY || ''
console.log('\n📋 CLERK_SECRET_KEY:')
console.log(`   Exists: ${secretKey ? '✅ Yes' : '❌ No'}`)
console.log(`   Length: ${secretKey.length}`)
console.log(`   Starts with sk_test_: ${secretKey.startsWith('sk_test_') ? '✅' : '❌'}`)
console.log(`   Starts with sk_live_: ${secretKey.startsWith('sk_live_') ? '✅' : '❌'}`)

// Check webhook secret
const webhookSecret = envVars.CLERK_WEBHOOK_SECRET || ''
console.log('\n📋 CLERK_WEBHOOK_SECRET:')
console.log(`   Exists: ${webhookSecret ? '✅ Yes' : '❌ No'}`)
console.log(`   Length: ${webhookSecret.length}`)
console.log(`   Starts with whsec_: ${webhookSecret.startsWith('whsec_') ? '✅' : '❌'}`)

console.log('\n' + '='.repeat(50))
if (isValid && secretKey && webhookSecret) {
  console.log('✅ Clerk is properly configured!')
  console.log('\n💡 If the button still doesn\'t work:')
  console.log('   1. Make sure you restarted your dev server after updating .env.local')
  console.log('   2. Check browser console for errors')
  console.log('   3. Verify ClerkProvider is wrapping your app in layout.tsx')
} else {
  console.log('❌ Clerk configuration has issues. Fix the problems above.')
}
console.log('='.repeat(50) + '\n')

