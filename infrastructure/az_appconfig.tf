
resource "azurerm_app_configuration" "app_config" {
  location            = var.location
  name                = "appcnf-appelent"
  resource_group_name = azurerm_resource_group.rg_shared.name
}
