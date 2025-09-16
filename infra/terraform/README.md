# Habesha Store AWS Infrastructure (Cape Town Region)

This directory contains the Terraform configuration for the Ethiopian Creator Platform (Habesha Store) infrastructure optimized for Ethiopian users.

## 🌍 Cape Town Region Optimization

The infrastructure is specifically designed for **Africa (Cape Town) region (af-south-1)** to optimize performance for Ethiopian users with:
- **Low Latency**: Minimal network distance to Ethiopia
- **High Availability**: Multi-AZ deployment across 3 availability zones
- **Cost Efficiency**: Optimized for Ethiopian market scale
- **Compliance Ready**: Prepared for Ethiopian regulatory requirements

## 🏗️ Infrastructure Components

### ✅ **Implemented**
- **VPC & Networking**: Multi-AZ setup with public/private/database subnets
- **Security Groups**: PCI DSS compliant with layered security
- **RDS PostgreSQL**: Encrypted database with Ethiopian localization
- **Infrastructure Foundation**: Core networking and security

### 🚧 **Next Steps** 
- **Redis ElastiCache**: Session management for Ethiopian users
- **ALB**: Application Load Balancer for web traffic
- **CloudFront & WAF**: CDN and security for payments
- **Monitoring**: APM and error tracking integration

## 📁 Module Structure

```
infra/terraform/
├── main.tf                 # Root configuration
├── README.md              # This documentation
├── modules/
│   ├── vpc/               # Network infrastructure
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── security-groups/   # Security configuration
│   │   └── main.tf
│   └── rds/               # PostgreSQL database
│       └── main.tf
```

## 🚀 Quick Start

### Prerequisites
- **AWS CLI** configured with Cape Town region
- **Terraform** v1.5+ installed
- **AWS Credentials** with appropriate permissions

### 1. Initialize Terraform
```bash
terraform init
```

### 2. Plan Infrastructure
```bash
# For staging
terraform workspace select staging

# For production
terraform workspace select production

# Plan changes
terraform plan
```

### 3. Deploy Infrastructure
```bash
terraform apply
```

## 🔒 Security Features

### PCI DSS Compliance Ready
- **Network Segmentation**: Public/private/database subnet isolation
- **Encryption**: All data encrypted at rest and in transit
- **Access Control**: Principle of least privilege
- **Monitoring**: Comprehensive logging and alerting

### Ethiopian Market Security
- **Payment Processing**: Secure architecture for Ethiopian payment gateways
- **Data Localization**: Data residency controls
- **Audit Trails**: Comprehensive transaction logging

## 🗄️ Database Configuration

### PostgreSQL RDS (af-south-1)
- **Engine Version**: PostgreSQL 15.4
- **Instance Class**: 
  - Development: `db.t4g.medium`
  - Production: `db.r6g.large`
- **Storage**: GP3 with auto-scaling
- **Encryption**: AES-256 with KMS
- **Backup**: 30 days retention (production)

### Performance Optimization
- **Memory Settings**: Tuned for Ethiopian creator platform load
- **Monitoring**: Enhanced monitoring enabled (production)
- **Time Zone**: Africa/Nairobi for Ethiopian market
- **Localization**: UTF-8 support for Amharic/English

## 🔐 Environment Variables

### Database Credentials
Set these in your environment or Terraform variables:

```bash
DB_USERNAME=habesha_store_admin
DB_PASSWORD=<secure-password>
```

### Terraform Variables
Create `terraform.tfvars`:

```hcl
db_username = "habesha_store_admin"
db_password = "your-secure-password-here"
environment = "staging"
```

## 📊 Monitoring & Alerting

### Infrastructure Monitoring
- **CloudWatch**: CPU, memory, disk, network metrics
- **RDS Enhanced Monitoring**: Database performance insights
- **Security Groups**: Access pattern monitoring
- **VPC Flow Logs**: Network traffic analysis

### Ethiopian User Optimization
- **Latency Monitoring**: Cape Town to Ethiopia response times
- **Bandwidth Analysis**: Ethiopian internet infrastructure patterns
- **Performance Baselines**: Mobile-optimized thresholds

## 🏷️ Resource Tagging

All resources are tagged with:
- `Project`: habesha-store
- `Environment`: staging/production
- `ManagedBy`: Terraform
- `Region`: Cape Town
- `Purpose`: Ethiopian Creator Platform

## ⚡ Performance Considerations

### Cape Town Region Benefits
- **~200ms latency** to Addis Ababa (vs ~300ms from other regions)
- **Local data residency** for Ethiopian compliance
- **Optimized CDN** for Ethiopian telecom networks
- **Cost-effective scaling** for Ethiopian market size

### Bandwidth Optimization
- **Mobile-first design**: Optimized for Ethiopian telecom speeds
- **CDN integration**: Local content delivery
- **Caching strategy**: Redis for session and application data

## 🔄 Deployment Strategy

### GitOps Integration
- **GitHub Actions**: Automated testing and deployment
- **Environment Separation**: Staging and production workspaces
- **Approval Gates**: Manual approval for production deployments

### Blue-Green Deployment Ready
- **ALB Target Groups**: Configured for blue-green deployments
- **Route53 Integration**: DNS-based traffic shifting
- **Rollback Procedures**: Automated rollback capabilities

## 📞 Support & Maintenance

### Monitoring Alerts
- Database connection issues
- High CPU/memory usage
- Security violations
- Performance degradation

### Backup Strategy
- **Daily Backups**: Automated snapshots
- **Point-in-Time Recovery**: 30 days retention
- **Cross-Region Backups**: Disaster recovery ready

## 🚨 Emergency Procedures

### Incident Response
1. **CloudWatch Alarms** trigger PagerDuty
2. **Auto-scaling** handles traffic spikes
3. **Circuit Breakers** protect payment processing
4. **Failover Procedures** ensure business continuity

---

**Note**: This infrastructure is designed to support Ethiopian localized payments, Amharic language support, and mobile-optimized performance for the Ethiopian creator economy.
