// Payment Test Fixtures
export const paymentFixtures = {
  creditLimit: {
    currentLimit: 50000,
    usedAmount: 15000,
    availableAmount: 35000,
    lastUpdated: '2024-01-20T10:30:00Z',
  },

  paymentSchedule: [
    {
      id: 'schedule_1',
      installmentAmount: 2500,
      totalAmount: 15000,
      remainingAmount: 12500,
      dueDate: '2024-02-15T00:00:00Z',
      status: 'pending' as const,
      installmentNumber: 1,
      totalInstallments: 6,
    },
    {
      id: 'schedule_2',
      installmentAmount: 2500,
      totalAmount: 15000,
      remainingAmount: 10000,
      dueDate: '2024-03-15T00:00:00Z',
      status: 'pending' as const,
      installmentNumber: 2,
      totalInstallments: 6,
    },
  ],

  transaction: {
    id: 'txn_123',
    amount: 15000,
    currency: 'ETB',
    type: 'purchase' as const,
    status: 'completed' as const,
    description: 'Purchase at TechStore Ethiopia',
    merchantId: 'merchant_456',
    merchantName: 'TechStore Ethiopia',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:35:00Z',
    paymentSchedule: [
      {
        id: 'schedule_1',
        installmentAmount: 2500,
        totalAmount: 15000,
        remainingAmount: 12500,
        dueDate: '2024-02-15T00:00:00Z',
        status: 'pending' as const,
        installmentNumber: 1,
        totalInstallments: 6,
      },
    ],
  },

  transactions: {
    transactions: [
      {
        id: 'txn_123',
        amount: 15000,
        currency: 'ETB',
        type: 'purchase' as const,
        status: 'completed' as const,
        description: 'Purchase at TechStore Ethiopia',
        merchantId: 'merchant_456',
        merchantName: 'TechStore Ethiopia',
        createdAt: '2024-01-15T14:30:00Z',
        updatedAt: '2024-01-15T14:35:00Z',
      },
      {
        id: 'txn_124',
        amount: 2500,
        currency: 'ETB',
        type: 'payment' as const,
        status: 'completed' as const,
        description: 'Installment payment',
        merchantId: 'merchant_456',
        merchantName: 'TechStore Ethiopia',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:05:00Z',
      },
    ],
    total: 2,
  },
};
