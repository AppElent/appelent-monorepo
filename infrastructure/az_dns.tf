resource "azurerm_dns_zone" "appelent" {
  name                = "appelent.com"
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_dns_cname_record" "home" {
  name                = "home"
  zone_name           = azurerm_dns_zone.appelent.name
  resource_group_name = azurerm_resource_group.rg.name
  ttl                 = 300
  record              = "appelent.duckdns.org."
}

resource "azurerm_dns_cname_record" "homeassistant" {
  name                = "homeassistant"
  zone_name           = azurerm_dns_zone.appelent.name
  resource_group_name = azurerm_resource_group.rg.name
  ttl                 = 300
  record              = "home.appelent.com."
}

resource "azurerm_dns_cname_record" "proxy" {
  name                = "proxy"
  zone_name           = azurerm_dns_zone.appelent.name
  resource_group_name = azurerm_resource_group.rg.name
  ttl                 = 300
  record              = "home.appelent.com."
}

