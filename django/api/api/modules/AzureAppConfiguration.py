import random
import string
import os
from .SingletonMetaClass import SingletonMetaclass

from azure.appconfiguration.provider import (
    AzureAppConfigurationProvider,
    SettingSelector,
    AzureAppConfigurationKeyVaultOptions,
    load_provider
)
from azure.keyvault.secrets import SecretClient, KeyVaultSecretIdentifier
from azure.identity import DefaultAzureCredential


# from azure.appconfiguration import (
#     AzureAppConfigurationClient,
#     SecretReferenceConfigurationSetting,
#     FeatureFlagConfigurationSetting
# )

class _AzureAppConfiguration(metaclass=SingletonMetaclass):
    _random_string = None
    _config = None
    _endpoint = None
    _app = None
    _label = None

    def __init__(self):
        print("AzureAppConfiguration instantiated")

    def load(self, endpoint, app, label):
        if not self._config and endpoint is not None and app is not None and label is not None:
            # try: 
            self._endpoint = endpoint
            self._app = app
            self._label = label
            print(endpoint, app, label)
            # Getting credential either from cache (az login) or managed identity
            try:
                credential = DefaultAzureCredential()
            except Exception as ex:
                print(f"error setting credentials: {ex}")

            # Query for keys
            selects = {SettingSelector(key_filter=f"{app}:*", label_filter=label)}
            trimmed_key_prefixes = {f"{app}:"}

            # # Keyvault options object for retrieving secrets
            key_vault_options = AzureAppConfigurationKeyVaultOptions(credential=credential)
            self._config = load_provider(endpoint=endpoint, credential=credential, key_vault_options=key_vault_options, selects=selects, trimmed_key_prefixes=trimmed_key_prefixes)
            keys = self._config.keys()
            for key in keys:
                os.environ[key] = self._config[key]
            print('--- AzureAppConfiguration loaded successfully ---')
            # except Exception as e:
            #     print('!!!!! Azure App Configuration could not be loaded')
            #     print(e)

    def get_config(self):
        return self._config

    def refresh(self):
        pass



        


AzureAppConfiguration = _AzureAppConfiguration()