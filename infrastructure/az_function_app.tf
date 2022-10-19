resource "azurerm_service_plan" "asp_function_app_management" {
  name                = "asp-appelent-management"
  location            = azurerm_resource_group.rg_shared.location
  resource_group_name = azurerm_resource_group.rg_shared.name
  os_type             = "Windows"
  sku_name            = "Y1"
}

resource "azurerm_storage_account" "sa_management" {
  name                     = "saappelentmanagement"
  resource_group_name      = azurerm_resource_group.rg_shared.name
  location                 = azurerm_resource_group.rg_shared.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_windows_function_app" "func_appelent_management" {
  name                = "func-appelent-management"
  resource_group_name = azurerm_resource_group.rg_shared.name
  location            = azurerm_resource_group.rg_shared.location

  storage_account_name       = azurerm_storage_account.sa_management.name
  storage_account_access_key = azurerm_storage_account.sa_management.primary_access_key
  service_plan_id            = azurerm_service_plan.asp_function_app_management.id

  site_config {
    application_stack {
      powershell_core_version = "7.2"
    }
    application_insights_connection_string = azurerm_application_insights.apipi_shared.connection_string
    application_insights_key               = azurerm_application_insights.apipi_shared.instrumentation_key
  }

  lifecycle {
    ignore_changes = [tags]
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_role_assignment" "func_management_sub_roleassignment" {
  scope                = "/subscriptions/${data.azurerm_client_config.current.subscription_id}"
  role_definition_name = "Contributor"
  principal_id         = azurerm_windows_function_app.func_appelent_management.identity[0].principal_id
}
