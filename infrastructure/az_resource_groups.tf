// RG based per environment
resource "azurerm_resource_group" "rg" {
  location = var.location
  name     = "rg-appelent-${var.environment}"
}

// RG based per environment
resource "azurerm_resource_group" "rg_data" {
  location = var.location
  name     = "rg-appelent-data-${var.environment}"
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

// Resource group for testing
resource azurerm_resource_group "rg_testing" {
  location = var.location
  name = "rg-appelent-testing"
}