# Fabrica - Enterprise BNPL Platform for Ethiopian Creators

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

> The all-in-one platform for creators in Ethiopia. Build, manage, and scale your creative business with integrated Buy Now Pay Later (BNPL) solutions.

## 🚀 Features

### Core Functionality
- ✅ **Creator Marketplace** - Showcase and sell creative products
- ✅ **BNPL Integration** - Flexible payment plans for customers
- ✅ **Merchant Dashboard** - Comprehensive business management tools
- ✅ **Multi-language Support** - English and Amharic
- ✅ **Mobile-First Design** - Optimized for all devices

### Enterprise Features
- 🔒 **Bank-Grade Security** - AES-256 encryption, JWT authentication
- 📊 **Advanced Analytics** - Real-time business insights
- 🔄 **API-First Architecture** - RESTful APIs with OpenAPI spec
- 🧪 **Comprehensive Testing** - 90%+ test coverage
- 📱 **Progressive Web App** - Offline-capable mobile experience

### Compliance & Security
- 🛡️ **PCI DSS Compliant** - Secure payment processing
- 📋 **KYC/AML Integration** - Automated compliance checks
- 🔐 **Multi-factor Authentication** - Enhanced account security
- 📊 **Audit Logging** - Complete transaction traceability

## 🏗️ Architecture

This project follows **Feature-Sliced Architecture (FSA)** for scalable, maintainable code:

```
src/
├── app/                    # Next.js App Router
├── shared/                 # Shared business logic & UI
│   ├── api/               # API clients & configuration
│   ├── lib/               # Utilities & helpers
│   ├── ui/                # Shared UI components
│   └── config/            # Application configuration
├── entities/              # Business entities (User, Product, Order)
├── features/              # Business features
│   ├── auth/             # Authentication feature
│   ├── payments/         # Payment processing
│   ├── products/         # Product management
│   └── orders/           # Order management
├── pages/                 # Page components
└── widgets/               # Composite UI components
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query + Context API
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI + Custom components

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Refresh tokens
- **API**: RESTful with OpenAPI 3.0
- **Validation**: Class-validator + Zod

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack

### Security & Compliance
- **Encryption**: AES-256-GCM at rest
- **TLS**: 1.3 in transit
- **Secrets**: AWS Secrets Manager
- **Audit**: Complete audit trails
- **Compliance**: PCI DSS, GDPR, local regulations

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0+
- npm 9.0+
- Docker & Docker Compose
- PostgreSQL (optional, can use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fabrica-et/fabrica-web.git
   cd fabrica-web
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (frontend + backend + shared)
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp apps/web/ENV.example apps/web/.env.local
   cp apps/backend/ENV.example apps/backend/.env

   # Edit environment variables
   nano apps/web/.env.local
   nano apps/backend/.env
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL with Docker
   docker-compose up -d postgres

   # Run database migrations
   cd apps/backend
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Development Servers**
   ```bash
   # Start all services
   npm run dev

   # Or start individually:
   npm run dev:web     # Frontend on http://localhost:3001
   npm run dev:backend # Backend on http://localhost:3000
   ```

6. **Access the Application**
   - Frontend: http://localhost:3001
   - API Documentation: http://localhost:3000/api/docs
   - Admin Panel: http://localhost:3001/admin

## 📋 Development Guidelines

### Code Quality
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with Airbnb config
- **Formatting**: Prettier
- **Testing**: Jest + React Testing Library
- **Coverage**: Minimum 80% coverage required

### Git Workflow
- **Branch Naming**: `feature/`, `bugfix/`, `hotfix/`, `release/`
- **Commits**: Conventional commits
- **PR Reviews**: Required for all changes
- **Testing**: All tests must pass before merge

### Security
- **Input Validation**: All inputs validated with Zod schemas
- **Authentication**: JWT with refresh token rotation
- **Authorization**: Role-based access control (RBAC)
- **Secrets**: Never commit secrets to code
- **Audit**: All security events logged

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e

# Run specific test file
npm test -- src/features/auth/lib/api.test.ts
```

### Test Structure
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user journeys
- **Performance Tests**: Load testing and performance monitoring

## 🚀 Deployment

### Production Build
```bash
# Build all services
npm run build

# Build individual services
npm run build:web
npm run build:backend
```

### Docker Deployment
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

### Kubernetes Deployment
```bash
# Deploy to Kubernetes
kubectl apply -f infra/k8s/

# Check deployment status
kubectl get pods
kubectl get services
```

## 📚 Documentation

### API Documentation
- **OpenAPI Spec**: `/api/docs`
- **Postman Collection**: `docs/api/postman_collection.json`
- **API Guidelines**: `docs/api/README.md`

### Architecture
- **System Overview**: `docs/architecture/README.md`
- **Database Schema**: `docs/architecture/database.md`
- **Security**: `docs/security/README.md`

### Development
- **Contributing**: `CONTRIBUTING.md`
- **Code Standards**: `docs/development/standards.md`
- **Testing**: `docs/development/testing.md`

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PAYMENTS=true
```

#### Backend (.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/fabrica
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPTION_KEY=your-32-character-encryption-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
See [Development Guidelines](docs/development/README.md) for detailed setup instructions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ethiopian developer community
- Open source contributors
- FinTech innovation ecosystem

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/fabrica-et/fabrica-web/issues)
- **Discussions**: [GitHub Discussions](https://github.com/fabrica-et/fabrica-web/discussions)
- **Email**: support@fabrica.et

---

**Built with ❤️ for Ethiopian creators**