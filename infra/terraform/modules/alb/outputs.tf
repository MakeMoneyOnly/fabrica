output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.habesha_store.arn
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.habesha_store.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.habesha_store.zone_id
}

output "target_group_arn" {
  description = "ARN of the target group"
  value       = aws_lb_target_group.habesha_store.arn
}

output "https_listener_arn" {
  description = "ARN of the HTTPS listener"
  value       = aws_lb_listener.https.arn
}

output "http_listener_arn" {
  description = "ARN of the HTTP listener"
  value       = aws_lb_listener.http.arn
}

output "alb_security_groups" {
  description = "Security groups associated with the ALB"
  value       = aws_lb.habesha_store.security_groups
}

output "cloudfront_dashboard_url" {
  description = "CloudWatch dashboard URL for ALB monitoring"
  value       = "https://console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${aws_cloudwatch_dashboard.alb_monitoring.dashboard_name}"
}
