resource "aws_lb" "habesha_store" {
  name               = "habesha-store-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = var.security_groups
  subnets            = var.public_subnets

  enable_deletion_protection = var.environment == "production"

  tags = {
    Name        = "habesha-store-alb"
    Environment = var.environment
    Purpose     = "ALB for Ethiopian creator platform"
  }
}

# HTTP to HTTPS redirect
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.habesha_store.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# HTTPS listener with SSL certificate
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.habesha_store.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = var.ssl_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.habesha_store.arn
  }
}

# Target group for the web application
resource "aws_lb_target_group" "habesha_store" {
  name        = "habesha-store-tg-${var.environment}"
  port        = var.target_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher            = "200"
    path               = "/health"
    port               = "traffic-port"
    protocol           = "HTTP"
    timeout            = 5
    unhealthy_threshold = 2
  }

  stickiness {
    type            = "lb_cookie"
    cookie_duration = 3600
    enabled         = true
  }

  tags = {
    Name        = "habesha-store-target-group"
    Environment = var.environment
  }
}

# CloudWatch alarms for ALB monitoring
resource "aws_cloudwatch_metric_alarm" "alb_target_response_time" {
  alarm_name          = "habesha-store-alb-response-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "3"
  metric_name        = "TargetResponseTime"
  namespace          = "AWS/ApplicationELB"
  period             = "300"
  statistic          = "Average"
  threshold          = var.response_time_threshold
  alarm_description  = "ALB target response time exceeds threshold"
  alarm_actions      = [] # Add SNS topic ARN for notifications

  dimensions = {
    LoadBalancer = aws_lb.habesha_store.arn_suffix
  }

  tags = {
    Name        = "habesha-store-alb-alarm"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "alb_5xx_count" {
  alarm_name          = "habesha-store-alb-5xx-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "HTTPCode_Target_5XX_Count"
  namespace          = "AWS/ApplicationELB"
  period             = "300"
  statistic          = "Sum"
  threshold          = var.error_threshold
  alarm_description  = "ALB 5xx error count exceeds threshold"
  alarm_actions      = [] # Add SNS topic ARN for notifications

  dimensions = {
    LoadBalancer = aws_lb.habesha_store.arn_suffix
  }
}

# CloudWatch Dashboard for ALB monitoring
resource "aws_cloudwatch_dashboard" "alb_monitoring" {
  dashboard_name = "habesha-store-alb-${var.environment}"

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
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", aws_lb.habesha_store.arn_suffix, { "yAxis" = "left" }],
            [".", "TargetResponseTime", ".", ".", { "yAxis" = "right" }]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "ALB Request Count & Response Time"
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
          stacked = true
          metrics = [
            ["AWS/ApplicationELB", "HTTPCode_Target_2XX_Count", "LoadBalancer", aws_lb.habesha_store.arn_suffix],
            [".", "HTTPCode_Target_4XX_Count", ".", "."],
            [".", "HTTPCode_Target_5XX_Count", ".", "."]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "ALB Response Codes (Ethiopian Traffic)"
        }
      }
    ]
  })
}

# Route 53 alias record (if domain is provided)
resource "aws_route53_record" "habesha_store" {
  count   = var.domain_name != null ? 1 : 0
  zone_id = var.route53_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.habesha_store.dns_name
    zone_id               = aws_lb.habesha_store.zone_id
    evaluate_target_health = true
  }
}

# WAF Association with ALB
resource "aws_wafv2_web_acl_association" "habesha_store" {
  resource_arn = aws_lb.habesha_store.arn
  web_acl_arn  = var.waf_arn
}
