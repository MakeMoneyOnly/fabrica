output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for Ethiopian optimization"
  value       = aws_cloudfront_distribution.habesha_store.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.habesha_store.domain_name
}

output "cloudfront_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.habesha_store.arn
}

output "lambda_edge_function_arn" {
  description = "ARN of the Lambda@Edge function for security headers"
  value       = aws_lambda_function.security_headers.qualified_arn
}

output "origin_access_identity_id" {
  description = "CloudFront Origin Access Identity ID for S3 integration"
  value       = aws_cloudfront_origin_access_identity.oai.id
}
