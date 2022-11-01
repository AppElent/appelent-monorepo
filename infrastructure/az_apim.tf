resource "azurerm_api_management" "apim" {
  name                = "apim-appelent"
  location            = azurerm_resource_group.rg_shared.location
  resource_group_name = azurerm_resource_group.rg_shared.name
  publisher_name      = "Appelent"
  publisher_email     = data.azuread_user.me.user_principal_name

  identity {
    type = "SystemAssigned"
  }

  sku_name = "Consumption_0"
}

data "azurerm_key_vault_certificate" "apim_custom_domain_cert" {
  name         = "portal-appelent-com"
  key_vault_id = azurerm_key_vault.acmebot_keyvault.id
}

data "azurerm_key_vault_certificate" "apim_custom_domain_mngt_cert" {
  name         = "api-management-appelent-com"
  key_vault_id = azurerm_key_vault.acmebot_keyvault.id
}

data "azurerm_key_vault_certificate" "apim_custom_domain_developer_cert" {
  name         = "developer-appelent-com"
  key_vault_id = azurerm_key_vault.acmebot_keyvault.id
}

# Op 1 of andere gekke manier moet het managed identity secrets user rechten krijgen. Zie: https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide?tabs=azure-cli
resource "azurerm_role_assignment" "akv_acmebot_apim_roleassignment" {
  scope                = azurerm_key_vault.acmebot_keyvault.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_api_management.apim.identity[0].principal_id
}

# resource "azurerm_api_management_custom_domain" "apim_custom_domain" {
#   api_management_id = azurerm_api_management.apim.id

#   gateway {
#     host_name    = "api.appelent.com"
#     key_vault_id = data.azurerm_key_vault_certificate.apim_custom_domain_cert.secret_id
#   }

#   developer_portal {
#     host_name    = "developer.appelent.com"
#     key_vault_id = data.azurerm_key_vault_certificate.apim_custom_domain_developer_cert.secret_id
#   }

#   # portal {
#   #   host_name    = azurerm_dns_cname_record.management.fqdn
#   #   key_vault_id = data.azurerm_key_vault_certificate.apim_custom_domain_mngt_cert.secret_id
#   # }

#   # scm {
#   #   host_name    = azurerm_dns_cname_record.scm.fqdn
#   #   key_vault_id = data.azurerm_key_vault_certificate.apim_custom_domain_mngt_cert.secret_id
#   # }
# }

resource "azurerm_api_management_api" "apim_api_conference" {
  name                = "conference-api"
  resource_group_name = azurerm_resource_group.rg_shared.name
  api_management_name = azurerm_api_management.apim.name
  revision            = "1"
  display_name        = "Conference API"
  path                = "conference"
  service_url         = "https://conferenceapi.azurewebsites.net/"
  protocols           = ["https"]

  import {
    content_format = "swagger-link-json"
    content_value  = "http://conferenceapi.azurewebsites.net/?format=json"
  }
}

resource "azurerm_api_management_product" "apim_product_demo" {
  product_id            = "demo"
  api_management_name   = azurerm_api_management.apim.name
  resource_group_name   = azurerm_resource_group.rg_shared.name
  display_name          = "Demo Product"
  description           = "Demo Product"
  subscription_required = true
  approval_required     = false
  published             = true
}

resource "azurerm_api_management_product_api" "example" {
  api_name            = azurerm_api_management_api.apim_api_conference.name
  product_id          = azurerm_api_management_product.apim_product_demo.product_id
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = azurerm_resource_group.rg_shared.name
}
