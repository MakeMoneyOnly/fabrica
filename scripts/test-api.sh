#!/bin/bash
# API Testing Helper Script
# Tests various API endpoints to verify functionality

BASE_URL="${1:-http://localhost:3000}"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing API Endpoints..."
echo "Base URL: $BASE_URL"
echo ""

# Test Health Check
echo "1️⃣  Testing Health Check Endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Health check passed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ Health check failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""

# Test Stats Endpoint
echo "2️⃣  Testing Stats Endpoint..."
STATS_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/stats")
HTTP_CODE=$(echo "$STATS_RESPONSE" | tail -n1)
BODY=$(echo "$STATS_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Stats endpoint working (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${YELLOW}⚠️  Stats endpoint returned HTTP $HTTP_CODE${NC}"
    echo "$BODY"
fi
echo ""

# Test Sentry Test Endpoint
echo "3️⃣  Testing Sentry Test Endpoint..."
SENTRY_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/test-sentry")
HTTP_CODE=$(echo "$SENTRY_RESPONSE" | tail -n1)
BODY=$(echo "$SENTRY_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 500 ]; then
    echo -e "${GREEN}✅ Sentry test endpoint working (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo -e "${YELLOW}💡 Check your Sentry dashboard for the error${NC}"
else
    echo -e "${RED}❌ Sentry test endpoint failed (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""

# Test Payment Initiation (with invalid data for validation test)
echo "4️⃣  Testing Payment Initiation Validation..."
PAYMENT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/payments/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "invalid-uuid",
    "customerEmail": "not-an-email",
    "customerName": "A",
    "customerPhone": "123"
  }')
HTTP_CODE=$(echo "$PAYMENT_RESPONSE" | tail -n1)
BODY=$(echo "$PAYMENT_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}✅ Payment validation working (HTTP $HTTP_CODE - expected)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${YELLOW}⚠️  Payment endpoint returned HTTP $HTTP_CODE${NC}"
    echo "$BODY"
fi
echo ""

# Test Rate Limiting (if configured)
echo "5️⃣  Testing Rate Limiting..."
echo "Making 10 rapid requests..."
for i in {1..10}; do
    RATE_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/health")
    HTTP_CODE=$(echo "$RATE_RESPONSE" | tail -n1)
    RATE_LIMIT_REMAINING=$(curl -s -I "$BASE_URL/api/health" | grep -i "x-ratelimit-remaining" | cut -d' ' -f2 | tr -d '\r')
    
    if [ -n "$RATE_LIMIT_REMAINING" ]; then
        echo "Request $i: HTTP $HTTP_CODE, Remaining: $RATE_LIMIT_REMAINING"
    else
        echo "Request $i: HTTP $HTTP_CODE (Rate limiting not configured or headers not present)"
    fi
done
echo ""

echo "✨ API Testing Complete!"
echo ""
echo "📝 Next steps:"
echo "   - Review the responses above"
echo "   - Check Sentry dashboard for error reports"
echo "   - See TESTING_GUIDE.md for detailed testing procedures"

