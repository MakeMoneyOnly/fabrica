// Payments Business Logic Hooks
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, PaymentRequest } from './api';
import { useRouter } from 'next/navigation';

// Query Keys
export const paymentsQueryKeys = {
  creditLimit: ['payments', 'creditLimit'] as const,
  paymentSchedule: ['payments', 'schedule'] as const,
  transactions: ['payments', 'transactions'] as const,
  transaction: (id: string) => ['payments', 'transaction', id] as const,
  paymentMethods: ['payments', 'methods'] as const,
};

// Custom hooks for payments
export const usePayments = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get credit limit
  const {
    data: creditLimit,
    isLoading: isLoadingCreditLimit,
    error: creditLimitError,
    refetch: refetchCreditLimit,
  } = useQuery({
    queryKey: paymentsQueryKeys.creditLimit,
    queryFn: () => paymentsApi.getCreditLimit().then(res => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Get payment schedule
  const {
    data: paymentSchedule,
    isLoading: isLoadingSchedule,
    error: scheduleError,
    refetch: refetchSchedule,
  } = useQuery({
    queryKey: paymentsQueryKeys.paymentSchedule,
    queryFn: () => paymentsApi.getPaymentSchedule().then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get transactions
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: paymentsQueryKeys.transactions,
    queryFn: () => paymentsApi.getTransactions({ limit: 20 }).then(res => res.data),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Get payment methods
  const {
    data: paymentMethods,
    isLoading: isLoadingMethods,
    error: methodsError,
  } = useQuery({
    queryKey: paymentsQueryKeys.paymentMethods,
    queryFn: () => paymentsApi.getPaymentMethods().then(res => res.data),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: (paymentData: PaymentRequest) =>
      paymentsApi.createPayment(paymentData).then(res => res.data),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: paymentsQueryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: paymentsQueryKeys.creditLimit });
      queryClient.invalidateQueries({ queryKey: paymentsQueryKeys.paymentSchedule });

      // Redirect to payment URL or success page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        router.push(`/payments/success?transaction=${data.transactionId}`);
      }
    },
    onError: (error) => {
      console.error('Payment creation failed:', error);
    },
  });

  // Pay installment mutation
  const payInstallmentMutation = useMutation({
    mutationFn: ({ scheduleId, amount }: { scheduleId: string; amount: number }) =>
      paymentsApi.payInstallment(scheduleId, amount).then(res => res.data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: paymentsQueryKeys.paymentSchedule });
      queryClient.invalidateQueries({ queryKey: paymentsQueryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: paymentsQueryKeys.creditLimit });
    },
    onError: (error) => {
      console.error('Installment payment failed:', error);
    },
  });

  // Validate payment mutation
  const validatePaymentMutation = useMutation({
    mutationFn: ({ amount, merchantId }: { amount: number; merchantId: string }) =>
      paymentsApi.validatePayment(amount, merchantId).then(res => res.data),
  });

  return {
    // Data
    creditLimit,
    paymentSchedule,
    transactions,
    paymentMethods,

    // Loading states
    isLoading: isLoadingCreditLimit || isLoadingSchedule || isLoadingTransactions || isLoadingMethods,
    isLoadingCreditLimit,
    isLoadingSchedule,
    isLoadingTransactions,
    isLoadingMethods,

    // Errors
    creditLimitError,
    scheduleError,
    transactionsError,
    methodsError,

    // Actions
    createPayment: createPaymentMutation.mutate,
    payInstallment: payInstallmentMutation.mutate,
    validatePayment: validatePaymentMutation.mutate,

    // Action loading states
    isCreatingPayment: createPaymentMutation.isPending,
    isPayingInstallment: payInstallmentMutation.isPending,
    isValidatingPayment: validatePaymentMutation.isPending,

    // Action errors
    createPaymentError: createPaymentMutation.error,
    payInstallmentError: payInstallmentMutation.error,
    validatePaymentError: validatePaymentMutation.error,

    // Refetch functions
    refetchCreditLimit,
    refetchSchedule,
    refetchTransactions,
  };
};

// Hook for transaction details
export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: paymentsQueryKeys.transaction(id),
    queryFn: () => paymentsApi.getTransaction(id).then(res => res.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
