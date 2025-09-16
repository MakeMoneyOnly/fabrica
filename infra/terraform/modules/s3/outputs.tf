output "s3_bucket_id" {
  description = "S3 bucket ID for digital products"
  value       = aws_s3_bucket.habesha_store_files.id
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN for digital products"
  value       = aws_s3_bucket.habesha_store_files.arn
}

output "s3_bucket_domain_name" {
  description = "S3 bucket domain name"
  value       = aws_s3_bucket.habesha_store_files.bucket_regional_domain_name
}

output "s3_log_bucket_id" {
  description = "S3 bucket ID for access logs"
  value       = var.create_log_bucket ? aws_s3_bucket.logs[0].id : var.log_bucket_id
}

output "s3_log_bucket_arn" {
  description = "S3 bucket ARN for access logs"
  value       = var.create_log_bucket ? aws_s3_bucket.logs[0].arn : "arn:aws:s3:::${var.log_bucket_id}"
}

output "s3_cloudfront_dashboard_url" {
  description = "CloudWatch dashboard URL for S3 monitoring"
  value       = "https://console.aws.amazon.com/cloudwatch/home?region=af-south-1#dashboards:name=${aws_cloudwatch_dashboard.s3_monitoring.dashboard_name}"
}

output "s3_bucket_regional_domain_name" {
  description = "S3 bucket regional domain name for CloudFront configuration"
  value       = aws_s3_bucket.habesha_store_files.bucket_regional_domain_name
}
