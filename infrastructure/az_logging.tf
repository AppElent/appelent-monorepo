resource "azurerm_log_analytics_workspace" "log_shared" {
  name                = "log-appelent-shared"
  location            = azurerm_resource_group.rg_shared.location
  resource_group_name = azurerm_resource_group.rg_shared.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "apipi_shared" {
  name                = "appi-appelent-shared"
  location            = azurerm_resource_group.rg_shared.location
  resource_group_name = azurerm_resource_group.rg_shared.name
  workspace_id        = azurerm_log_analytics_workspace.log_shared.id
  application_type    = "web"
}