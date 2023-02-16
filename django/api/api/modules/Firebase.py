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

    def __init__(self):
        print("Firebase instantiated")

    def load(self):

        if not firebase_admin._apps:
            # cred = credentials.Certificate('path/to/serviceAccountKey.json') 
            # default_app = firebase_admin.initialize_app(cred)
            cred = credentials.Certificate(json.loads(os.getenv("FIREBASE_CREDS")))
            firebase_admin.initialize_app(cred)
        user = auth.get_user("KqVejHU9lzXX8xbpdKtXTLhm3yg1")
        print('user', user.uid, user.custom_claims)
        print('--- Firebase loaded successfully ---')

    def get_auth(self):
        return self._config

    def get_firebase_admin(self):
        return self._firebase_admin



        


Firebase = _Firebase()