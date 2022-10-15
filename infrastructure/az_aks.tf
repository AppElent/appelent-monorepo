resource "azurerm_kubernetes_cluster" "aks_dev" {
  name                = "aks-appelent-dev"
  location            = azurerm_resource_group.rg_dev.location
  resource_group_name = azurerm_resource_group.rg_dev.name
  dns_prefix          = "aks-appelent-dev"
  node_resource_group = "rg-appelent-aks-dev-resources"

  default_node_pool {
    name       = "default"
    node_count = "1"
    vm_size    = "Standard_B2s"
  }

  identity {
    type = "SystemAssigned"
  }
}

# resource "azurerm_role_assignment" "aks_acr_dev" {
#   principal_id                     = azurerm_kubernetes_cluster.aks_dev.kubelet_identity[0].object_id
#   role_definition_name             = "AcrPull"
#   scope                            = azurerm_container_registry.acr.id
#   skip_service_principal_aad_check = true
# }

# resource "azurerm_kubernetes_cluster" "aks_prd" {
#   name                = "aks-appelent-prd"
#   location            = azurerm_resource_group.rg_prd.location
#   resource_group_name = azurerm_resource_group.rg_prd.name
#   dns_prefix          = "aks-appelent-prd"
#   node_resource_group = "rg-appelent-aks-prd-resources"

#   default_node_pool {
#     name       = "default"
#     node_count = "1"
#     vm_size    = "Standard_B2s"
#   }

#   identity {
#     type = "SystemAssigned"
#   }
# }

# resource "azurerm_role_assignment" "aks_acr_prd" {
#   principal_id                     = azurerm_kubernetes_cluster.aks_prd.kubelet_identity[0].object_id
#   role_definition_name             = "AcrPull"
#   scope                            = azurerm_container_registry.acr.id
#   skip_service_principal_aad_check = true
# }
