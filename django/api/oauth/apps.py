from django.apps import AppConfig
from django.conf import settings


class OauthConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "oauth"

    def ready(self):
        # if settings.ENVIRONMENT_CONFIG:
        #     AzureCosmosDb.load(settings.ENVIRONMENT_CONFIG.get('cosmos-access-key'))
        pass
