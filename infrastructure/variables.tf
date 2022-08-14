
variable "environment" {
  default     = "dev"
  description = "Environment name"
}

variable "location" {
  default     = "West Europe"
  description = "Location of resources"
}

variable "app_service_plan_sku" {
  default     = "F1"
  description = "SKU of app service plan (F1, S1, etc.)"
}

variable "cosmosdb_name" {
  default     = "appelent-cdb"
  description = "Name of cosmos DB"
}

variable "heroku_api_key" {
  description = "Heroku API key"
}
