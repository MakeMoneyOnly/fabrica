export interface User {
  id: string;
  email: string;
  name: {
    firstName: string;
    lastName: string;
    displayName?: string;
  };
  profile: {
    avatar?: string;
    bio?: string;
    location?: string;
    timezone?: string;
    language: 'en' | 'am';
  };
  userType: 'creator' | 'merchant' | 'both';
  phone?: string;
  isVerified: boolean;
  isEthiopian: boolean;
  preferences: {
    currency: 'ETB' | 'USD';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      profileVisible: boolean;
      contactInfoVisible: boolean;
    };
  };
  ethVerification?: {
    diditVerified: boolean;
    faydaVerified: boolean;
    licenseVerified: boolean;
  };
  store?: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    subscriptionTier: 'free' | 'starter' | 'premium';
  };
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  sessionExpired: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  verifyEthiopianAccount: (verificationData: EthVerificationData) => Promise<void>;
  clearError: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'creator' | 'merchant' | 'both';
  language: 'en' | 'am';
  isEthiopian: boolean;
  termsAccepted: boolean;
}

export interface EthVerificationData {
  provider: 'didit' | 'fayda' | 'manual';
  documents?: File[];
  licenseNumber?: string;
  businessType?: string;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'telebirr' | 'webirr' | 'cbe_birr' | 'amole' | 'international';
  isDefault: boolean;
  isVerified: boolean;
  lastUsed?: Date;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  isActive: boolean;
  subscriptionTier: 'free' | 'starter' | 'premium';
  customDomain?: string;
  settings: {
    currency: 'ETB' | 'USD';
    timezone: string;
    language: 'en' | 'am';
    theme: 'light' | 'dark' | 'auto';
    analytics: boolean;
  };
  stats: {
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    customerCount: number;
  };
  paymentMethods: PaymentMethod[];
  createdAt: Date;
  updatedAt: Date;
}
