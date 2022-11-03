resource "azurerm_mysql_flexible_server" "mysql_dev" {
  name                   = "msql-appelent-dev"
  resource_group_name    = azurerm_resource_group.rg_dev_data.name
  location               = azurerm_resource_group.rg_dev_data.location
  administrator_login    = "mysql"
  administrator_password = random_string.mysql_dev_password.result
  backup_retention_days  = 7
  #   delegated_subnet_id    = azurerm_subnet.example.id
  #   private_dns_zone_id    = azurerm_private_dns_zone.example.id
  sku_name = "B_Standard_B1ms"

  storage {
    iops              = 360
    size_gb           = 20
    auto_grow_enabled = true
  }

  lifecycle {
    ignore_changes = [zone]
  }
}

resource "random_string" "mysql_dev_password" {
  length  = 40
  special = false
}

resource "azurerm_key_vault_secret" "akv_secret_mysql_dev" {
  name         = "mysql-secret"
  value        = random_string.mysql_dev_password.result
  key_vault_id = azurerm_key_vault.deployment_keyvault.id
}

resource "azurerm_mysql_flexible_database" "mysql_dev_database_test01" {
  name                = "test01"
  resource_group_name = azurerm_resource_group.rg_dev_data.name
  server_name         = azurerm_mysql_flexible_server.mysql_dev.name
  charset             = "utf8"
  collation           = "utf8_unicode_ci"
}

# data "http" "myip" {
#   url = "http://ifconfig.me/ip"
# }
# resource "azurerm_mysql_flexible_server_firewall_rule" "mysql_firewall_clientip" {
#   name                = "GithubCodespaces"
#   resource_group_name = azurerm_resource_group.rg_dev_data.name
#   server_name         = azurerm_mysql_flexible_server.mysql_dev.name
#   start_ip_address    = chomp(data.http.myip.response_body)
#   end_ip_address      = chomp(data.http.myip.response_body)
# }

# resource "mysql_user" "mysql_user_test01" {
#   user               = azurerm_mysql_flexible_database.mysql_dev_database_test01.name
#   host               = "%"
#   plaintext_password = "test123"
#   depends_on = [
#     azurerm_mysql_flexible_server_firewall_rule.mysql_firewall_clientip
#   ]
# }

# resource "mysql_grant" "mysql_user_access_test01" {
#   user       = mysql_user.mysql_user_test01.user
#   host       = mysql_user.mysql_user_test01.host
#   database   = azurerm_mysql_flexible_database.mysql_dev_database_test01.name
#   privileges = ["ALL"]
# }
