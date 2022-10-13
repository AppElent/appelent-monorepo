
variable "environment" {
  default     = "dev"
  description = "Environment name"
}

variable "location" {
  default     = "West Europe"
  description = "Location of resources"
}

variable "github_repository" {
  default = "appelent-monorepo"
  description = "Name of the GitHub repository where the code resides"
}