
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
      source = "integrations/github"
      version = "5.4.0"
    }
    azuread = {
      source = "hashicorp/azuread"
      version = "2.29.0"
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