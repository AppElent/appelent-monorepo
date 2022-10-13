// RG based per environment
resource "azurerm_resource_group" "rg" {
  location = var.location
  name     = "rg-appelent-${var.environment}"
}

// RG used as shared RG between environments
resource "azurerm_resource_group" "rg_shared" {
  location = var.location
  name     = "rg-appelent-shared"
}

// RG used as RG for static web apps
resource "azurerm_resource_group" "rg_swa" {
  location = var.location
  name     = "rg-appelent-swa"
}