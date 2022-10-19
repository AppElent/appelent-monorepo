variable "location" {
  default     = "West Europe"
  description = "Location of resources"
}

variable "github_repository" {
  default     = "appelent-monorepo"
  description = "Name of the GitHub repository where the code resides"
}

variable "upn" {
  description = "The upn of the main user"
  default     = "eric.jansen_teamrockstars.nl#EXT#@appelent.onmicrosoft.com"
}
