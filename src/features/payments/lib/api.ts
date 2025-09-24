// Payments API Service
import { apiClient, ApiResponse } from '@/shared/api/client';

// Types
export interface PaymentSchedule {
  id: string;
  installmentAmount: number;
  totalAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  installmentNumber: number;
  totalInstallments: number;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: 'purchase' | 'payment' | 'refund' | 'fee';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  merchantId: string;
  merchantName: string;
  createdAt: string;
  updatedAt: string;
  paymentSchedule?: PaymentSchedule[];
}

export interface CreditLimit {
  currentLimit: number;
  usedAmount: number;
  availableAmount: number;
  lastUpdated: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  merchantId: string;
  paymentSchedule?: {
    installments: number;
    frequency: 'weekly' | 'monthly';
  };
}

// API Functions
export const paymentsApi = {
  /**
   * Get user's credit limit
   */
  async getCreditLimit(): Promise<ApiResponse<CreditLimit>> {
    const response = await apiClient.get('/payments/credit-limit');
    return response.data;
  },

  /**
   * Get user's payment schedule
   */
  async getPaymentSchedule(): Promise<ApiResponse<PaymentSchedule[]>> {
    const response = await apiClient.get('/payments/schedule');
    return response.data;
  },

  /**
   * Get user's transactions
   */
  async getTransactions(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ transactions: Transaction[]; total: number }>> {
    const response = await apiClient.get('/payments/transactions', { params });
    return response.data;
  },

  /**
   * Get specific transaction details
   */
  async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.get(`/payments/transactions/${id}`);
    return response.data;
  },

  /**
   * Create a payment request
   */
  async createPayment(paymentData: PaymentRequest): Promise<ApiResponse<{ transactionId: string; paymentUrl: string }>> {
    const response = await apiClient.post('/payments/create', paymentData);
    return response.data;
  },

  /**
   * Pay installment
   */
  async payInstallment(scheduleId: string, amount: number): Promise<ApiResponse<{ transactionId: string }>> {
    const response = await apiClient.post(`/payments/schedule/${scheduleId}/pay`, { amount });
    return response.data;
  },

  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<ApiResponse<{ methods: string[] }>> {
    const response = await apiClient.get('/payments/methods');
    return response.data;
  },

  /**
   * Validate payment amount against credit limit
   */
  async validatePayment(amount: number, merchantId: string): Promise<ApiResponse<{ valid: boolean; reason?: string }>> {
    const response = await apiClient.post('/payments/validate', { amount, merchantId });
    return response.data;
  },
};
