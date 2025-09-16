variable "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  type        = string
}

variable "waf_arn" {
  description = "ARN of the WAF WebACL for Ethiopian traffic protection"
  type        = string
}

variable "log_bucket_domain_name" {
  description = "Domain name of the S3 bucket for CloudFront access logs"
  type        = string
}

variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
}

variable "ssl_certificate_arn" {
  description = "ARN of the SSL certificate for CloudFront distribution"
  type        = string
  default     = null
}

variable "price_class" {
  description = "CloudFront price class for Ethiopian edge optimization"
  type        = string
  default     = "PriceClass_100"

  validation {
    condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.price_class)
    error_message = "Price class must be PriceClass_All, PriceClass_200, or PriceClass_100"
  }
}
