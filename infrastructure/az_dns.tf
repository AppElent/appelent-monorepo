resource "azurerm_dns_zone" "appelent" {
  name                = "appelent.com"
  resource_group_name = azurerm_resource_group.rg_networking.name
}

resource "azurerm_dns_cname_record" "home" {
  name                = "home"
  zone_name           = azurerm_dns_zone.appelent.name
  resource_group_name = azurerm_resource_group.rg_networking.name
  ttl                 = 300
  record              = "appelent.duckdns.org."
}

resource "azurerm_dns_cname_record" "homeassistant" {
  name                = "homeassistant"
  zone_name           = azurerm_dns_zone.appelent.name
  resource_group_name = azurerm_resource_group.rg_networking.name
  ttl                 = 300
  record              = "home.appelent.com."
}

resource "azurerm_dns_cname_record" "proxy" {
  name                = "proxy"
  zone_name           = azurerm_dns_zone.appelent.name
  resource_group_name = azurerm_resource_group.rg_networking.name
  ttl                 = 300
  record              = "home.appelent.com."
}

# resource "azurerm_dns_cname_record" "api" {
#   name                = "api"
#   zone_name           = azurerm_dns_zone.appelent.name
#   resource_group_name = azurerm_resource_group.rg_networking.name
#   ttl                 = 300
#   record              = replace(azurerm_api_management.apim.gateway_url, "/(https://)|(/)/", "")
# }

# resource "azurerm_dns_cname_record" "portal" {
#   name                = "developer"
#   zone_name           = azurerm_dns_zone.appelent.name
#   resource_group_name = azurerm_resource_group.rg_networking.name
#   ttl                 = 300
#   record              = replace(azurerm_api_management.apim.developer_portal_url, "/(https://)|(/)/", "")
# }

# resource "azurerm_dns_cname_record" "management" {
#   name                = "api-management"
#   zone_name           = azurerm_dns_zone.appelent.name
#   resource_group_name = azurerm_resource_group.rg_networking.name
#   ttl                 = 300
#   record              = replace(azurerm_api_management.apim.management_api_url, "/(https://)|(/)/", "")
# }

# resource "azurerm_dns_cname_record" "scm" {
#   name                = "api-scm"
#   zone_name           = azurerm_dns_zone.appelent.name
#   resource_group_name = azurerm_resource_group.rg_networking.name
#   ttl                 = 300
#   record              = replace(azurerm_api_management.apim.scm_url, "/(https://)|(/)/", "")
# }

resource "azurerm_dns_a_record" "catch_kubernetes" {
  name                = "*.k8s"
  zone_name           = azurerm_dns_zone.appelent.name
  resource_group_name = azurerm_resource_group.rg_networking.name
  ttl                 = 300
  records             = ["20.126.244.220"]
}

resource "azurerm_dns_a_record" "catch_all" {
  name                = "*"
  zone_name           = azurerm_dns_zone.appelent.name
  resource_group_name = azurerm_resource_group.rg_networking.name
  ttl                 = 300
  records             = ["20.126.244.220"]
}
