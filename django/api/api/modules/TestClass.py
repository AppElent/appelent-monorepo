import random
import string
import os
from .SingletonMetaClass import SingletonMetaclass

class _TestClass(metaclass=SingletonMetaclass):
    _random_string = None

    def __init__(self):
        self._random_string = ''.join(random.choices(string.ascii_lowercase, k=5))

    def print_something(self, passed_string):
        print(passed_string)


TestClass = _TestClass()