resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-appelent"
  location            = azurerm_resource_group.rg_networking.location
  resource_group_name = azurerm_resource_group.rg_networking.name
  address_space       = ["10.0.0.0/16"]
}

# resource "azurerm_subnet" "subnet01" {
#   name                 = "example-sn"
#   resource_group_name  = azurerm_resource_group.rg.name
#   virtual_network_name = azurerm_virtual_network.vnet.name
#   address_prefixes     = ["10.0.0.0/24"]
#   service_endpoints    = ["Microsoft.Storage"]
#   delegation {
#     name = "fs"
#     service_delegation {
#       name = "Microsoft.DBforPostgreSQL/flexibleServers"
#       actions = [
#         "Microsoft.Network/virtualNetworks/subnets/join/action",
#       ]
#     }
#   }
# }

# resource "azurerm_subnet" "subnet02" {
#   name                 = "example-sn"
#   resource_group_name  = azurerm_resource_group.rg.name
#   virtual_network_name = azurerm_virtual_network.vnet.name
#   address_prefixes     = ["10.0.1.0/24"]
# }
