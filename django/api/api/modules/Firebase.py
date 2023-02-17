import random
import string
import os
from .SingletonMetaClass import SingletonMetaclass
import firebase_admin
from firebase_admin import credentials, auth
import json


class _Firebase(metaclass=SingletonMetaclass):
    _random_string = None
    _firebase_admin = firebase_admin
    _auth = auth
    _loaded = False

    def __init__(self):
        print("Firebase instantiated")

    def load(self):
        try:

            if not self._loaded:
                # cred = credentials.Certificate('path/to/serviceAccountKey.json') 
                # default_app = firebase_admin.initialize_app(cred)
                cred = credentials.Certificate(json.loads(os.getenv("firebase-creds")))
                firebase_admin.initialize_app(cred)
            user = auth.get_user("KqVejHU9lzXX8xbpdKtXTLhm3yg1")
            print('user', user.uid, user.custom_claims)
            self._loaded = True
            print('--- Firebase loaded successfully ---')
        except Exception as e:
            print('!!!!! Firebase could not be loaded')
            print(e)

    def get_auth(self):
        return self._config

    def get_firebase_admin(self):
        return self._firebase_admin



        


Firebase = _Firebase()