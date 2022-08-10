
resource "azurerm_cosmosdb_account" "cosmosdb" {
  location            = var.location
  name                = var.cosmosdb_name
  offer_type          = "Standard"
  resource_group_name = azurerm_resource_group.rg_shared.name
  enable_free_tier    = true
  consistency_policy {
    consistency_level = "Strong"
  }
  geo_location {
    failover_priority = 0
    location          = var.location
  }

}
