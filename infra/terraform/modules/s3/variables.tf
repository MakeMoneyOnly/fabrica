variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
}

variable "kms_key_arn" {
  description = "ARN of the KMS key for S3 bucket encryption"
  type        = string
}

variable "log_bucket_id" {
  description = "ID of the S3 bucket for access logs"
  type        = string
}

variable "cloudfront_oai_arn" {
  description = "ARN of the CloudFront Origin Access Identity for S3 access"
  type        = string
}

variable "file_processing_lambda_arn" {
  description = "ARN of the Lambda function for file processing"
  type        = string
  default     = ""
}

variable "s3_alarm_4xx_threshold" {
  description = "Threshold for S3 4xx error alarm"
  type        = number
  default     = 10
}

variable "s3_alarm_5xx_threshold" {
  description = "Threshold for S3 5xx error alarm"
  type        = number
  default     = 5
}

variable "create_log_bucket" {
  description = "Whether to create a separate bucket for logs"
  type        = bool
  default     = true
}
