from django.apps import AppConfig
from .modules.AzureCosmosDb import AzureCosmosDb


class OauthConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "oauth"

    def ready(self):
        AzureCosmosDb.load()
