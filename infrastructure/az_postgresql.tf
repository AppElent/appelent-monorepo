# resource "azurerm_private_dns_zone" "postgres" {
#   name                = "${var.environment}.postgres.database.azure.com"
#   resource_group_name = azurerm_resource_group.rg_data.name
# }

resource "azurerm_postgresql_flexible_server" "postgresql" {
  name                   = "pgql-appelent-${var.environment}"
  resource_group_name    = azurerm_resource_group.rg_data.name
  location               = azurerm_resource_group.rg_data.location
  version                = "14"
  //delegated_subnet_id    = azurerm_subnet.subnet01.id
  //private_dns_zone_id    = azurerm_private_dns_zone.postgres.id
  administrator_login    = "psqladmin"
  administrator_password = random_string.postgres_password.result

  storage_mb = 32768

  sku_name   = "B_Standard_B1ms"
}

resource "random_string" "postgres_password" {
  length  = 40
  special = false
}

resource "azurerm_key_vault_secret" "akv_secret_postgres" {
  name         = "postgres-${var.environment}"
  value        = random_string.postgres_password.result
  key_vault_id = azurerm_key_vault.deployment_keyvault.id
}