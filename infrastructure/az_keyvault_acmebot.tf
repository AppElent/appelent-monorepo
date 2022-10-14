// RG used as shared RG between environments
resource "azurerm_resource_group" "rg_acmebot" {
  location = var.location
  name     = "rg-appelent-acmebot"
}

resource "azurerm_key_vault" "acmebot_keyvault" {
  name                        = "kv-appelent-acmebot"
  location                    = azurerm_resource_group.rg_acmebot.location
  resource_group_name         = azurerm_resource_group.rg_acmebot.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = true

  sku_name                  = "standard"
  enable_rbac_authorization = true
}

module "keyvault_acmebot" {
  source  = "shibayan/keyvault-acmebot/azurerm"
  version = "~> 2.0"

  function_app_name     = "func-appelent-acmebot"
  app_service_plan_name = "asp-appelent-acmebot"
  storage_account_name  = "saappelentacmebot"
  app_insights_name     = "appi-appelent-acmebot"
  workspace_name        = "log-appelent-acmebot"
  resource_group_name   = azurerm_resource_group.rg_acmebot.name
  location              = azurerm_resource_group.rg_acmebot.location
  mail_address          = data.azuread_user.eric.mail
  vault_uri             = azurerm_key_vault.acmebot_keyvault.vault_uri

  azure_dns = {
    subscription_id = data.azurerm_client_config.current.subscription_id
  }

#   app_settings = {
#     "MICROSOFT_PROVIDER_AUTHENTICATION_SECRET" = "IB-8Q~mEisjIlBLtP94G4ak3r~ZzCl4NESY2Wbyb"
#   }

#   auth_settings = {
    
#   }
}

resource "azuread_application" "acmebot_application" {
    display_name = "app-appelent-acmebot"

    feature_tags {
      enterprise = true
    }
}

resource "azurerm_role_assignment" "akv_acmebot_roleassignment" {
  scope                = azurerm_key_vault.acmebot_keyvault.id
  role_definition_name = "Key Vault Certificates Officer"
  principal_id         = module.keyvault_acmebot.principal_id
}

resource "azurerm_role_assignment" "dns_acmebot_roleassignment" {
  scope                = azurerm_dns_zone.appelent.id
  role_definition_name = "DNS Zone Contributor"
  principal_id         = module.keyvault_acmebot.principal_id
}