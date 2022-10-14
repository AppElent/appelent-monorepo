resource "azurerm_api_management" "example" {
  name                = "apim-appelent"
  location            = azurerm_resource_group.rg_shared.location
  resource_group_name = azurerm_resource_group.rg_shared.name
  publisher_name      = "Appelent"
  publisher_email     = data.azuread_user.eric.user_principal_name

  sku_name = "Developer_1"
}