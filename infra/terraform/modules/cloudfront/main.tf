resource "aws_cloudfront_distribution" "habesha_store" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Habesha Store CDN - Optimized for Ethiopian users"
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # Africa optimized pricing

  # Origin configuration for web app
  origin {
    domain_name = var.alb_dns_name
    origin_id   = "habesha-store-alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    # Ethiopian-specific headers
    custom_header {
      name  = "X-Ethiopian-Market"
      value = "enabled"
    }
  }

  # Ethiopian edge locations optimization
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "habesha-store-alb"

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 86400

    # Ethiopian bandwidth optimization
    compress               = true

    # Security headers for Ethiopian market
    lambda_function_association {
      event_type   = "viewer-response"
      lambda_arn   = aws_lambda_function.security_headers.qualified_arn
      include_body = false
    }
  }

  # Geographic restrictions for Ethiopian compliance
  restrictions {
    geo_restriction {
      restriction_type = "none"
      # Could be configured for Ethiopian market compliance if needed
      # locations        = ["ET", "KE", "TZ", "UG"] # Ethiopia and neighboring countries
    }
  }

  # SSL Certificate
  viewer_certificate {
    cloudfront_default_certificate = true
    # acm_certificate_arn            = var.ssl_certificate_arn
    # ssl_support_method             = "sni-only"
    # minimum_protocol_version       = "TLSv1.2_2021"
    # TODO: Add proper SSL certificate for production
  }

  # Custom error pages for Ethiopian users
  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404.html"
  }

  custom_error_response {
    error_code         = 500
    response_code      = 500
    response_page_path = "/500.html"
  }

  # Ethiopian localized logging
  logging_config {
    include_cookies = false
    bucket          = var.log_bucket_domain_name
    prefix          = "cloudfront/ethiopian-market/"
  }

  # Performance optimizations for Ethiopian bandwidth
  web_acl_id = var.waf_arn

  tags = {
    Name            = "habesha-store-cloudfront"
    Environment     = var.environment
    Service         = "CDN"
    Region          = "Cape Town"
    Purpose         = "Ethiopian Creator Platform"
    Optimization    = "Low Bandwidth"
  }
}

# Lambda@Edge for security headers (Ethiopian compliance)
resource "aws_lambda_function" "security_headers" {
  filename         = data.archive_file.security_headers.output_path
  function_name    = "habesha-store-security-headers-${var.environment}"
  role            = aws_iam_role.lambda_edge.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  publish         = true

  # Ethiopian bandwidth optimization
  memory_size     = 128
  timeout         = 5

  tags = {
    Name        = "habesha-store-security-headers"
    Environment = var.environment
  }
}

# Lambda Edge function code
data "archive_file" "security_headers" {
  type        = "zip"
  output_path = "${path.module}/lambda/security-headers.zip"

  source {
    content = <<EOF
'use strict';

exports.handler = (event, context, callback) => {
    const response = event.Records[0].cf.response;
    const headers = response.headers;

    // Ethiopian security headers
    headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload'
    }];

    headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    }];

    headers['x-frame-options'] = [{
        key: 'X-Frame-Options',
        value: 'DENY'
    }];

    headers['x-xss-protection'] = [{
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    }];

    // Ethiopian market specific
    headers['x-ethiopian-market'] = [{
        key: 'X-Ethiopian-Market',
        value: 'optimized'
    }];

    // CORS for Ethiopian domains
    headers['access-control-allow-origin'] = [{
        key: 'Access-Control-Allow-Origin',
        value: '*.habesha.store'
    }];

    callback(null, response);
};
EOF
    filename = "index.js"
  }
}

# IAM role for Lambda@Edge
resource "aws_iam_role" "lambda_edge" {
  name = "habesha-store-lambda-edge-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
        }
      }
    ]
  })

  tags = {
    Name        = "habesha-store-lambda-edge-role"
    Environment = var.environment
  }
}

resource "aws_iam_role_policy" "lambda_edge" {
  name = "habesha-store-lambda-edge-policy-${var.environment}"
  role = aws_iam_role.lambda_edge.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# CloudFront Origin Access Identity for S3 (if needed for static assets)
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "Habesha Store OAI for Ethiopian static assets"
}
