// User Test Fixtures
export const userFixtures = {
  customer: {
    id: 'user_123',
    phoneNumber: '+251911123456',
    email: 'customer@fabrica.et',
    firstName: 'Abebe',
    lastName: 'Kebede',
    userType: 'customer' as const,
    isVerified: true,
    kycStatus: 'approved' as const,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },

  merchant: {
    id: 'user_456',
    phoneNumber: '+251922654321',
    email: 'merchant@fabrica.et',
    firstName: 'Tigist',
    lastName: 'Mengistu',
    userType: 'merchant' as const,
    isVerified: true,
    kycStatus: 'approved' as const,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
  },

  unverified: {
    id: 'user_789',
    phoneNumber: '+251933789012',
    email: 'newuser@fabrica.et',
    firstName: 'Dawit',
    lastName: 'Haile',
    userType: 'customer' as const,
    isVerified: false,
    kycStatus: 'pending' as const,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
  },
};
