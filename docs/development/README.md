# Development Guidelines

## 🏗️ Code Organization

### Feature-Sliced Architecture (FSA)

Fabrica follows Feature-Sliced Architecture for scalable, maintainable code organization:

```
src/
├── app/                    # Next.js App Router (framework layer)
├── shared/                 # Shared business logic & UI
│   ├── api/               # API clients & configurations
│   ├── lib/               # Utilities, validation, security
│   ├── ui/                # Shared UI components
│   └── config/            # Application configuration
├── entities/              # Business entities
│   ├── user/             # User entity (model, api, ui)
│   ├── product/          # Product entity
│   └── order/            # Order entity
├── features/              # Business features
│   ├── auth/             # Authentication feature
│   ├── payments/         # Payment processing
│   └── products/         # Product management
├── pages/                 # Page components
└── widgets/               # Complex UI components
```

### Layer Responsibilities

#### 📁 Shared Layer
- Reusable business logic
- Common UI components
- Utility functions
- API clients
- Configuration

#### 📁 Entities Layer
- Business entity definitions
- Entity-specific business logic
- Entity validation schemas
- Entity API clients

#### 📁 Features Layer
- Feature-specific business logic
- Feature components
- Feature state management
- Feature-specific APIs

#### 📁 Pages Layer
- Page components
- Route-specific logic
- Page layouts

## 🎯 Coding Standards

### TypeScript

#### Strict Mode Requirements
```typescript
// ✅ Good: Explicit types, no any
interface User {
  id: string;
  name: string;
  email?: string;
}

function createUser(data: User): User {
  return { ...data, id: generateId() };
}

// ❌ Bad: Implicit any, loose types
function createUser(data) {
  return { ...data, id: generateId() };
}
```

#### Naming Conventions
```typescript
// Interfaces and Types
interface UserProfile {}           // PascalCase
type UserStatus = 'active' | 'inactive'; // PascalCase

// Functions and Variables
function getUserData() {}          // camelCase
const userList: User[] = [];       // camelCase

// Components
function UserCard() {}             // PascalCase
const UserList = () => {};         // PascalCase

// Files
// user-api.ts, UserCard.tsx, auth-hooks.ts
```

### React Best Practices

#### Component Structure
```tsx
// ✅ Good: Clear component structure
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  const handleEdit = useCallback(() => {
    onEdit?.(user);
  }, [onEdit, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
        <Button onClick={handleEdit}>Edit</Button>
      </CardContent>
    </Card>
  );
}
```

#### Custom Hooks
```tsx
// ✅ Good: Custom hook for business logic
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ❌ Bad: Business logic in components
export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  // ... rest of component
}
```

## 🧪 Testing Strategy

### Test Organization
```
src/
├── __tests__/               # Global test setup
├── shared/
│   └── __tests__/          # Shared layer tests
├── features/
│   └── auth/
│       └── __tests__/      # Feature-specific tests
└── __fixtures__/           # Test data fixtures
```

### Testing Patterns

#### Unit Tests
```typescript
// user-api.test.ts
import { userApi } from '../api';
import { mockApiClient } from '@/shared/__mocks__/api-client';

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockUser = { id: '1', name: 'John' };
      mockApiClient.get.mockResolvedValue({
        data: { data: mockUser, success: true }
      });

      const result = await userApi.getProfile('1');

      expect(mockApiClient.get).toHaveBeenCalledWith('/users/1');
      expect(result.data).toEqual(mockUser);
    });
  });
});
```

#### Component Tests
```tsx
// UserCard.test.tsx
import { render, screen } from '@/shared/lib/__tests__/test-utils';
import { UserCard } from '../UserCard';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
};

describe('UserCard', () => {
  it('should render user information', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

#### Integration Tests
```typescript
// auth-flow.test.ts
describe('Authentication Flow', () => {
  it('should complete full authentication flow', async () => {
    // Test login -> redirect -> access protected route -> logout
    await page.goto('/auth/login');

    await page.fill('[data-testid="phone-input"]', '+251911123456');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    await page.waitForURL('/app/dashboard');
    expect(page.url()).toContain('/app/dashboard');

    // Verify user can access protected content
    await expect(page.locator('[data-testid="user-name"]')).toContainText('John Doe');
  });
});
```

### Test Coverage Requirements
- **Statements**: ≥ 80%
- **Branches**: ≥ 80%
- **Functions**: ≥ 80%
- **Lines**: ≥ 80%

## 🔒 Security Guidelines

### Input Validation
```typescript
// ✅ Good: Zod schema validation
import { z } from 'zod';

const loginSchema = z.object({
  phoneNumber: z.string()
    .regex(/^\+251[0-9]{9}$/, 'Invalid Ethiopian phone number'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
});

export function validateLogin(data: unknown) {
  return loginSchema.parse(data);
}

// ❌ Bad: Manual validation
export function validateLogin(data: any) {
  if (!data.phoneNumber || typeof data.phoneNumber !== 'string') {
    throw new Error('Invalid phone number');
  }
  // ... more manual checks
}
```

### Secure Coding Practices
```typescript
// ✅ Good: Secure API calls
const response = await apiClient.post('/sensitive-data', data, {
  headers: {
    'X-CSRF-Token': getCsrfToken(),
  },
});

// ✅ Good: Environment variables
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
if (!apiKey) {
  throw new Error('API key not configured');
}

// ❌ Bad: Hardcoded secrets
const apiKey = 'sk-1234567890abcdef';

// ❌ Bad: Logging sensitive data
console.log('User data:', user); // May contain PII
console.log('Masked user:', maskSensitiveData(user)); // ✅ Good
```

## 🚀 Performance Guidelines

### Code Splitting
```typescript
// ✅ Good: Dynamic imports for routes
const Dashboard = dynamic(() => import('../pages/Dashboard'), {
  loading: () => <PageSkeleton />,
});

// ✅ Good: Component-level code splitting
const HeavyChart = dynamic(() => import('../components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR for client-only components
});
```

### Image Optimization
```tsx
// ✅ Good: Next.js Image component
import Image from 'next/image';

<Image
  src="/product-image.jpg"
  alt="Product"
  width={400}
  height={300}
  priority={false} // Only for above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."
/>
```

### Memoization
```tsx
// ✅ Good: Memoize expensive computations
const userStats = useMemo(() => {
  return calculateUserStats(userData);
}, [userData]);

// ✅ Good: Memoize callbacks
const handleSubmit = useCallback((data: FormData) => {
  onSubmit(data);
}, [onSubmit]);
```

## 📝 Documentation Standards

### Code Documentation
```typescript
/**
 * Calculates the total payment amount including fees and interest
 *
 * @param principal - The original loan amount in minor units (e.g., cents)
 * @param installments - Number of payment installments
 * @param annualRate - Annual interest rate as decimal (e.g., 0.12 for 12%)
 * @returns Object containing installment amount and total amount
 *
 * @example
 * ```typescript
 * const result = calculatePaymentSchedule(100000, 6, 0.12);
 * // result = { installmentAmount: 17233, totalAmount: 103400 }
 * ```
 */
export function calculatePaymentSchedule(
  principal: number,
  installments: number,
  annualRate: number
): PaymentSchedule {
  // Implementation
}
```

### Component Documentation
```tsx
interface PaymentFormProps {
  /** The maximum amount that can be requested */
  maxAmount: number;
  /** Callback fired when payment is successfully created */
  onSuccess: (transactionId: string) => void;
  /** Callback fired when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * Form component for creating BNPL payment requests
 *
 * Features:
 * - Real-time validation
 * - Installment calculation
 * - Credit limit checking
 * - Mobile-optimized UI
 */
export function PaymentForm({
  maxAmount,
  onSuccess,
  onError
}: PaymentFormProps) {
  // Implementation
}
```

## 🔄 Git Workflow

### Branch Naming
```bash
# Features
git checkout -b feature/user-authentication
git checkout -b feature/payment-processing

# Bug fixes
git checkout -b bugfix/login-validation
git checkout -b bugfix/payment-calculation

# Hotfixes
git checkout -b hotfix/security-patch
git checkout -b hotfix/payment-failure

# Releases
git checkout -b release/v1.2.0
```

### Commit Messages
```bash
# Good commit messages
feat: implement user authentication flow
fix: resolve payment calculation bug
docs: update API documentation
refactor: optimize payment schedule algorithm

# Bad commit messages
fix bug
update code
changes
```

### Pull Request Process
1. **Create Feature Branch**: `git checkout -b feature/new-feature`
2. **Make Changes**: Implement feature with tests
3. **Run Quality Checks**: `npm run lint && npm run test`
4. **Update Documentation**: Add/update relevant docs
5. **Create PR**: Use PR template with description
6. **Code Review**: Address reviewer feedback
7. **Merge**: Squash merge to main branch

## 📊 Monitoring & Logging

### Error Handling
```typescript
// ✅ Good: Structured error handling
try {
  const result = await paymentApi.processPayment(data);
  return result;
} catch (error) {
  // Log structured error
  logger.error('Payment processing failed', {
    userId: data.userId,
    amount: data.amount,
    error: error.message,
    stack: error.stack,
  });

  // Return user-friendly error
  throw new PaymentError('Unable to process payment. Please try again.');
}
```

### Performance Monitoring
```typescript
// ✅ Good: Performance tracking
const startTime = performance.now();

const result = await expensiveOperation();

const duration = performance.now() - startTime;

// Log performance metrics
logger.info('Operation completed', {
  operation: 'expensiveOperation',
  duration: `${duration.toFixed(2)}ms`,
  timestamp: new Date().toISOString(),
});
```

## 🎨 UI/UX Guidelines

### Design System Usage
```tsx
// ✅ Good: Use design system components
import { Button, Card, Input } from '@/shared/ui';

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="tel"
          placeholder="+251XXXXXXXXX"
          label="Phone Number"
        />
        <Input
          type="password"
          placeholder="Enter password"
          label="Password"
        />
        <Button className="w-full">
          Sign In
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Accessibility
```tsx
// ✅ Good: Accessible components
<button
  onClick={handleClick}
  disabled={loading}
  aria-label={loading ? 'Loading...' : 'Submit form'}
  className="btn btn-primary"
>
  {loading ? <Spinner /> : 'Submit'}
</button>

// ✅ Good: Form accessibility
<form onSubmit={handleSubmit} noValidate>
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    aria-describedby="email-error"
    aria-invalid={!!error}
  />
  {error && (
    <span id="email-error" role="alert" className="error">
      {error}
    </span>
  )}
</form>
```

## 📋 Checklist

### Pre-Commit Checklist
- [ ] Code passes linting (`npm run lint`)
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compilation succeeds (`npm run type-check`)
- [ ] No console.log statements in production code
- [ ] Documentation updated for new features
- [ ] Security review completed for sensitive changes

### Code Review Checklist
- [ ] Business logic is correct and well-tested
- [ ] Security best practices followed
- [ ] Performance considerations addressed
- [ ] Code is readable and maintainable
- [ ] Proper error handling implemented
- [ ] Types are correct and complete
- [ ] No hardcoded secrets or sensitive data
