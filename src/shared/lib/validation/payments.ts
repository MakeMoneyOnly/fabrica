// Payment Validation Schemas for BNPL
import { z } from 'zod';

// Ethiopian Birr validation (no floats for currency)
const etbAmountSchema = z
  .number()
  .int('Amount must be a whole number (no cents)')
  .min(1, 'Amount must be at least 1 ETB')
  .max(1000000, 'Amount cannot exceed 1,000,000 ETB');

// Payment request validation
export const paymentRequestSchema = z
  .object({
    amount: etbAmountSchema,
    currency: z.literal('ETB', {
      errorMap: () => ({ message: 'Only Ethiopian Birr (ETB) is supported' }),
    }),
    description: z
      .string()
      .min(3, 'Description must be at least 3 characters long')
      .max(200, 'Description must not exceed 200 characters')
      .regex(/^[\p{L}\p{N}\s.,!?-]+$/u, 'Description contains invalid characters'),
    merchantId: z
      .string()
      .uuid('Invalid merchant ID format'),
    paymentSchedule: z
      .object({
        installments: z
          .number()
          .int()
          .min(1, 'At least 1 installment required')
          .max(24, 'Maximum 24 installments allowed'),
        frequency: z.enum(['weekly', 'monthly'], {
          errorMap: () => ({ message: 'Payment frequency must be weekly or monthly' }),
        }),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Validate minimum installment amount based on total
      if (data.paymentSchedule) {
        const minInstallmentAmount = Math.ceil(data.amount / data.paymentSchedule.installments);
        return minInstallmentAmount >= 100; // Minimum 100 ETB per installment
      }
      return true;
    },
    {
      message: 'Installment amount cannot be less than 100 ETB',
      path: ['paymentSchedule'],
    }
  );

export type PaymentRequest = z.infer<typeof paymentRequestSchema>;

// Installment payment validation
export const installmentPaymentSchema = z.object({
  scheduleId: z.string().uuid('Invalid schedule ID format'),
  amount: etbAmountSchema,
  paymentMethodId: z.string().uuid('Invalid payment method ID').optional(),
});

export type InstallmentPayment = z.infer<typeof installmentPaymentSchema>;

// Credit limit check validation
export const creditCheckSchema = z.object({
  amount: etbAmountSchema,
  merchantId: z.string().uuid('Invalid merchant ID format'),
  userId: z.string().uuid('Invalid user ID format').optional(),
});

export type CreditCheck = z.infer<typeof creditCheckSchema>;

// Transaction query validation
export const transactionQuerySchema = z.object({
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(20),
  offset: z
    .number()
    .int()
    .min(0, 'Offset must be non-negative')
    .optional()
    .default(0),
  status: z
    .enum(['pending', 'completed', 'failed', 'cancelled'])
    .optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional(),
  merchantId: z
    .string()
    .uuid('Invalid merchant ID format')
    .optional(),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;

// Refund request validation
export const refundRequestSchema = z
  .object({
    transactionId: z.string().uuid('Invalid transaction ID format'),
    amount: etbAmountSchema,
    reason: z
      .string()
      .min(10, 'Refund reason must be at least 10 characters long')
      .max(500, 'Refund reason must not exceed 500 characters')
      .regex(/^[\p{L}\p{N}\s.,!?-]+$/u, 'Reason contains invalid characters'),
    description: z
      .string()
      .max(1000, 'Description must not exceed 1000 characters')
      .optional(),
  })
  .refine(
    (data) => {
      // Additional business logic validation can be added here
      return true;
    },
    {
      message: 'Invalid refund request',
    }
  );

export type RefundRequest = z.infer<typeof refundRequestSchema>;

// Payment method validation
export const paymentMethodSchema = z.object({
  type: z.enum(['telebirr', 'cbe_mobile', 'cbe_bank', 'dashen_bank', 'awash_bank'], {
    errorMap: () => ({
      message: 'Invalid payment method. Supported: TeleBirr, CBE Mobile, CBE Bank, Dashen Bank, Awash Bank',
    }),
  }),
  accountNumber: z
    .string()
    .min(9, 'Account number must be at least 9 digits')
    .max(20, 'Account number must not exceed 20 characters')
    .regex(/^[0-9A-Z]+$/, 'Account number contains invalid characters'),
  accountHolderName: z
    .string()
    .min(2, 'Account holder name must be at least 2 characters')
    .max(100, 'Account holder name must not exceed 100 characters')
    .regex(/^[\p{L}\p{M}\s'-]+$/u, 'Account holder name contains invalid characters'),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// BNPL-specific validation utilities
export const bnplValidation = {
  // Validate installment schedule against business rules
  validateInstallmentSchedule: (
    totalAmount: number,
    installments: number,
    frequency: 'weekly' | 'monthly'
  ): { valid: boolean; reason?: string } => {
    const minInstallmentAmount = Math.ceil(totalAmount / installments);

    // Business rules
    if (minInstallmentAmount < 100) {
      return { valid: false, reason: 'Installment amount cannot be less than 100 ETB' };
    }

    if (frequency === 'weekly' && installments > 52) {
      return { valid: false, reason: 'Weekly payments cannot exceed 52 weeks (1 year)' };
    }

    if (frequency === 'monthly' && installments > 24) {
      return { valid: false, reason: 'Monthly payments cannot exceed 24 months (2 years)' };
    }

    return { valid: true };
  },

  // Calculate total interest and fees
  calculatePaymentSchedule: (
    principal: number,
    installments: number,
    annualInterestRate: number = 0.12 // 12% APR
  ) => {
    const monthlyRate = annualInterestRate / 12;
    const installmentAmount = Math.ceil(
      (principal * monthlyRate * Math.pow(1 + monthlyRate, installments)) /
        (Math.pow(1 + monthlyRate, installments) - 1)
    );

    const totalAmount = installmentAmount * installments;
    const totalInterest = totalAmount - principal;

    return {
      installmentAmount,
      totalAmount,
      totalInterest,
      principal,
      installments,
    };
  },

  // Validate credit utilization
  validateCreditUtilization: (
    requestedAmount: number,
    availableCredit: number,
    existingDebt: number
  ): { approved: boolean; reason?: string; utilizationRate: number } => {
    const totalUtilization = (existingDebt + requestedAmount) / (availableCredit + existingDebt);
    const newUtilization = requestedAmount / availableCredit;

    // Business rules for credit utilization
    if (totalUtilization > 0.9) {
      return {
        approved: false,
        reason: 'Credit utilization would exceed 90%',
        utilizationRate: totalUtilization,
      };
    }

    if (newUtilization > 0.5) {
      return {
        approved: false,
        reason: 'Single transaction cannot exceed 50% of available credit',
        utilizationRate: newUtilization,
      };
    }

    return {
      approved: true,
      utilizationRate: newUtilization,
    };
  },
};
