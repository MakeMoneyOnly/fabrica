resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "habesha-store-vpc-${var.environment}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "habesha-store-igw-${var.environment}"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count = length(var.public_subnets)

  vpc_id                  = aws_vpc.main.id
  cidr_block             = var.public_subnets[count.index]
  availability_zone      = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name                        = "habesha-store-public-${var.availability_zones[count.index]}-${var.environment}"
    "kubernetes.io/role/elb"    = "1"
    "kubernetes.io/cluster/demo" = "shared"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count = length(var.private_subnets)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name                              = "habesha-store-private-${var.availability_zones[count.index]}-${var.environment}"
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/demo"      = "shared"
  }
}

# Database Subnets
resource "aws_subnet" "database" {
  count = length(var.database_subnets)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.database_subnets[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "habesha-store-database-${var.availability_zones[count.index]}-${var.environment}"
  }
}

# NAT Gateway for private subnets
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "habesha-store-nat-${var.environment}"
  }

  depends_on = [aws_internet_gateway.main]
}

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "habesha-store-nat-eip-${var.environment}"
  }
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "habesha-store-public-rt-${var.environment}"
  }
}

# Private Route Table
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "habesha-store-private-rt-${var.environment}"
  }
}

# Route Table Associations
resource "aws_route_table_association" "public" {
  count = length(var.public_subnets)

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count = length(var.private_subnets)

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "database" {
  count = length(var.database_subnets)

  subnet_id      = aws_subnet.database[count.index].id
  route_table_id = aws_route_table.private.id
}

# Database subnet group
resource "aws_db_subnet_group" "database" {
  name       = "habesha-store-database-${var.environment}"
  subnet_ids = aws_subnet.database[*].id

  tags = {
    Name = "habesha-store-database-subnet-group-${var.environment}"
  }
}
