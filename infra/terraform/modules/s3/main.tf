resource "aws_s3_bucket" "habesha_store_files" {
  bucket = "habesha-store-files-${var.environment}-${random_string.suffix.result}"

  tags = {
    Name        = "habesha-store-files"
    Environment = var.environment
    Purpose     = "Digital product storage for Ethiopian creators"
  }
}

resource "random_string" "suffix" {
  length  = 8
  lower   = true
  upper   = false
  numeric = true
  special = false
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "habesha_store_files" {
  bucket = aws_s3_bucket.habesha_store_files.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "habesha_store_files" {
  bucket = aws_s3_bucket.habesha_store_files.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
      kms_master_key_id = var.kms_key_arn
    }
    bucket_key_enabled = true
  }
}

# S3 Bucket Public Access Block (for PCI compliance)
resource "aws_s3_bucket_public_access_block" "habesha_store_files" {
  bucket = aws_s3_bucket.habesha_store_files.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket Logging
resource "aws_s3_bucket_logging" "habesha_store_files" {
  bucket = aws_s3_bucket.habesha_store_files.id

  target_bucket = var.log_bucket_id
  target_prefix = "s3-access-logs/habesha-store-files/"
}

# S3 Bucket Lifecycle Policy for Digital Products
resource "aws_s3_bucket_lifecycle_configuration" "habesha_store_files" {
  bucket = aws_s3_bucket.habesha_store_files.id

  rule {
    id     = "file_cleanup"
    status = "Enabled"

    # Move files to IA after 30 days
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    # Move files to Glacier after 90 days
    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    # Delete temporary files after 7 days
    filter {
      prefix = "temp/"
    }
    expiration {
      days = 7
    }
  }

  rule {
    id     = "incomplete_multipart_cleanup"
    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# S3 Bucket Notification for Lambda Processing
resource "aws_s3_bucket_notification" "habesha_store_files" {
  bucket = aws_s3_bucket.habesha_store_files.id

  lambda_function {
    lambda_function_arn = var.file_processing_lambda_arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
  }

  depends_on = [aws_lambda_permission.allow_bucket]
}

# Lambda Permission for S3 Bucket Notification
resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowS3InvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = var.file_processing_lambda_arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.habesha_store_files.arn
}

# S3 Bucket Policy for CloudFront Origin Access Identity
data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.habesha_store_files.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [var.cloudfront_oai_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "habesha_store_files" {
  bucket = aws_s3_bucket.habesha_store_files.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

# CORS Configuration for Ethiopian mobile users
resource "aws_s3_bucket_cors_configuration" "habesha_store_files" {
  bucket = aws_s3_bucket.habesha_store_files.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = [
      "https://*.habesha.store",
      "https://localhost:3000",
      "https://localhost:3001"
    ]
    max_age_seconds = 3000
  }
}

# CloudWatch Monitoring for S3
resource "aws_cloudwatch_metric_alarm" "s3_4xx_errors" {
  alarm_name          = "habesha-store-s3-4xx-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "4xxErrors"
  namespace          = "AWS/S3"
  period             = "300"
  statistic          = "Sum"
  threshold          = var.s3_alarm_4xx_threshold
  alarm_description  = "S3 4xx errors exceed threshold"
  alarm_actions      = [] # Add SNS topic ARN for notifications

  dimensions = {
    BucketName = aws_s3_bucket.habesha_store_files.bucket
    FilterId   = "EntireBucket"
  }
}

resource "aws_cloudwatch_metric_alarm" "s3_5xx_errors" {
  alarm_name          = "habesha-store-s3-5xx-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "5xxErrors"
  namespace          = "AWS/S3"
  period             = "300"
  statistic          = "Sum"
  threshold          = var.s3_alarm_5xx_threshold
  alarm_description  = "S3 5xx errors exceed threshold"
  alarm_actions      = [] # Add SNS topic ARN for notifications

  dimensions = {
    BucketName = aws_s3_bucket.habesha_store_files.bucket
    FilterId   = "EntireBucket"
  }
}

# CloudWatch Dashboard for S3 Monitoring
resource "aws_cloudwatch_dashboard" "s3_monitoring" {
  dashboard_name = "habesha-store-s3-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          view    = "timeSeries"
          stacked = false
          metrics = [
            ["AWS/S3", "NumberOfObjects", "BucketName", aws_s3_bucket.habesha_store_files.bucket, "StorageType", "AllStorageTypes", { "yAxis" = "left" }]
          ]
          period = 300
          stat   = "Maximum"
          region = "af-south-1"
          title  = "S3 Objects Count (Digital Products)"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          view    = "timeSeries"
          stacked = false
          metrics = [
            ["AWS/S3", "BucketSizeBytes", "BucketName", aws_s3_bucket.habesha_store_files.bucket, "StorageType", "StandardStorage", { "yAxis" = "left" }]
          ]
          period = 300
          stat   = "Maximum"
          region = "af-south-1"
          title  = "S3 Storage Size (Bytes)"
        }
      }
    ]
  })
}

# Additional S3 Bucket for Access Logs
resource "aws_s3_bucket" "logs" {
  count  = var.create_log_bucket ? 1 : 0
  bucket = "habesha-store-logs-${var.environment}-${random_string.log_suffix.result}"

  tags = {
    Name        = "habesha-store-logs"
    Environment = var.environment
    Purpose     = "Access logs for Ethiopian platform monitoring"
  }
}

resource "random_string" "log_suffix" {
  count   = var.create_log_bucket ? 1 : 0
  length  = 8
  lower   = true
  upper   = false
  numeric = true
  special = false
}

# Log Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "logs" {
  count  = var.create_log_bucket ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Log Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "logs" {
  count  = var.create_log_bucket ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Log Bucket Lifecycle Policy
resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  count  = var.create_log_bucket ? 1 : 0
  bucket = aws_s3_bucket.logs[0].id

  rule {
    id     = "log_cleanup"
    status = "Enabled"

    # Delete logs after 365 days
    expiration {
      days = 365
    }

    # Move to IA after 30 days
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    # Move to Glacier after 90 days
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}
