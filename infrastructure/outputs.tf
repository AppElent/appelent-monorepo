output "asp_name" {
  value = azurerm_service_plan.asp.name
}

output "heroku_app_config" {
  value     = module.heroku_config.heroku_app_config
  sensitive = true
}

output "heroku_app_addon_config" {
  value     = module.heroku_config.heroku_app_addon_config
  sensitive = true
}

output "heroku_app_addon_config_values" {
  value     = module.heroku_config.heroku_app_addon_config_values
  sensitive = true
}

