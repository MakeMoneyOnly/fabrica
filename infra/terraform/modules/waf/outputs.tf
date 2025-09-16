output "waf_arn" {
  description = "ARN of the WAF WebACL for Ethiopian traffic protection"
  value       = aws_wafv2_web_acl.habesha_store.arn
}

output "waf_id" {
  description = "ID of the WAF WebACL"
  value       = aws_wafv2_web_acl.habesha_store.id
}

output "cloudfront_dashboard_url" {
  description = "CloudWatch dashboard URL for WAF monitoring"
  value       = "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=${aws_cloudwatch_dashboard.waf_monitoring.dashboard_name}"
}

output "shield_protection_id" {
  description = "Shield Advanced protection ID (production only)"
  value       = var.environment == "production" ? aws_shield_protection.cloudfront[0].id : null
}
