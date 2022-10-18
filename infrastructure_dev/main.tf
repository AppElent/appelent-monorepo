data "azuread_user" "me" {
  user_principal_name = "eric.jansen_teamrockstars.nl#EXT#@appelent.onmicrosoft.com"
}

// Current context (logged in user and tenant)
data "azurerm_client_config" "current" {}

resource "random_string" "random_string01" {
  length  = 10
  lower   = true
  special = false
}

