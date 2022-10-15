
resource "azurerm_service_plan" "asp_dev" {
  location            = var.location
  name                = "asp-appelent-dev"
  os_type             = "Linux"
  resource_group_name = azurerm_resource_group.rg_dev.name
  sku_name            = "B1"
}

# resource "azurerm_service_plan" "asp_prd" {
#   location            = var.location
#   name                = "asp-appelent-prd"
#   os_type             = "Linux"
#   resource_group_name = azurerm_resource_group.rg_prd.name
#   sku_name            = "B1"
# }

resource "azurerm_linux_web_app" "appelent-rest" {
  name                = "app-appelent-rest"
  resource_group_name = azurerm_resource_group.rg_dev.name
  location            = azurerm_service_plan.asp_dev.location
  service_plan_id     = azurerm_service_plan.asp_dev.id

  site_config {
    always_on = "true"

    application_stack {
      docker_image     = "thomaspoignant/hello-world-rest-json"
      docker_image_tag = "latest"
    }
  }

  app_settings = {
    "WEBSITES_PORT" = "8080"
  }
}
