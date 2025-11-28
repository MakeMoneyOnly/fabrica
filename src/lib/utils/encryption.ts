import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

/**
 * Get encryption key from environment variable
 * In production, this should be a secure, randomly generated key
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }

  // Ensure key is exactly 32 bytes
  return Buffer.from(key.padEnd(KEY_LENGTH, '0').slice(0, KEY_LENGTH))
}

/**
 * Encrypt sensitive data (e.g., payment account information)
 * Returns base64-encoded encrypted string with IV and auth tag
 */
export function encrypt(plaintext: string): string {
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    // Combine IV + encrypted data + auth tag
    const combined = Buffer.concat([iv, Buffer.from(encrypted, 'hex'), authTag])

    return combined.toString('base64')
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt encrypted data
 * Expects base64-encoded string with IV and auth tag
 */
export function decrypt(encryptedData: string): string {
  try {
    const key = getEncryptionKey()
    const combined = Buffer.from(encryptedData, 'base64')

    // Extract IV, encrypted data, and auth tag
    const iv = combined.subarray(0, IV_LENGTH)
    const authTag = combined.subarray(combined.length - AUTH_TAG_LENGTH)
    const encrypted = combined.subarray(IV_LENGTH, combined.length - AUTH_TAG_LENGTH)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Hash sensitive data for comparison (one-way)
 * Useful for storing payment account numbers securely
 */
export function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Mask sensitive data for display
 * Example: "0911234567" -> "091****567"
 */
export function maskSensitiveData(data: string, visibleStart = 3, visibleEnd = 3): string {
  if (data.length <= visibleStart + visibleEnd) {
    return data
  }

  const start = data.slice(0, visibleStart)
  const end = data.slice(-visibleEnd)
  const masked = '*'.repeat(Math.min(data.length - visibleStart - visibleEnd, 4))

  return `${start}${masked}${end}`
}
