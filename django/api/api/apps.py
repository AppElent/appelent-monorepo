from django.apps import AppConfig
import os 

from .modules.AzureAppConfiguration import AzureAppConfiguration
from .modules.AzureCosmosDb import AzureCosmosDb
from .modules.Firebase import Firebase

class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        AzureAppConfiguration.load(os.getenv("AZURE_APP_CONFIGURATION_ENDPOINT"), "django-api", "testlabel")
        AzureCosmosDb.load()
        Firebase.load()

