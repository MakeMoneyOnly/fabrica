resource "aws_db_instance" "postgresql" {
  identifier = "habesha-store-postgres-${var.environment}"

  # Engine configuration
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.environment == "production" ? "db.r6g.large" : "db.t4g.medium"

  # Database configuration
  db_name  = "habesha_store"
  username = var.db_username
  password = var.db_password

  # Storage
  allocated_storage     = var.environment == "production" ? 100 : 20
  max_allocated_storage = var.environment == "production" ? 1000 : 50
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id           = aws_kms_key.rds.arn

  # Network
  db_subnet_group_name   = var.database_subnets
  vpc_security_group_ids = [var.security_group_id]
  publicly_accessible    = false

  # Backup and maintenance
  backup_retention_period = var.environment == "production" ? 30 : 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  # Monitoring
  monitoring_interval          = var.environment == "production" ? 30 : 0
  monitoring_role_arn         = var.environment == "production" ? aws_iam_role.rds_monitoring[0].arn : null
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  # Parameter group for Ethiopian localization
  parameter_group_name = aws_db_parameter_group.postgresql.name

  # Final snapshot
  skip_final_snapshot       = var.environment != "production"
  final_snapshot_identifier = var.environment == "production" ? "habesha-store-final-snapshot-${var.environment}-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  # Performance Insights (production only)
  performance_insights_enabled    = var.environment == "production"
  performance_insights_kms_key_id = var.environment == "production" ? aws_kms_key.rds.arn : null

  tags = {
    Name = "habesha-store-postgres-${var.environment}"
    Environment = var.environment
    Service     = "Database"
    Engine      = "PostgreSQL"
  }
}

# RDS Parameter Group with Ethiopian localization settings
resource "aws_db_parameter_group" "postgresql" {
  family = "postgres15"
  name   = "habesha-store-postgres-${var.environment}"

  parameter {
    name  = "timezone"
    value = "Africa/Nairobi" # Closest major timezone to Ethiopia
  }

  parameter {
    name  = "lc_collate"
    value = "en_US.UTF-8"
  }

  parameter {
    name  = "lc_ctype"
    value = "en_US.UTF-8"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements" # For query performance monitoring
  }

  # Ethiopian market performance tuning
  parameter {
    name  = "work_mem"
    value = var.environment == "production" ? "8192" : "1024" # KB
  }

  parameter {
    name  = "maintenance_work_mem"
    value = var.environment == "production" ? "2097152" : "65536" # KB (2GB for prod, 64MB for staging)
  }

  parameter {
    name  = "effective_cache_size"
    value = var.environment == "production" ? "8GB" : "1GB"
  }

  tags = {
    Name = "habesha-store-postgres-params-${var.environment}"
  }
}

# KMS key for RDS encryption
resource "aws_kms_key" "rds" {
  description         = "KMS key for RDS encryption - Habesha Store"
  key_usage          = "ENCRYPT_DECRYPT"
  key_spec           = "SYMMETRIC_DEFAULT"
  key_manager        = "CUSTOMER"
  enable_key_rotation = true

  tags = {
    Name = "habesha-store-rds-key-${var.environment}"
  }
}

# KMS key alias
resource "aws_kms_alias" "rds" {
  name          = "alias/habesha-store-rds-${var.environment}"
  target_key_id = aws_kms_key.rds.key_id
}

# IAM role for RDS monitoring (production only)
resource "aws_iam_role" "rds_monitoring" {
  count = var.environment == "production" ? 1 : 0
  name  = "habesha-store-rds-monitoring-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "habesha-store-rds-monitoring-${var.environment}"
  }
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  count      = var.environment == "production" ? 1 : 0
  role       = aws_iam_role.rds_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}
