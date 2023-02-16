
# create managed identity
resource "azurerm_user_assigned_identity" "aks_workload_identity" {
  location            = azurerm_resource_group.rg_shared.location
  name                = "mi-aks-workload-identity"
  resource_group_name = azurerm_resource_group.rg_shared.name
}



resource "azurerm_role_assignment" "akv_aks_workload_identity_rolessignment" {
  scope                = "/subscriptions/${data.azurerm_client_config.current.subscription_id}"
  role_definition_name = "Key Vault Administrator"
  principal_id         = azurerm_user_assigned_identity.aks_workload_identity.principal_id
}
