# resource "azurerm_private_dns_zone" "postgres" {
#   name                = "${var.environment}.postgres.database.azure.com"
#   resource_group_name = azurerm_resource_group.rg_data.name
# }

resource "azurerm_postgresql_flexible_server" "postgresql_dev" {
  name                = "pgql-appelent-dev"
  resource_group_name = azurerm_resource_group.rg_dev_data.name
  location            = azurerm_resource_group.rg_dev_data.location
  version             = "14"
  //delegated_subnet_id    = azurerm_subnet.subnet01.id
  //private_dns_zone_id    = azurerm_private_dns_zone.postgres.id
  administrator_login    = "psqladmin"
  administrator_password = random_string.postgres_dev_password.result

  storage_mb = 32768
  zone       = 2

  sku_name = "B_Standard_B1ms"
}

resource "random_string" "postgres_dev_password" {
  length  = 40
  special = false
}

resource "azurerm_key_vault_secret" "akv_secret_postgres_dev" {
  name         = "postgres-secret"
  value        = random_string.postgres_dev_password.result
  key_vault_id = azurerm_key_vault.deployment_keyvault.id
}
