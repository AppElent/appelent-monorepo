
resource "azurerm_app_configuration" "app_config" {
  location            = var.location
  name                = "appcnf-appelent"
  resource_group_name = azurerm_resource_group.rg_shared.name
}

# resource "azurerm_app_configuration_key" "test_key" {
#   configuration_store_id = azurerm_app_configuration.app_config.id
#   key                    = "testkey"
#   label                  = "testlabel"
#   value                  = "testvalue"

# }

# resource "azurerm_app_configuration_feature" "test_feature" {
#   configuration_store_id = azurerm_app_configuration.app_config.id
#   description            = "test description"
#   name                   = "test-feature-name"
#   label                  = "test-feature-label"
#   enabled                = true
# }

# output "connection_string_test" {
#   value = azurerm_app_configuration.app_config.primary_read_key
# }

# output "endpoint" {
#   value = azurerm_app_configuration.app_config.endpoint
# }
