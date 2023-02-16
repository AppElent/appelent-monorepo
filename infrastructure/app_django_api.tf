resource "azurerm_key_vault_secret" "akv_secret_appconfig_endpoint_local" {
  name         = "app-configuration-endpoint"
  value        = azurerm_app_configuration.app_config.endpoint
  key_vault_id = azurerm_key_vault.keyvault_local.id
}

resource "azurerm_key_vault_secret" "akv_secret_appconfig_endpoint_dev" {
  name         = "app-configuration-endpoint"
  value        = azurerm_app_configuration.app_config.endpoint
  key_vault_id = azurerm_key_vault.keyvault_dev.id
}

resource "azurerm_key_vault_secret" "akv_secret_appconfig_endpoint_prd" {
  name         = "app-configuration-endpoint"
  value        = azurerm_app_configuration.app_config.endpoint
  key_vault_id = azurerm_key_vault.keyvault_prd.id
}

resource "random_string" "django_key_dev" {
  length = 40
}

resource "random_string" "django_key_prd" {
  length = 40
}

resource "azurerm_key_vault_secret" "akv_secret_django_dev" {
  name         = "django-secret"
  value        = random_string.django_key_dev.result
  key_vault_id = azurerm_key_vault.keyvault_dev.id
}

resource "azurerm_key_vault_secret" "akv_secret_django_prd" {
  name         = "django-secret"
  value        = random_string.django_key_prd.result
  key_vault_id = azurerm_key_vault.keyvault_prd.id
}

resource "azurerm_key_vault_secret" "akv_secret_django_database_url_dev" {
  name         = "django-database-server-url"
  value        = local.database_server_url_dev
  key_vault_id = azurerm_key_vault.keyvault_dev.id
}

resource "azurerm_key_vault_secret" "akv_secret_django_database_url_prd" {
  name         = "django-database-server-url"
  value        = local.database_server_url_prd
  key_vault_id = azurerm_key_vault.keyvault_prd.id
}
