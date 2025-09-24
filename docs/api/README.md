# Fabrica API Documentation

## Overview

Fabrica provides a comprehensive RESTful API for integrating BNPL functionality into your applications. Our API follows REST principles, uses JSON for data exchange, and includes comprehensive documentation.

## 🔑 Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Flow

1. **Login**: Exchange credentials for access and refresh tokens
2. **Use API**: Include access token in requests
3. **Refresh**: Use refresh token to get new access token when expired

## 📡 Base URL

```
Production: https://api.fabrica.et/v1
Staging: https://api-staging.fabrica.et/v1
Development: http://localhost:3000/api/v1
```

## 🔧 Core Endpoints

### Authentication

#### POST /auth/login
Authenticate user and receive tokens.

**Request:**
```json
{
  "phoneNumber": "+251911123456",
  "password": "user_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "phoneNumber": "+251911123456",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "customer"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Payments

#### POST /payments/create
Create a new payment request with BNPL options.

**Request:**
```json
{
  "amount": 15000,
  "currency": "ETB",
  "description": "Purchase from TechStore",
  "merchantId": "merchant_456",
  "paymentSchedule": {
    "installments": 6,
    "frequency": "monthly"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_123",
    "paymentUrl": "https://pay.fabrica.et/txn_123",
    "schedule": {
      "totalAmount": 15750,
      "installmentAmount": 2625,
      "dueDates": [
        "2024-02-15",
        "2024-03-15",
        "2024-04-15"
      ]
    }
  }
}
```

#### GET /payments/transactions
Get user's transaction history.

**Query Parameters:**
- `limit` (optional): Number of transactions (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_123",
        "amount": 15000,
        "status": "completed",
        "description": "Purchase from TechStore",
        "createdAt": "2024-01-15T14:30:00Z"
      }
    ],
    "total": 1
  }
}
```

### Credit Management

#### GET /payments/credit-limit
Get user's available credit limit.

**Response:**
```json
{
  "success": true,
  "data": {
    "currentLimit": 50000,
    "usedAmount": 15000,
    "availableAmount": 35000,
    "lastUpdated": "2024-01-20T10:30:00Z"
  }
}
```

#### GET /payments/schedule
Get user's payment schedule.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "schedule_1",
      "installmentAmount": 2500,
      "remainingAmount": 12500,
      "dueDate": "2024-02-15T00:00:00Z",
      "status": "pending",
      "installmentNumber": 1,
      "totalInstallments": 6
    }
  ]
}
```

### Merchant API

#### POST /merchants
Register a new merchant.

**Request:**
```json
{
  "businessName": "TechStore Ethiopia",
  "phoneNumber": "+251922654321",
  "email": "contact@techstore.et",
  "businessType": "retail",
  "address": {
    "street": "123 Bole Road",
    "city": "Addis Ababa",
    "region": "Addis Ababa"
  }
}
```

#### GET /merchants/transactions
Get merchant's transaction history (requires merchant authentication).

**Query Parameters:**
- `startDate`: Filter transactions from this date
- `endDate`: Filter transactions to this date
- `status`: Filter by transaction status

## 🔒 Security

### Rate Limiting
- **Authenticated Requests**: 1000 requests per hour
- **Unauthenticated Requests**: 100 requests per hour
- **Payment Requests**: 50 requests per hour

### Input Validation
All API inputs are validated using Zod schemas with comprehensive error messages.

### Data Masking
Sensitive data is automatically masked in API responses and logs.

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": {
    "field": "phoneNumber",
    "reason": "Invalid phone number format"
  }
}
```

## ⚡ Webhooks

### Payment Status Updates
Receive real-time updates about payment status changes.

**Endpoint:** `POST /webhooks/payments`

**Payload:**
```json
{
  "event": "payment.completed",
  "transactionId": "txn_123",
  "status": "completed",
  "amount": 15000,
  "timestamp": "2024-01-15T14:35:00Z"
}
```

### Security
- Webhook signatures are verified using HMAC-SHA256
- Requests include timestamp for replay attack prevention
- Failed webhook deliveries are retried with exponential backoff

## 🧪 Testing

### Sandbox Environment
Use our sandbox environment for testing:

```
Sandbox URL: https://api-sandbox.fabrica.et/v1
```

### Test Data
- **Test Phone**: +251911000000
- **Test OTP**: 123456
- **Test Cards**: Use sandbox payment methods

## 📚 SDKs & Libraries

### JavaScript/TypeScript SDK
```bash
npm install @fabrica/sdk
```

```typescript
import { FabricaClient } from '@fabrica/sdk';

const client = new FabricaClient({
  apiKey: 'your_api_key',
  environment: 'sandbox'
});

// Create payment
const payment = await client.payments.create({
  amount: 10000,
  description: 'Test payment'
});
```

### Postman Collection
Download our [Postman collection](postman_collection.json) for testing APIs.

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTHENTICATION_ERROR` | Invalid or missing credentials |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `PAYMENT_FAILED` | Payment processing failed |
| `INSUFFICIENT_CREDIT` | Credit limit exceeded |

## 📞 Support

- **API Status**: https://status.fabrica.et
- **Documentation**: https://docs.fabrica.et
- **Support**: support@fabrica.et

## 🔄 Versioning

API versions follow semantic versioning:
- **v1**: Current stable version
- **Breaking Changes**: New major version
- **Backwards Compatible**: Minor/patch versions

## 📋 Change Log

### v1.0.0 (Current)
- Initial API release
- Core BNPL functionality
- Authentication and authorization
- Payment processing
- Webhook support
