terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "Appelent"

    workspaces {
      prefix = "azure-infra-"
    }
  }
}