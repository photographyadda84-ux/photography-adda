terraform {
  required_providers {
    aws = { source = "hashicorp/aws" version = ">= 4.0" }
  }
}
provider "aws" {
  region = var.aws_region
}
variable "aws_region" { default = "ap-south-1" }
# S3 buckets, ECR, ECS cluster, SQS etc to be added here in modules
