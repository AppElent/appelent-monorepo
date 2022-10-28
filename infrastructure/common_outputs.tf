resource "local_file" "kubeconfig" {
  depends_on = [azurerm_kubernetes_cluster.aks]
  filename   = "kubeconfig"
  content    = azurerm_kubernetes_cluster.aks.kube_config_raw
}

output "aks_kubelet_identities" {
  value = azurerm_kubernetes_cluster.aks.kubelet_identity
}

output "aks_identities" {
  value = azurerm_kubernetes_cluster.aks.identity
}

output "vmss_identities" {
  value = azurerm_kubernetes_cluster.aks.default_node_pool
}

