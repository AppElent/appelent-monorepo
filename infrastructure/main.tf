// Current context (logged in user and tenant)
data "azurerm_client_config" "current" {}

resource "random_string" "random_string01" {
  length  = 10
  lower   = true
  special = false
}

