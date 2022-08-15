

resource "azurerm_resource_group" "rg" {
  location = var.location
  name     = "rg-azure-infra-${var.environment}"
}

resource "azurerm_resource_group" "rg_shared" {
  location = var.location
  name     = "rg-azure-infra-shared"
}

resource "random_string" "random_string01" {
  length  = 10
  lower   = true
  special = false
}

module "heroku_config" {
  source                   = "./modules/heroku_app"
  heroku_app_name          = "appelent-${lower(random_string.random_string01.result)}-${var.environment}"
  heroku_api_key           = var.heroku_api_key
  heroku_email             = var.heroku_email
  create_postgres_database = true
}
