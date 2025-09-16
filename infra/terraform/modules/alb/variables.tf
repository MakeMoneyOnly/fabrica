variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "af-south-1"
}

variable "vpc_id" {
  description = "VPC ID where ALB will be created"
  type        = string
}

variable "public_subnets" {
  description = "List of public subnet IDs for ALB"
  type        = list(string)
}

variable "security_groups" {
  description = "List of security group IDs for ALB"
  type        = list(string)
}

variable "ssl_certificate_arn" {
  description = "ARN of the SSL certificate for HTTPS"
  type        = string
}

variable "target_port" {
  description = "Port for the target group"
  type        = number
  default     = 3000
}

variable "domain_name" {
  description = "Domain name for Route 53 record (optional)"
  type        = string
  default     = null
}

variable "route53_zone_id" {
  description = "Route 53 hosted zone ID"
  type        = string
  default     = null
}

variable "waf_arn" {
  description = "ARN of the WAF WebACL to associate with ALB"
  type        = string
}

variable "response_time_threshold" {
  description = "Threshold for ALB response time alarm in seconds"
  type        = number
  default     = 3.0
}

variable "error_threshold" {
  description = "Threshold for ALB 5xx error count alarm"
  type        = number
  default     = 10
}
