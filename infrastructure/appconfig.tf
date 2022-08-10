
resource "azurerm_app_configuration" "app_config" {
  location            = var.environment == "dev" ? "North Europe" : "West Europe"
  name                = "appelent-ac-${var.environment}"
  resource_group_name = azurerm_resource_group.rg

}
