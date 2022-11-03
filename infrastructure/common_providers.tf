
# We strongly recommend using the required_providers block to set the
# Azure Provider source and version being used
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.0.0"
    }
    heroku = {
      source  = "heroku/heroku"
      version = ">= 5.1.1"
    }
    github = {
      source  = "integrations/github"
      version = ">= 5.4.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = ">= 2.29.0"
    }
    # cloudamqp = {
    #   source  = "cloudamqp/cloudamqp"
    #   version = ">= 1.19.3"
    # }
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

provider "heroku" {

}

provider "github" {
  # Configuration options
}

provider "azuread" {
  # Configuration options
}

# provider "cloudamqp" {
#   # Configuration options
#   apikey = 
# }

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
