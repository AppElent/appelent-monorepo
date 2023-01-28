module "az_static_web_app" {
  source = "./modules/az_static_web_app"

  static_web_app_name = "swa-appelent-wappiemeter"
  resource_group_name = azurerm_resource_group.rg_swa.name
  location            = var.location
  sku                 = "Free"

  custom_domain_name = "wappiemeter"
  dns_rg             = azurerm_resource_group.rg_networking.name
  dns_zone_name      = azurerm_dns_zone.appelent.name
  dns_ttl            = 300
}

module "az_static_web_app_satisfactory" {
  source = "./modules/az_static_web_app"

  static_web_app_name = "swa-appelent-satisfactory"
  resource_group_name = azurerm_resource_group.rg_swa.name
  location            = var.location
  sku                 = "Free"

  custom_domain_name = "satisfactory"
  dns_rg             = azurerm_resource_group.rg_networking.name
  dns_zone_name      = azurerm_dns_zone.appelent.name
  dns_ttl            = 300
}

module "az_static_web_app_demo" {
  source = "./modules/az_static_web_app"

  static_web_app_name = "swa-appelent-demo"
  resource_group_name = azurerm_resource_group.rg_swa.name
  location            = var.location
  sku                 = "Free"

  custom_domain_name = "demo"
  dns_rg             = azurerm_resource_group.rg_networking.name
  dns_zone_name      = azurerm_dns_zone.appelent.name
  dns_ttl            = 300
}
