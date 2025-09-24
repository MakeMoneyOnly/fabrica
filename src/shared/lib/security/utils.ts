// Security Utilities for FinTech Application
import CryptoJS from 'crypto-js';

// Security constants
export const SECURITY_CONSTANTS = {
  SALT_ROUNDS: 12,
  JWT_EXPIRY: '24h',
  REFRESH_TOKEN_EXPIRY: '7d',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  OTP_EXPIRY: 5 * 60 * 1000, // 5 minutes
} as const;

// Encryption utilities
export const encryption = {
  // Encrypt sensitive data
  encrypt: (data: string, key: string): string => {
    return CryptoJS.AES.encrypt(data, key).toString();
  },

  // Decrypt sensitive data
  decrypt: (encryptedData: string, key: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  },

  // Hash sensitive data (one-way)
  hash: (data: string, saltRounds: number = SECURITY_CONSTANTS.SALT_ROUNDS): string => {
    return CryptoJS.SHA256(data).toString();
  },

  // Generate secure random string
  generateSecureToken: (length: number = 32): string => {
    return CryptoJS.lib.WordArray.random(length).toString();
  },
};

// Input sanitization utilities
export const sanitization = {
  // Sanitize HTML input to prevent XSS
  sanitizeHtml: (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Sanitize SQL input (basic)
  sanitizeSql: (input: string): string => {
    return input.replace(/['";\\]/g, '');
  },

  // Sanitize filename
  sanitizeFilename: (filename: string): string => {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  },

  // Remove null bytes and control characters
  removeControlChars: (input: string): string => {
    return input.replace(/[\x00-\x1F\x7F]/g, '');
  },
};

// Data masking utilities (for logging and display)
export const masking = {
  // Mask phone number
  maskPhoneNumber: (phone: string): string => {
    if (!phone || phone.length < 10) return phone;
    return phone.replace(/(\+251\d{3})\d{4}(\d{3})/, '$1****$2');
  },

  // Mask email
  maskEmail: (email: string): string => {
    if (!email || !email.includes('@')) return email;
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return `${local.substring(0, 2)}***@${domain}`;
  },

  // Mask credit card number
  maskCardNumber: (cardNumber: string): string => {
    if (!cardNumber || cardNumber.length < 12) return cardNumber;
    return `****-****-****-${cardNumber.slice(-4)}`;
  },

  // Mask account number
  maskAccountNumber: (accountNumber: string): string => {
    if (!accountNumber || accountNumber.length < 8) return accountNumber;
    return `***${accountNumber.slice(-4)}`;
  },

  // Mask ID number
  maskIdNumber: (idNumber: string): string => {
    if (!idNumber || idNumber.length < 6) return idNumber;
    return `${idNumber.substring(0, 2)}***${idNumber.slice(-2)}`;
  },
};

// Rate limiting utilities
export const rateLimit = {
  // Simple in-memory rate limiter (use Redis in production)
  attempts: new Map<string, { count: number; resetTime: number }>(),

  // Check if request should be rate limited
  checkLimit: (key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
    const now = Date.now();
    const attempt = rateLimit.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      // First attempt or window expired
      rateLimit.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return false;
    }

    if (attempt.count >= maxAttempts) {
      return true; // Rate limited
    }

    attempt.count++;
    return false;
  },

  // Reset rate limit for a key
  resetLimit: (key: string): void => {
    rateLimit.attempts.delete(key);
  },

  // Get remaining attempts
  getRemainingAttempts: (key: string, maxAttempts: number = 5): number => {
    const attempt = rateLimit.attempts.get(key);
    if (!attempt) return maxAttempts;
    return Math.max(0, maxAttempts - attempt.count);
  },
};

// Session security utilities
export const sessionSecurity = {
  // Generate secure session ID
  generateSessionId: (): string => {
    return encryption.generateSecureToken(64);
  },

  // Validate session expiry
  isSessionExpired: (createdAt: Date, maxAge: number = 24 * 60 * 60 * 1000): boolean => {
    return Date.now() - createdAt.getTime() > maxAge;
  },

  // Secure cookie options
  getSecureCookieOptions: (maxAge?: number) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: maxAge || 24 * 60 * 60 * 1000, // 24 hours
  }),
};

// Password security utilities
export const passwordSecurity = {
  // Validate password strength
  validatePasswordStrength: (password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push('Password must be at least 8 characters long');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Password must contain lowercase letters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Password must contain uppercase letters');

    if (/[0-9]/.test(password)) score++;
    else feedback.push('Password must contain numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else feedback.push('Password must contain special characters');

    return {
      isValid: score >= 4,
      score,
      feedback,
    };
  },

  // Generate password reset token
  generatePasswordResetToken: (): string => {
    return encryption.generateSecureToken(32);
  },
};

// API security utilities
export const apiSecurity = {
  // Generate API key
  generateApiKey: (): string => {
    return `fabrica_${encryption.generateSecureToken(32)}`;
  },

  // Validate API key format
  isValidApiKeyFormat: (apiKey: string): boolean => {
    return apiKey.startsWith('fabrica_') && apiKey.length === 39; // 'fabrica_' + 32 chars
  },

  // Hash API key for storage
  hashApiKey: (apiKey: string): string => {
    return encryption.hash(apiKey);
  },

  // Generate request signature
  generateRequestSignature: (payload: string, secret: string): string => {
    return CryptoJS.HmacSHA256(payload, secret).toString();
  },

  // Verify request signature
  verifyRequestSignature: (payload: string, signature: string, secret: string): boolean => {
    const expectedSignature = apiSecurity.generateRequestSignature(payload, secret);
    return CryptoJS.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  },
};

// Audit logging utilities
export const auditLog = {
  // Log security events
  logSecurityEvent: (event: string, details: Record<string, any>, userId?: string): void => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      userId: userId ? masking.maskIdNumber(userId) : undefined,
      details: {
        ...details,
        ip: details.ip ? masking.maskPhoneNumber(details.ip) : undefined,
        userAgent: details.userAgent,
      },
      environment: process.env.NODE_ENV,
    };

    console.log('[SECURITY AUDIT]', JSON.stringify(logEntry));
  },

  // Log authentication events
  logAuthEvent: (event: 'login' | 'logout' | 'failed_login', userId?: string, details?: Record<string, any>): void => {
    auditLog.logSecurityEvent(`auth_${event}`, details || {}, userId);
  },

  // Log payment events
  logPaymentEvent: (event: string, amount: number, userId: string, merchantId: string): void => {
    auditLog.logSecurityEvent(`payment_${event}`, {
      amount,
      merchantId: masking.maskIdNumber(merchantId),
    }, userId);
  },
};

export default {
  encryption,
  sanitization,
  masking,
  rateLimit,
  sessionSecurity,
  passwordSecurity,
  apiSecurity,
  auditLog,
};
