
terraform {
  required_providers {
    heroku = {
      source  = "heroku/heroku"
      version = ">= 5.1.1"
    }
  }
}

variable "heroku_app_name" {
  description = "Name of the herokuapp to be created"
}

variable "heroku_app_location" {
  default     = "eu"
  description = "Location of Heroku app"
}

variable "create_postgres_database" {
  default = false
}

variable "add_to_pipeline" {
  default = false
}

resource "heroku_app" "app" {
  name   = var.heroku_app_name
  region = var.heroku_app_location
  stack  = "heroku-22"
}

resource "heroku_addon" "postgres" {
  app_id = heroku_app.app.id
  plan   = "heroku-postgresql:hobby-basic"
  count  = var.create_postgres_database ? 1 : 0
}

resource "heroku_pipeline" "pipeline" {
  name  = var.heroku_app_name
  count = var.add_to_pipeline ? 1 : 0
}

resource "heroku_pipeline_coupling" "production" {
  app_id   = heroku_app.app.id
  pipeline = heroku_pipeline.pipeline[count.index].id
  stage    = "production"
  count    = var.add_to_pipeline ? 1 : 0
}

output "heroku_app_config" {
  value = heroku_app.app
}

output "heroku_app_addon_config" {
  value = heroku_addon.postgres
}

output "heroku_app_addon_config_values" {
  value     = var.create_postgres_database ? heroku_addon.postgres[0].config_var_values : {}
  sensitive = true
}
