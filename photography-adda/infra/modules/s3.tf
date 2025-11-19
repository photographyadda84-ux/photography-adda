variable "bucket_name" {}
resource "aws_s3_bucket" "uploads" {
  bucket = var.bucket_name
  acl    = "private"
  versioning { enabled = true }
}
