

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
  scope                = "/subscriptions/${data.azurerm_client_config.current.subscription_id}"
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azurerm_client_config.current.object_id
}

# ADD Eric Jansen to Key vault admins
resource "azurerm_role_assignment" "akv_admin_rolessignment" {
  scope                = "/subscriptions/${data.azurerm_client_config.current.subscription_id}"
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azuread_user.me.object_id
}

resource "azurerm_key_vault" "keyvault_local" {
  name                        = "kv-appelent-local"
  location                    = azurerm_resource_group.rg_dev.location
  resource_group_name         = azurerm_resource_group.rg_dev.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = true

  sku_name                  = "standard"
  enable_rbac_authorization = true
}

resource "azurerm_key_vault" "keyvault_dev" {
  name                        = "kv-appelent-dev"
  location                    = azurerm_resource_group.rg_dev.location
  resource_group_name         = azurerm_resource_group.rg_dev.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = true

  sku_name                  = "standard"
  enable_rbac_authorization = true
}

resource "azurerm_key_vault" "keyvault_prd" {
  name                        = "kv-appelent-prd"
  location                    = azurerm_resource_group.rg_prd.location
  resource_group_name         = azurerm_resource_group.rg_prd.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = true

  sku_name                  = "standard"
  enable_rbac_authorization = true
}
