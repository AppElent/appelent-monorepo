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

resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_resources_dev" {
  name             = "Allow-Azure-resources"
  server_id        = azurerm_postgresql_flexible_server.postgresql_dev.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
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

resource "azurerm_postgresql_flexible_server" "postgresql_prd" {
  name                = "pgql-appelent-prd"
  resource_group_name = azurerm_resource_group.rg_prd_data.name
  location            = azurerm_resource_group.rg_prd_data.location
  version             = "14"
  //delegated_subnet_id    = azurerm_subnet.subnet01.id
  //private_dns_zone_id    = azurerm_private_dns_zone.postgres.id
  administrator_login    = "psqladmin"
  administrator_password = random_string.postgres_prd_password.result

  storage_mb = 32768
  zone       = 2

  sku_name = "B_Standard_B1ms"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_resources_prd" {
  name             = "Allow-Azure-resources"
  server_id        = azurerm_postgresql_flexible_server.postgresql_prd.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "random_string" "postgres_prd_password" {
  length  = 40
  special = false
}

locals {
  database_server_url_dev = "postgres://${azurerm_postgresql_flexible_server.postgresql_dev.administrator_login}:${random_string.postgres_dev_password.result}@${azurerm_postgresql_flexible_server.postgresql_dev.name}.postgres.database.azure.com"
  database_server_url_prd = "postgres://${azurerm_postgresql_flexible_server.postgresql_prd.administrator_login}:${random_string.postgres_prd_password.result}@${azurerm_postgresql_flexible_server.postgresql_prd.name}.postgres.database.azure.com"
}

resource "azurerm_postgresql_flexible_server_database" "django_api_dev" {
  name      = "django-api"
  server_id = azurerm_postgresql_flexible_server.postgresql_dev.id
}

resource "azurerm_postgresql_flexible_server_database" "django_api_prd" {
  name      = "django-api"
  server_id = azurerm_postgresql_flexible_server.postgresql_prd.id
}


# data "null_data_source" "postgres_database_url" {
#     inputs = {
#       dev = "postgres://${azurerm_postgresql_flexible_server.postgresql_dev.administrator_login}:${random_string.postgres_dev_password.result}@p${azurerm_postgresql_flexible_server.postgresql_dev.name}.postgres.database.azure.com/django-api" //"app.api${var.env_name == "prod" ? "." : ".${var.env_name}."}mydomain.com"
#     }
# }

