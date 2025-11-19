variable "sqs_name" {}
resource "aws_sqs_queue" "queue" {
  name = var.sqs_name
  visibility_timeout_seconds = 60
}
