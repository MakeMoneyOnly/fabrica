// Authentication Validation Schemas
import { z } from 'zod';

// Ethiopian phone number validation
const ethiopianPhoneRegex = /^\+251[0-9]{9}$/;

// Password strength requirements for FinTech
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// Ethiopian name validation (supports both Latin and Amharic scripts)
const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters long')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[\p{L}\p{M}\s'-]+$/u, 'Name contains invalid characters')
  .transform((val) => val.trim());

// Login credentials validation
export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(ethiopianPhoneRegex, 'Please enter a valid Ethiopian phone number (+251XXXXXXXXX)'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// Registration validation
export const registerSchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(ethiopianPhoneRegex, 'Please enter a valid Ethiopian phone number (+251XXXXXXXXX)'),
    email: z
      .string()
      .email('Please enter a valid email address')
      .optional()
      .or(z.literal('')),
    firstName: nameSchema,
    lastName: nameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    userType: z.enum(['customer', 'merchant'], {
      errorMap: () => ({ message: 'Please select a valid user type' }),
    }),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterData = z.infer<typeof registerSchema>;

// OTP verification validation
export const otpVerificationSchema = z.object({
  phoneNumber: z
    .string()
    .regex(ethiopianPhoneRegex, 'Please enter a valid Ethiopian phone number (+251XXXXXXXXX)'),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^[0-9]{6}$/, 'OTP must contain only digits'),
});

export type OtpVerification = z.infer<typeof otpVerificationSchema>;

// Password reset validation
export const passwordResetSchema = z.object({
  phoneNumber: z
    .string()
    .regex(ethiopianPhoneRegex, 'Please enter a valid Ethiopian phone number (+251XXXXXXXXX)'),
});

export type PasswordResetRequest = z.infer<typeof passwordResetSchema>;

export const passwordResetConfirmSchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(ethiopianPhoneRegex, 'Please enter a valid Ethiopian phone number (+251XXXXXXXXX)'),
    otp: z
      .string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^[0-9]{6}$/, 'OTP must contain only digits'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

export type PasswordResetConfirm = z.infer<typeof passwordResetConfirmSchema>;

// KYC validation schemas
export const kycPersonalInfoSchema = z.object({
  idNumber: z
    .string()
    .min(8, 'ID number must be at least 8 characters')
    .max(20, 'ID number must not exceed 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'ID number contains invalid characters'),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date in YYYY-MM-DD format')
    .refine((date) => {
      const dob = new Date(date);
      const now = new Date();
      const age = now.getFullYear() - dob.getFullYear();
      return age >= 18 && age <= 100;
    }, 'You must be at least 18 years old'),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters long')
    .max(200, 'Address must not exceed 200 characters'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters long')
    .max(50, 'City must not exceed 50 characters'),
  region: z
    .string()
    .min(2, 'Region must be at least 2 characters long')
    .max(50, 'Region must not exceed 50 characters'),
});

export type KycPersonalInfo = z.infer<typeof kycPersonalInfoSchema>;

// Security utility functions
export const securityUtils = {
  // Sanitize input to prevent XSS
  sanitizeInput: (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Validate Ethiopian phone number format
  isValidEthiopianPhone: (phone: string): boolean => {
    return ethiopianPhoneRegex.test(phone);
  },

  // Mask sensitive data for logging
  maskPhoneNumber: (phone: string): string => {
    if (phone.length < 10) return phone;
    return phone.replace(/(\+251\d{3})\d{4}(\d{3})/, '$1****$2');
  },

  maskEmail: (email: string): string => {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return `${local.substring(0, 2)}***@${domain}`;
  },

  // Generate secure random string
  generateSecureToken: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};
