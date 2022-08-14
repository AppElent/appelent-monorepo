
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
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
}

provider "heroku" {
  email   = var.heroku_email
  api_key = var.heroku_api_key
}
