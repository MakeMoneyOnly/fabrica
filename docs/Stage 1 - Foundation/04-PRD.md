# fabrica - Product Requirements Document (PRD)

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision & Objectives](#product-vision--objectives)
3. [Ethiopian Creator Market Analysis](#ethiopian-creator-market-analysis)
4. [Creator Personas](#creator-personas)
5. [Core Features](#core-features)
6. [Store Builder Requirements](#store-builder-requirements)
7. [Mobile Creator Experience](#mobile-creator-experience)
8. [Creator Business Model](#creator-business-model)
9. [Success Metrics](#success-metrics)
10. [Risk Assessment](#risk-assessment)
11. [Implementation Roadmap](#implementation-roadmap)

---

## 📊 Executive Summary

### Product Vision

fabrica is Ethiopia's premier no-code storefront builder, empowering Ethiopian creators to monetize their digital expertise, art, music, courses, and content through professional online stores. Our platform revolutionizes creator entrepreneurship by eliminating technical barriers while providing seamless integration with Ethiopian payment systems and zero transaction fees.

### Key Value Propositions

#### For Ethiopian Creators

- **No-Code Store Builder**: Intuitive drag-and-drop interface for instant store creation
- **Zero Transaction Fees**: Creators keep 100% of their sales revenue
- **Mobile Creator Management**: Native iOS/Android apps for store management on-the-go
- **Ethiopian Payment Integration**: Native WeBirr, TeleBirr, CBE Birr support
- **Bilingual Interface**: Amharic and English support for all Ethiopian creators
- **Creator Community**: Networking and collaboration features
- **Creator Analytics**: Comprehensive performance insights and growth tracking
- **Professional Branding**: Custom domains and advanced customization

#### For Ethiopian Customers

- **Support Local Creators**: Purchase authentic Ethiopian digital products
- **Multiple Payment Methods**: WeBirr, TeleBirr, CBE Birr, card payments in ETB
- **Instant Digital Delivery**: Immediate access to purchased courses, ebooks, art
- **Secure Transactions**: Ethiopia-specific payment security and compliance
- **Mobile-Optimized Shopping**: Seamless experience on Ethiopian mobile networks
- **Creator Connection**: Direct interaction with Ethiopian content creators

---

## 🎯 Product Vision & Objectives

### Mission Statement

Empower Ethiopian creators to monetize their expertise, art, and content by providing accessible no-code tools that democratize online entrepreneurship and grow Ethiopia's digital creator economy.

### Primary Objectives

- **Creator Empowerment**: Enable 10,000+ Ethiopian creators to build professional online businesses
- **Zero Transaction Fees**: Establish a revolutionary no-fee model for creator monetization
- **Local Payment Integration**: Seamlessly integrate with Ethiopian payment systems
- **Mobile-First Creator Tools**: Optimize for mobile creator management across Ethiopia
- **Ethiopian Creator Community**: Build the largest community of digital creators in Ethiopia

### Target Platforms

- **Creator Web Dashboard**: Next.js-based drag-and-drop store builder
- **Creator Mobile Apps**: Native iOS/Android apps for creator store management
- **Creator Store Websites**: Custom-branded storefronts hosted on platform
- **Creator API**: RESTful APIs for advanced creator integrations
- **Community Platform**: Creator networking and collaboration features

---

## 📈 Ethiopian Creator Market Analysis

### Creator Economy Opportunity

- **Digital Creator Potential**: 3+ million potential creators in Ethiopia's growing digital economy
- **Mobile Creator Adoption**: 60% smartphone users expressing interest in content creation
- **Creator Monetization Gap**: <5% of Ethiopian creators currently monetizing online
- **Youth Creator Base**: 70% of Ethiopian creators aged 18-35
- **Urban Creator Hubs**: Addis Ababa (45%), Dire Dawa (15%), Bahir Dar (15%) leading hubs

### Creator Market Context

- **Digital Ethiopia 2025**: Government supporting digital entrepreneurship and creator economy
- **Social Media Boom**: TikTok (45M+ Ethiopian users), Instagram (20M+), YouTube growing rapidly
- **Cultural Storytelling**: Rich Ethiopian culture driving unique content creation
- **Regional Focus**: Content creation in Amharic, Oromo, Tigrinya languages
- **Education Demand**: Growing need for online learning in local languages/context

---

## 👥 Creator Personas

### Persona 1: Hiwot, the Ethiopian Fashion Designer

**Demographics**: 28 years old, fashion designer, Addis Ababa-based, 2,000 ETB monthly income from design work

- **Creator Profile**: Specializes in modern Ethiopian-inspired clothing, uses Instagram/TikTok
- **Motivation**: Turn passion for Ethiopian fashion into sustainable income
- **Challenges**: No technical skills, limited marketing budget, local payment barriers
- **Goals**: Sell digital fashion patterns, build online community, create passive income

### Persona 2: Samuel, the Tech Educator

**Demographics**: 24 years old, computer science graduate, freelance developer, 3,000 ETB monthly

- **Creator Profile**: Creates coding tutorials in Amharic, YouTube channel, skill-sharing workshops
- **Motivation**: Help Ethiopian youth learn technology in local language
- **Challenges**: Monetization barriers, payment processing complexity, audience building
- **Goals**: Scale education business, create online courses, build creator brand

### Persona 3: Makeda, the Traditional Crafts Artisan

**Demographics**: 35 years old, artisan specializing in Ethiopian handcrafts, small family workshop

- **Creator Profile**: Produces jewelry, textiles, pottery inspired by Ethiopian heritage
- **Motivation**: Preserve Ethiopian cultural arts through modern digital marketplace
- **Challenges**: Limited online presence, photography skills, shipping logistics
- **Goals**: Sell digital product designs, connect with global Ethiopian diaspora
- **Digital Transition**: Move from physical crafts to digital product templates

### Persona 4: Dawit, the Fitness Coach

**Demographics**: 30 years old, personal trainer, fitness entrepreneur, Dire Dawa-based

- **Creator Profile**: Creates workout videos, nutrition plans, Ethiopian fitness coaching
- **Motivation**: Build sustainable fitness business serving Ethiopian communities
- **Challenges**: Platform complexity, payment barriers, content marketing skills
- **Goals**: Create subscription-based fitness platform, mobile fitness app

---

## 🚀 Core Features

### 1. Consumer Mobile & Web Application

#### Authentication & Onboarding

- **Registration**: Phone/email + KYC verification with Fayda ID (exclusive)
- **Login Options**: Biometric, PIN, password, social login
- **Two-Factor Authentication**: SMS/app-based 2FA
- **Identity Verification**: Ethiopian Fayda National ID only

#### User Dashboard

- **Overview**: Available credit, active loans, credit score, quick actions
- **Payment Management**: Upcoming payments calendar, payment history, auto-pay setup
- **Profile Management**: Personal info, documents, notifications, security settings

#### Shopping & Discovery

- **Merchant Directory**: Browse partner merchants by category
- **Product Search**: Search products across all merchants
- **Wishlist**: Save items for later purchase
- **Recommendations**: Personalized product suggestions

#### Financial Wellness

- **Budgeting Tools**: Spending categorization and budget tracking
- **Savings Goals**: Goal-based savings tracking
- **Financial Education**: Interactive financial literacy modules
- **Credit Improvement**: Credit score improvement tips and guidance

### 2. Checkout Flow (Online & In-Store)

#### Online Checkout Integration

- **SDK Integration**: JavaScript, React, React Native, REST API
- **Checkout Widgets**: Embedded, modal, redirect, hosted options
- **Real-time Eligibility**: Instant pre-qualification checks
- **Payment Plan Selection**: Clear display of all available options
- **Terms Display**: Transparent terms, fees, and total cost breakdown

#### Checkout Process Steps

1. **Product Selection**: Show all BNPL options with real-time calculations
2. **User Identification**: Quick registration or one-click login
3. **Credit Check**: Real-time assessment < 500ms with instant decision
4. **Payment Terms**: Choose from available options with clear terms
5. **Confirmation**: Complete purchase breakdown and receipt

### 3. Merchant Dashboard & Portal

#### Merchant Onboarding

- **Business Verification**: License, tax ID, bank statements verification
- **Document Processing**: Automated verification with manual review
- **Compliance Checks**: AML/KYC business verification
- **Integration Setup**: API keys, testing environment, go-live process

#### Dashboard Features

- **Sales Overview**: Daily/weekly/monthly performance metrics
- **BNPL Analytics**: Performance comparison vs regular payments
- **Customer Insights**: Behavior analysis and demographics
- **Settlement Management**: Payment processing and reconciliation

#### Tools & Services

- **Campaign Management**: Create promotional offers and discounts
- **Inventory Integration**: Real-time stock synchronization
- **Customer Support**: Direct merchant support portal
- **API Documentation**: Comprehensive integration guides

### 4. Admin/Backoffice System

#### User Management

- **Customer Administration**: Profile management, KYC review, credit adjustments
- **Account Management**: Status controls, support tickets, compliance records
- **Merchant Administration**: Onboarding approval, contract management, performance monitoring

#### Risk & Compliance Management

- **Credit Risk**: Scoring models, risk policies, portfolio analysis
- **Fraud Prevention**: Real-time monitoring, alert management, case investigation
- **Compliance Oversight**: Regulatory reporting, audit trails, policy enforcement

#### Analytics & Reporting

- **Business Intelligence**: Performance dashboards and KPI tracking
- **Financial Reporting**: Transaction volumes, revenue analysis, risk metrics
- **Regulatory Reporting**: NBE compliance reports and audit documentation

---

## 💳 Payment Options

### 1. Pay in 4 (Interest-Free)

**Structure**: 4 equal payments over 6 weeks

- **Interest Rate**: 0% APR (completely interest-free)
- **First Payment**: 25% at purchase
- **Subsequent Payments**: Every 2 weeks automatically
- **Late Fees**: ETB 50 per missed payment (capped at 25% of purchase)
- **Eligibility**: Soft credit check, instant approval
- **Limits**: 100 ETB - 5,000 ETB

### 2. Pay in 30 (Interest-Free)

**Structure**: Full payment deferred for 30 days

- **Interest Rate**: 0% APR (completely interest-free)
- **Payment Due**: 30 days after purchase
- **Buyer Protection**: Full return policy within 30 days
- **Late Fees**: ETB 100 after grace period
- **Use Case**: Try-before-you-buy, especially fashion
- **Limits**: 50 ETB - 10,000 ETB

### 3. Pay in Full

**Structure**: Immediate payment

- **Benefits**: Full cashback rates, buyer protection, no fees
- **Payment Methods**: Telebirr, M-Pesa, cards, bank transfer
- **Protection**: Purchase protection and extended warranties
- **Limits**: 10 ETB - No maximum limit

### 4. Financing (3-24 Months)

**Structure**: Monthly installment plans with interest

- **Terms Available**: 3, 6, 12, 24 month payment plans
- **APR Range**: 7.99% - 29.99% based on creditworthiness
- **Qualification**: Comprehensive credit check required
- **Early Payment**: No prepayment penalties
- **Use Cases**: Large purchases, appliances, education
- **Limits**: 1,000 ETB - 100,000 ETB

---

## 🎨 User Experience Requirements

### Design Principles

- **Mobile-First**: Optimized for Ethiopian mobile devices and networks
- **Cultural Relevance**: Ethiopian calendar, holidays, local imagery
- **Language Support**: Full Amharic and English localization
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design
- **Trust & Transparency**: Clear payment terms, no hidden fees

### Ethiopian Localization

- **Amharic Language**: Right-to-left text support, cultural terminology
- **Ethiopian Calendar**: Native calendar support for dates and holidays
- **Cultural Elements**: Ethiopian model photography, local scenarios
- **Holiday Integration**: Timkat, Meskel, Ethiopian New Year campaigns
- **Community Features**: Group buying, family accounts, social sharing

### Performance Requirements

- **Network Optimization**: Efficient on 2G/3G networks
- **Offline Capabilities**: Core features work without internet
- **Load Times**: < 3 seconds on typical Ethiopian networks
- **Battery Optimization**: Minimal battery drain on older devices

---

## 💼 Business Model

### Revenue Streams

1. **Merchant Fees**: 3-6% commission per transaction
2. **Consumer Transaction Fees**: ETB 5-25 per transaction (transparent, capped)
3. **Interest Income**: From financing products (7.99%-29.99% APR)
4. **Meqenet Plus Subscription**: Premium subscription (199 ETB/month)
5. **Cashback Program Revenue**: Strategic partnerships with brands
6. **Premium Services**: Enhanced merchant analytics and promotional tools

### Cashback & Rewards System

- **Earning Rates**: 2-10% cashback depending on merchant category
- **Redemption Options**: Apply to BNPL payments, pay bills, donate to charity
- **Loyalty Tiers**: Bronze, Silver, Gold, Platinum based on annual spending
- **Premium Benefits**: Enhanced rates, exclusive access, priority support

### Target Market Segments

- **Primary Consumers**: Young professionals, students, urban middle class, families
- **Merchant Categories**: Fashion, electronics, home goods, healthcare, education
- **Geographic Focus**: Urban centers with expansion to secondary cities

---

## 📊 Success Metrics

### Creator Acquisition & Engagement

- **New Creators**: 150+ new Ethiopian creators per month
- **Active Creators**: 1,000+ creators with published stores by year 1
- **Retention Rates**: 85% (30-day), 75% (90-day) creator retention
- **Creator Upgrade Rate**: 25% upgrade from Creator to Creator Pro

### Creator Business Performance

- **平均 Store Revenue**: 500+ ETB monthly per active creator
- **Total Creator Revenue**: 10M+ ETB monthly processed through platform
- **Average Products/Creator**: 15+ products listed per creator
- **Creator Satisfaction**: NPS score >50 for platform experience

### Platform Performance

- **Store Creation Success**: >95% of creators successfully launch stores
- **Payment Success Rate**: >98% Ethiopian payment processing success
- **Platform Uptime**: 99.9% availability for creator dashboards
- **Mobile App Usage**: 80% of creators use mobile management apps

### Creator Community Growth

- **Amharic Adoption**: >70% creators use Amharic interface features
- **Community Engagement**: >60% creators participate in networking features
- **Social Sharing**: >50% creators share their stores on social platforms
- **Creator Referrals**: 30% creator acquisition through referrals

---

## ⚠️ Risk Assessment

### Market Risks

- **Regulatory Changes**: NBE policy modifications affecting operations
- **Economic Volatility**: Ethiopian birr fluctuations and inflation
- **Competition**: International BNPL players entering Ethiopian market
- **Technology Infrastructure**: Network reliability and payment system outages

### Operational Risks

- **Credit Risk**: Higher default rates than projected
- **Fraud Risk**: Payment fraud and identity theft
- **Cybersecurity**: Data breaches and system compromises
- **Merchant Risk**: Merchant fraud or failure to deliver goods

### Mitigation Strategies

- **Diversified Payment Methods**: Multiple Ethiopian payment integrations
- **Conservative Credit Policies**: Gradual credit limit increases
- **Advanced Fraud Detection**: ML-based real-time fraud prevention
- **Strong Security Framework**: Multi-layer security implementation
- **Regulatory Compliance**: Proactive NBE engagement and compliance

---

## 🔮 Future Roadmap

### Phase 1 (Year 1): Core Platform

- Launch core BNPL payment options
- Onboard 500+ Ethiopian merchants
- Achieve 75,000+ monthly active users
- Establish cashback program with major brands

### Phase 2 (Year 2): Ecosystem Expansion

- **Advanced Financial Services**: Savings accounts, micro-insurance
- **Agricultural Finance**: Seasonal financing for Ethiopian farmers
- **Investment Products**: Ethiopian stock market investment tools
- **Diaspora Services**: Remittance and investment for Ethiopians abroad

### Phase 3 (Year 3): Regional Expansion

- **East Africa Expansion**: Kenya, Uganda, Tanzania markets
- **B2B Services**: Business-to-business financing solutions
- **Government Integration**: Digital payments for government services
- **Advanced AI**: Ethiopian-specific credit scoring and voice payments

### Technology Innovation Pipeline

- **AI Credit Scoring**: Ethiopian alternative credit data analysis
- **Voice Payments**: Amharic voice-activated payment processing
- **Blockchain Integration**: Enhanced transaction transparency
- **IoT Payments**: Smart city payment integration

---

**Document Version**: 2.0 (Streamlined)  
**Last Updated**: January 2025  
**Next Review**: February 2025

---

_This PRD defines the product requirements for fabrica, Ethiopia's premier no-code creator platform.
For technical implementation details, see Architecture.md, Tech_Stack.md, and Security.md._