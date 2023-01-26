
# We strongly recommend using the required_providers block to set the
# Azure Provider source and version being used
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.0.0"
    }
    github = {
      source  = "integrations/github"
      version = ">= 5.4.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = ">= 2.29.0"
    }
    mysql = {
      source  = "petoju/mysql"
      version = ">= 3.0.23"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.14.0"
    }
    http = {
      source  = "hashicorp/http"
      version = ">= 3.1.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
}

provider "github" {
  # Configuration options
}

provider "azuread" {
  # Configuration options
}


provider "mysql" {
  # Configuration options
  endpoint = "${azurerm_mysql_flexible_server.mysql_dev.fqdn}:3306"
  username = "mysql"
  password = random_string.mysql_dev_password.result
  tls      = true
}

provider "kubernetes" {
  # Configuration options
}

provider "http" {
  # Configuration options
}
