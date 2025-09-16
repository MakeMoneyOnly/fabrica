terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "habesha-store-terraform-state"
    key            = "terraform.tfstate"
    region         = "af-south-1"
    dynamodb_table = "habesha-store-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = "af-south-1" # Cape Town region for Ethiopian user optimization

  default_tags {
    tags = {
      Project     = "Habesha Store"
      Environment = terraform.workspace
      ManagedBy   = "Terraform"
      Region      = "Cape Town"
      Purpose     = "Ethiopian Creator Platform"
    }
  }
}

# Create VPC
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr            = "10.0.0.0/16"
  public_subnets      = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets     = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  database_subnets    = ["10.0.7.0/24", "10.0.8.0/24", "10.0.9.0/24"]
  availability_zones  = ["af-south-1a", "af-south-1b", "af-south-1c"]
  environment         = terraform.workspace
}

# Create security groups
module "security_groups" {
  source = "./modules/security-groups"

  vpc_id      = module.vpc.vpc_id
  environment = terraform.workspace
}

# Create RDS PostgreSQL database
module "rds" {
  source = "./modules/rds"

  vpc_id             = module.vpc.vpc_id
  database_subnets   = module.vpc.database_subnets
  security_group_id  = module.security_groups.rds_sg_id
  environment        = terraform.workspace
}

# Create ElastiCache Redis cluster
module "redis" {
  source = "./modules/redis"

  vpc_id            = module.vpc.vpc_id
  private_subnets   = module.vpc.private_subnets
  security_group_id = module.security_groups.redis_sg_id
  environment       = terraform.workspace
}

# Create ALB for web applications
module "alb" {
  source = "./modules/alb"

  vpc_id             = module.vpc.vpc_id
  public_subnets     = module.vpc.public_subnets
  security_group_id  = module.security_groups.alb_sg_id
  environment        = terraform.workspace
}

# Create WAF for PCI DSS compliance
module "waf" {
  source = "./modules/waf"

  alb_arn     = module.alb.alb_arn
  environment = terraform.workspace
}

# Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis ElastiCache endpoint"
  value       = module.redis.endpoint
  sensitive   = true
}

output "alb_dns_name" {
  description = "ALB DNS name for web applications"
  value       = module.alb.dns_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.waf.cloudfront_distribution_id
}
