// RG based per environment
resource "azurerm_resource_group" "rg_dev" {
  location = var.location
  name     = "rg-appelent-dev"
}

resource "azurerm_resource_group" "rg_prd" {
  location = var.location
  name     = "rg-appelent-prd"
}

resource "azurerm_resource_group" "rg_shared" {
  location = var.location
  name     = "rg-appelent-shared"
}


// RG based per environment
resource "azurerm_resource_group" "rg_dev_data" {
  location = var.location
  name     = "rg-appelent-dev-data"
}

resource "azurerm_resource_group" "rg_prd_data" {
  location = var.location
  name     = "rg-appelent-prd-data"
}

// RG based per environment
resource "azurerm_resource_group" "rg_networking" {
  location = var.location
  name     = "rg-appelent-networking"
}

# // RG used as shared RG between environments
# resource "azurerm_resource_group" "rg_shared" {
#   location = var.location
#   name     = "rg-appelent-shared"
# }

// RG used as RG for static web apps
resource "azurerm_resource_group" "rg_swa" {
  location = var.location
  name     = "rg-appelent-swa"
}

// Resource group for testing
resource "azurerm_resource_group" "rg_testing" {
  location = var.location
  name     = "rg-appelent-testing"
}
