resource "aws_wafv2_web_acl" "habesha_store" {
  name        = "habesha-store-waf-${var.environment}"
  description = "WAF for Ethiopian Creator Platform - PCI DSS compliant"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  # AWS Common Rule Set
  rule {
    name     = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled  = true
    }
  }

  # SQL Injection Rules
  rule {
    name     = "AWS-AWSManagedRulesSQLiRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "AWSManagedRulesSQLiRuleSet"
      sampled_requests_enabled  = true
    }
  }

  # XSS Prevention Rules (Critical for Ethiopian market)
  rule {
    name     = "AWS-AWSManagedRulesXSSRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesXSSRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "AWSManagedRulesXSSRuleSet"
      sampled_requests_enabled  = true
    }
  }

  # Known Bad Inputs Rules
  rule {
    name     = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
    priority = 4

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "AWSManagedRulesKnownBadInputsRuleSet"
      sampled_requests_enabled  = true
    }
  }

  # Amazon IP Reputation List
  rule {
    name     = "AWS-AWSManagedRulesAmazonIpReputationList"
    priority = 5

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "AWSManagedRulesAmazonIpReputationList"
      sampled_requests_enabled  = true
    }
  }

  # Rate Limiting for Ethernet market
  rule {
    name     = "RateLimit-Ethiopian"
    priority = 6

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = var.rate_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "RateLimitEthiopian"
      sampled_requests_enabled  = true
    }
  }

  # Geographic restrictions for compliance (optional)
  rule {
    name     = "GeoRestriction-Ethiopian"
    priority = 7

    action {
      allow {} # Allow Ethiopian traffic
    }

    statement {
      geo_match_statement {
        country_codes = ["ET", "KE", "TZ", "UG", "SD", "DJ", "SO", "SS"]
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "GeoRestrictionEthiopian"
      sampled_requests_enabled  = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name               = "habesha-store-waf-${var.environment}"
    sampled_requests_enabled  = true
  }
}

# WAF Logging Configuration
resource "aws_wafv2_web_acl_logging_configuration" "habesha_store" {
  resource_arn = aws_wafv2_web_acl.habesha_store.arn

  logging_destination_configs = [
    var.log_bucket_arn
  ]

  # Redact sensitive payment data for PCI compliance
  redacted_fields {
    single_header {
      name = "authorization"
    }
  }

  redacted_fields {
    single_header {
      name = "x-amz-security-token"
    }
  }
}

# CloudWatch Alarms for WAF
resource "aws_cloudwatch_metric_alarm" "waf_blocked_requests" {
  alarm_name          = "habesha-store-waf-blocked-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "BlockedRequests"
  namespace          = "AWS/WAFV2"
  period             = "300"
  statistic          = "Sum"
  threshold          = var.waf_alarm_threshold
  alarm_description  = "WAF blocked requests exceed threshold"
  alarm_actions      = [] # Add SNS topic ARN for notifications

  dimensions = {
    WebACL = aws_wafv2_web_acl.habesha_store.name
    Region = "us-east-1" # CloudFront WAF metrics are in us-east-1
  }

  tags = {
    Name        = "habesha-store-waf-alarm"
    Environment = var.environment
  }
}

# CloudWatch Dashboard for WAF Monitoring
resource "aws_cloudwatch_dashboard" "waf_monitoring" {
  dashboard_name = "habesha-store-waf-${var.environment}"

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
            ["AWS/WAFV2", "AllowedRequests", "WebACL", aws_wafv2_web_acl.habesha_store.name, { "Region" = "us-east-1" }]
          ]
          period = 300
          stat   = "Sum"
          region = "us-east-1"
          title  = "WAF Allowed Requests (Ethiopian Traffic)"
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
            ["AWS/WAFV2", "BlockedRequests", "WebACL", aws_wafv2_web_acl.habesha_store.name, { "Region" = "us-east-1" }]
          ]
          period = 300
          stat   = "Sum"
          region = "us-east-1"
          title  = "WAF Blocked Requests (Security Threats)"
        }
      }
    ]
  })
}

# Shield Advanced (for production - high volume protection)
resource "aws_shield_protection" "cloudfront" {
  count = var.environment == "production" ? 1 : 0

  name         = "habesha-store-shield-${var.environment}"
  resource_arn = var.cloudfront_distribution_arn

  tags = {
    Name        = "habesha-store-shield"
    Environment = var.environment
    Purpose     = "DDoS protection for Ethiopian platform"
  }
}
