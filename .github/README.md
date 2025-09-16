# CI/CD Pipeline for Habesha Store

This directory contains the GitHub Actions CI/CD pipeline for the Ethiopian Creator Platform (Habesha Store).

## What's Implemented

✅ **GitHub Actions CI/CD Pipeline** (`.github/workflows/ci.yml`)
- **Automated Testing**: Runs unit and integration tests for both backend (NestJS) and frontend (Next.js)
- **Database Testing**: Spins up PostgreSQL and Redis containers for integration tests
- **Linting**: Runs ESLint across the monorepo
- **Security Scanning**: Performs security audits and SAST scanning
- **Multi-Environment Deployment**: Separate staging and production pipelines
- **Notifications**: Slack notifications for deployment status

## Pipeline Stages

### 1. Test Stage
- **Backend Tests**: Jest unit tests with PostgreSQL/Redis integration
- **Frontend Tests**: Jest unit tests and Next.js linting
- **Coverage Reports**: Generates test coverage for both applications
- **Database Migration**: Validates Prisma schema and migrations

### 2. Security Stage
- **Dependency Audit**: Scans for vulnerable packages
- **SAST Scanning**: Static Application Security Testing
- **License Compliance**: Checks for incompatible licenses

### 3. Deployment Stages
- **Staging**: Automatic deployment from `develop` branch
- **Production**: Manual deployment from `main` branch
- **AWS Integration**: Configured for Cape Town region (low latency for Ethiopia)

### 4. Monitoring & Alerts
- **Slack Notifications**: Real-time deployment status updates
- **Error Tracking**: Integration points for error monitoring
- **Performance Metrics**: Build time and test execution monitoring

## Ethiopian Market Optimizations

- **Geo-Optimized**: Configured for AWS Cape Town region (af-south-1)
- **Payment Provider Integration**: Ready for Ethiopian payment gateways
- **Cultural Localization**: Prepared for Amharic language support
- **Bandwidth Optimization**: Mobile-first testing for Ethiopian network conditions

## Environment Variables Required

### GitHub Secrets
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
SLACK_WEBHOOK_URL
DATABASE_URL (for staging/production)
REDIS_URL (for staging/production)
```

## Usage

### Automatic Triggers
- **Push to main/develop**: Runs full CI/CD pipeline
- **Pull Requests**: Runs tests and linting only
- **Staging Deployment**: Auto-deploys on develop branch push
- **Production Deployment**: Requires manual approval

### Manual Triggers
- Security scans can be run manually
- Deployments can be triggered manually via GitHub interface

## Project Structure
```
/.github/
├── workflows/
│   └── ci.yml          # Main CI/CD pipeline
└── README.md          # This documentation
```

## Next Steps

1. **Update task status** to reflect CI/CD pipeline completion
2. **Configure AWS credentials** in GitHub secrets
3. **Set up staging/production environments**
4. **Configure Slack webhook** for notifications
5. **Customize deployment scripts** for your infrastructure
6. **Add more comprehensive test suites** as the codebase grows

## Ethiopian-Specific Considerations

- **Payment Processing**: Pipeline supports Ethiopian payment gateways (WeBirr, TeleBirr, CBE Birr, Chapa, Amole)
- **Currency Support**: Configured for Ethiopian Birr (ETB)
- **Performance**: Optimized for Ethiopian network bandwidth limitations
- **Localization**: Pipeline ready for Amharic language support
- **Compliance**: Security scanning aligned with Ethiopian data protection requirements

This CI/CD pipeline provides a solid foundation for automated testing, security scanning, and deployment of the Ethiopian creator platform.
