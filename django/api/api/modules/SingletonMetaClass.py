class SingletonMetaclass(type):

    _instance = None

    def __call__(cls, *args, **kwargs):
        assert not (args or kwargs), 'Singleton should not accept arguments'

        if isinstance(cls._instance, cls):
            return cls._instance
        else:
            cls._instance = super(SingletonMetaclass, cls).__call__()
            return cls._instance