resource "azurerm_resource_group" "rg_acmebot" {
  location = var.location
  name     = "rg-appelent-acmebot"
}

resource "azurerm_key_vault" "acmebot_keyvault" {
  name                       = "kv-appelent-acmebot"
  location                   = azurerm_resource_group.rg_acmebot.location
  resource_group_name        = azurerm_resource_group.rg_acmebot.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days = 7
  purge_protection_enabled   = true

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
  mail_address          = data.azuread_user.me.other_mails[0]
  vault_uri             = azurerm_key_vault.acmebot_keyvault.vault_uri

  //allowed_ip_addresses = ["77.251.55.63/32"]

  azure_dns = {
    subscription_id = data.azurerm_client_config.current.subscription_id
  }

  app_settings = {
    "MICROSOFT_PROVIDER_AUTHENTICATION_SECRET" = azuread_service_principal_password.acmebot_secret.value
  }

  # auth_settings = {
  #   enabled = true
  #   issuer  = "https://sts.windows.net/${data.azurerm_client_config.current.tenant_id}/v2.0"
  #   active_directory = {
  #     client_id         = azuread_application.acmebot_application.application_id
  #     allowed_audiences = ["api://${azuread_application.acmebot_application.application_id}"]
  #   }
  #   default_provider              = "AzureActiveDirectory"
  #   token_store_enabled           = true
  #   unauthenticated_client_action = "RedirectToLoginPage"
  # }

  auth_settings = {
    enabled                       = true
    issuer                        = "https://sts.windows.net/${data.azurerm_client_config.current.tenant_id}/v2.0"
    token_store_enabled           = true
    unauthenticated_client_action = "RedirectToLoginPage"
    active_directory = {
      client_id         = azuread_application.acmebot_application.application_id
      allowed_audiences = ["api://${azuread_application.acmebot_application.application_id}"]
    }
  }

}

resource "azuread_application" "acmebot_application" {
  display_name = "app-appelent-acmebot"

  web {
    redirect_uris = ["https://func-appelent-acmebot.azurewebsites.net/.auth/login/aad/callback"]
    implicit_grant {
      id_token_issuance_enabled = true
    }
  }
}

resource "azuread_service_principal" "acmebot_service_principal" {
  application_id = azuread_application.acmebot_application.application_id
}

resource "azuread_service_principal_password" "acmebot_secret" {
  service_principal_id = azuread_service_principal.acmebot_service_principal.object_id
}

# resource "azuread_service_principal" "argocd" {
#   application_id                = azuread_application.acmebot_application.application_id
#   owners                        = azuread_application.acmebot_application.owners
#   preferred_single_sign_on_mode = "saml"
#   //login_url                     = "https://argocd.mysite.ca/auth/login"
#   feature_tags {
#     custom_single_sign_on = true
#   }
# }


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

# ADD logged in user to Key Vault Secret Officer 
resource "azurerm_role_assignment" "akv_acmebot_sp_roleassignment" {
  scope                = azurerm_key_vault.acmebot_keyvault.id
  role_definition_name = "Key Vault Certificates Officer"
  principal_id         = data.azurerm_client_config.current.object_id
}

# ADD Eric Jansen to Key vault admins
resource "azurerm_role_assignment" "akv_acmebot_admin_rolessignment" {
  scope                = azurerm_key_vault.acmebot_keyvault.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azuread_user.me.object_id
}
