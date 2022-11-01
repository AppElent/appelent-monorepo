resource "azurerm_mysql_flexible_database" "mysql_dev_database_test01" {
  name                = "test01"
  resource_group_name = azurerm_resource_group.rg_dev_data.name
  server_name         = azurerm_mysql_flexible_server.mysql_dev.name
  charset             = "utf8"
  collation           = "utf8_unicode_ci"
}

data "http" "myip" {
  url = "http://ifconfig.me/ip"
}
resource "azurerm_mysql_flexible_server_firewall_rule" "mysql_firewall_clientip" {
  name                = "GithubCodespaces"
  resource_group_name = azurerm_resource_group.rg_dev_data.name
  server_name         = azurerm_mysql_flexible_server.mysql_dev.name
  start_ip_address    = chomp(data.http.myip.response_body)
  end_ip_address      = chomp(data.http.myip.response_body)
}

resource "mysql_user" "mysql_user_test01" {
  user               = azurerm_mysql_flexible_database.mysql_dev_database_test01.name
  host               = "%"
  plaintext_password = "test123"
  depends_on = [
    azurerm_mysql_flexible_server_firewall_rule.mysql_firewall_clientip
  ]
}

resource "mysql_grant" "useraccess" {
  user       = mysql_user.mysql_user_test01.user
  host       = mysql_user.mysql_user_test01.host
  database   = azurerm_mysql_flexible_database.mysql_dev_database_test01.name
  privileges = ["SELECT", "UPDATE", "DELETE", "EXECUTE", "INSERT"]
}
