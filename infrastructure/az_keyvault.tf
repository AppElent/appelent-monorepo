data "azuread_user" "eric" {
  user_principal_name = "eric.jansen_teamrockstars.nl#EXT#@appelent.onmicrosoft.com"
}

resource "azurerm_key_vault" "deployment_keyvault" {
  name                        = "kv-appelent-deploy"
  location                    = azurerm_resource_group.rg_shared.location
  resource_group_name         = azurerm_resource_group.rg_shared.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = true

  sku_name                  = "standard"
  enable_rbac_authorization = true
}

# ADD logged in user to Key Vault Secret Officer 
resource "azurerm_role_assignment" "akv_sp_roleassignment" {
  scope                = azurerm_key_vault.deployment_keyvault.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azurerm_client_config.current.object_id
}

# ADD Eric Jansen to Key vault admins
resource "azurerm_role_assignment" "akv_admin_rolessignment" {
  scope                = azurerm_key_vault.deployment_keyvault.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azuread_user.eric.object_id
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