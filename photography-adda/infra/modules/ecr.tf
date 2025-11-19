variable "ecr_name" {}
resource "aws_ecr_repository" "repo" {
  name = var.ecr_name
  image_tag_mutability = "MUTABLE"
}
