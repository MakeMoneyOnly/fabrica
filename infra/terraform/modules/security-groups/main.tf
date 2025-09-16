# ALB Security Group - Web traffic
resource "aws_security_group" "alb" {
  name_prefix = "habesha-store-alb-${var.environment}-"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP traffic from anywhere"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS traffic from anywhere"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "habesha-store-alb-sg-${var.environment}"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Application Security Group - Backend/API traffic
resource "aws_security_group" "app" {
  name_prefix = "habesha-store-app-${var.environment}-"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "Backend API traffic from ALB"
  }

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "Web app traffic from ALB"
  }

  # SSH access for maintenance (restrict to specific IPs for production)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"] # Limit to VPC CIDR, use specific IPs in production
    description = "SSH access for maintenance"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "habesha-store-app-sg-${var.environment}"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Database Security Group - PostgreSQL traffic
resource "aws_security_group" "rds" {
  name_prefix = "habesha-store-rds-${var.environment}-"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
    description     = "PostgreSQL access from application layer"
  }

  # SSH bastion access (for database maintenance)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"] # Limit to VPC CIDR
    description = "SSH bastion access"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "habesha-store-rds-sg-${var.environment}"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Redis Security Group - ElastiCache traffic
resource "aws_security_group" "redis" {
  name_prefix = "habesha-store-redis-${var.environment}-"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
    description     = "Redis access from application layer"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "habesha-store-redis-sg-${var.environment}"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Bastion Host Security Group - SSH jump box
resource "aws_security_group" "bastion" {
  name_prefix = "habesha-store-bastion-${var.environment}-"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Restrict to specific IPs in production
    description = "SSH access to bastion host"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "habesha-store-bastion-sg-${var.environment}"
  }

  lifecycle {
    create_before_destroy = true
  }
}
