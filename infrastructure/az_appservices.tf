
resource "azurerm_service_plan" "asp" {
  location            = var.location
  name                = "asp-appelent-${var.environment}-01"
  os_type             = "Linux"
  resource_group_name = azurerm_resource_group.rg.name
  sku_name            = "B1"
}
