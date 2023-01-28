variable "static_web_app_name" {
  description = "Name of the Static Web App"
}

variable "location" {
  default     = "West Europe"
  description = "Location of resources"
}

variable "resource_group_name" {
  default     = "West Europe"
  description = "Location of Static Web App"
}

variable "sku" {
  default     = "Free"
  description = "SKU of Static Web App. Free or Standard"
}


variable "custom_domain_name" {
  description = "Custom domain name"
  default     = ""
}

variable "dns_zone_name" {
  description = "DNS Zone name for custom DNS"
  default     = ""
}

variable "dns_ttl" {
  description = "TTL for custom DNS record"
  default     = 300
}

variable "dns_rg" {
  description = "DNS resource group name"
  default     = ""
}

resource "azurerm_static_site" "staticsite" {
  name                = var.static_web_app_name
  resource_group_name = var.resource_group_name
  location            = var.location
  sku_size            = var.sku
  sku_tier            = var.sku
}

resource "azurerm_static_site_custom_domain" "custom_domain" {
  count           = var.custom_domain_name == "" ? 0 : 1
  static_site_id  = azurerm_static_site.staticsite.id
  domain_name     = "${azurerm_dns_cname_record.cname_record[count.index].name}.${azurerm_dns_cname_record.cname_record[count.index].zone_name}"
  validation_type = "cname-delegation"
}

resource "azurerm_dns_cname_record" "cname_record" {
  count = var.custom_domain_name == "" ? 0 : 1

  name                = var.custom_domain_name
  zone_name           = var.dns_zone_name
  resource_group_name = var.dns_rg
  ttl                 = var.dns_ttl
  record              = azurerm_static_site.staticsite.default_host_name
}
