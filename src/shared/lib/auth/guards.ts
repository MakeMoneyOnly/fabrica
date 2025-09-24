// Authentication Guards and Route Protection
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/features/auth/lib/hooks';

// Types for route protection
export type UserRole = 'customer' | 'merchant' | 'admin';
export type AuthRequirement = 'authenticated' | 'unauthenticated' | 'optional';

export interface RouteProtection {
  requireAuth: AuthRequirement;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallbackRoute?: string;
}

// Authentication guard hook
export const useAuthGuard = (protection: RouteProtection) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Still loading, don't redirect yet

    const isAuthRequired = protection.requireAuth === 'authenticated';
    const isAuthForbidden = protection.requireAuth === 'unauthenticated';

    // Check authentication requirements
    if (isAuthRequired && !isAuthenticated) {
      // User needs to be authenticated but isn't
      router.push(protection.redirectTo || '/auth/login');
      return;
    }

    if (isAuthForbidden && isAuthenticated) {
      // User should not be authenticated but is
      router.push(protection.fallbackRoute || '/app/dashboard');
      return;
    }

    // Check role-based access
    if (isAuthenticated && protection.allowedRoles && user) {
      if (!protection.allowedRoles.includes(user.userType as UserRole)) {
        // User doesn't have required role
        router.push('/unauthorized');
        return;
      }
    }

    // Additional checks can be added here (KYC status, etc.)
    if (isAuthenticated && user && protection.requireAuth === 'authenticated') {
      // For BNPL, ensure user has completed KYC for financial operations
      if (user.kycStatus === 'pending' && protection.allowedRoles?.includes('customer')) {
        router.push('/app/kyc/pending');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router, protection]);

  return {
    isAllowed: !isLoading && checkAccess(isAuthenticated, user, protection),
    isLoading,
    user,
  };
};

// Utility function to check access
function checkAccess(
  isAuthenticated: boolean,
  user: any,
  protection: RouteProtection
): boolean {
  const isAuthRequired = protection.requireAuth === 'authenticated';
  const isAuthForbidden = protection.requireAuth === 'unauthenticated';

  if (isAuthRequired && !isAuthenticated) return false;
  if (isAuthForbidden && isAuthenticated) return false;

  if (isAuthenticated && protection.allowedRoles && user) {
    if (!protection.allowedRoles.includes(user.userType as UserRole)) return false;
  }

  return true;
}

// Higher-order component for protecting pages
export const withAuthGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  protection: RouteProtection
) => {
  return function ProtectedComponent(props: P) {
    const { isAllowed, isLoading } = useAuthGuard(protection);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAllowed) {
      return null; // Guard will handle redirect
    }

    return <WrappedComponent {...props} />;
  };
};

// Route protection configurations for common scenarios
export const routeProtection = {
  // Public routes
  public: {
    requireAuth: 'unauthenticated' as AuthRequirement,
    redirectTo: '/app/dashboard',
  },

  // Protected customer routes
  customer: {
    requireAuth: 'authenticated' as AuthRequirement,
    allowedRoles: ['customer'] as UserRole[],
    redirectTo: '/auth/login',
    fallbackRoute: '/unauthorized',
  },

  // Protected merchant routes
  merchant: {
    requireAuth: 'authenticated' as AuthRequirement,
    allowedRoles: ['merchant'] as UserRole[],
    redirectTo: '/auth/login',
    fallbackRoute: '/unauthorized',
  },

  // Admin routes
  admin: {
    requireAuth: 'authenticated' as AuthRequirement,
    allowedRoles: ['admin'] as UserRole[],
    redirectTo: '/auth/login',
    fallbackRoute: '/unauthorized',
  },

  // Optional auth routes (user can be logged in or not)
  optional: {
    requireAuth: 'optional' as AuthRequirement,
  },
};
