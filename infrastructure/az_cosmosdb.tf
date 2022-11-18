
resource "azurerm_cosmosdb_account" "cosmosdb" {
  location            = var.location
  name                = "cdb-appelent"
  offer_type          = "Standard"
  resource_group_name = azurerm_resource_group.rg_shared_data.name
  enable_free_tier    = true
  consistency_policy {
    consistency_level = "Strong"
  }
  geo_location {
    failover_priority = 0
    location          = var.location
  }

}

resource "azurerm_key_vault_secret" "cdb_secret_key_dev" {
  name         = "COSMOS-ACCESS-KEY"
  value        = azurerm_cosmosdb_account.cosmosdb.primary_key
  key_vault_id = azurerm_key_vault.keyvault_dev.id
}

resource "azurerm_key_vault_secret" "cdb_secret_key_prd" {
  name         = "COSMOS-ACCESS-KEY"
  value        = azurerm_cosmosdb_account.cosmosdb.primary_key
  key_vault_id = azurerm_key_vault.keyvault_prd.id
}
