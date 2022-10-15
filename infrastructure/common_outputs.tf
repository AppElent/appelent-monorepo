resource "local_file" "kubeconfig_dev" {
  depends_on = [azurerm_kubernetes_cluster.aks_dev]
  filename   = "kubeconfig_dev"
  content    = azurerm_kubernetes_cluster.aks_dev.kube_config_raw
}

# resource "local_file" "kubeconfig_prd" {
#   depends_on = [azurerm_kubernetes_cluster.aks_prd]
#   filename   = "kubeconfig_prd"
#   content    = azurerm_kubernetes_cluster.aks_prd.kube_config_raw
# }
