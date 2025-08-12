terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "example" {
  bucket = "my-fintech-super-app-bucket-example"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}
