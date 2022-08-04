
variable "app_service_tier" {
  default = {
    tier : "Free",
    size : "F1"
  }
  description = "Tier and size of app service plan"
}

resource "azurerm_app_service_plan" "asp" {
  location            = var.location
  name                = "appelent-asp-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  sku {
    size = app_service_tier.size
    tier = app_service_tier.size
  }

}
