variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
}

variable "rate_limit" {
  description = "Rate limiting threshold for Ethiopian traffic"
  type        = number
  default     = 1000

  validation {
    condition     = var.rate_limit >= 100 && var.rate_limit <= 10000
    error_message = "Rate limit must be between 100 and 10000 requests per 5 minutes"
  }
}

variable "waf_alarm_threshold" {
  description = "Threshold for WAF blocked requests alarm"
  type        = number
  default     = 100
}

variable "log_bucket_arn" {
  description = "ARN of the S3 bucket for WAF access logs"
  type        = string
}

variable "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution for Shield protection"
  type        = string
  default     = null
}
