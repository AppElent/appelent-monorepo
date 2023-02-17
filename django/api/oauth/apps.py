from django.apps import AppConfig
from .modules.AzureCosmosDb import AzureCosmosDb
from django.conf import settings


class OauthConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "oauth"

    def ready(self):
        AzureCosmosDb.load(settings.ENVIRONMENT_CONFIG['cosmos-access-key'])
