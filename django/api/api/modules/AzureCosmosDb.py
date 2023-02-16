import random
import string
import os
from .SingletonMetaClass import SingletonMetaclass
from azure.cosmos import CosmosClient


class _AzureCosmosDb(metaclass=SingletonMetaclass):
    _random_string = None
    _database_client = None

    def __init__(self):
        print("AzureCosmosDb instantiated")

    def load(self):
        # Get providers from azure cosmos db
        try:
            environment = str(os.getenv("ENVIRONMENT") or "LOCAL").lower()
            access_key = os.getenv('COSMOS_ACCESS_KEY') or ''
            container_name = "providers_" + environment
            query = "select * from " + container_name + " p"
            print(environment, query)
            client = CosmosClient(
                "https://cdb-appelent.documents.azure.com:443/", access_key)
            self._database_client = client.get_database_client("oauth_providers")
            container = self._database_client.get_container_client(container_name)
            providers = []
            for item in container.query_items(query=query, enable_cross_partition_query=True):
                providers.append(item)
            print('--- Cosmos DB Adapter loaded successfully. ---')
        except Exception as e:
            print('!!!!! Data from Cosmos DB could not be retrieved. Is Environment Variable COSMOS_ACCESS_KEY set?')
            print(e)

    def get_database_client(self):
        return self._database_client



        


AzureCosmosDb = _AzureCosmosDb()