module "az_static_web_app" {
  source = "./modules/az_static_web_app"

  static_web_app_name = "swa-appelent-wappiemeter"
  resource_group_name = azurerm_resource_group.rg_swa.name
  location            = var.location
  sku                 = "Free"

  #   custom_domain_name = "wappiemetertest2"
  #   dns_zone_name      = azurerm_dns_zone.appelent.name
  #   dns_ttl            = 300
}