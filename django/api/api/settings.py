"""
Django settings for api project.

Generated by 'django-admin startproject' using Django 4.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path
import dotenv
import os
import dj_database_url
from django.core.management.utils import get_random_secret_key

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
dotenv_file = os.path.join(BASE_DIR, ".env")
if os.path.isfile(dotenv_file):
    dotenv.load_dotenv(dotenv_file)

ENVIRONMENT = ("LOCAL" if os.getenv("ENVIRONMENT")
               is None else os.getenv("ENVIRONMENT")).upper()

# Setting custom user model
AUTH_USER_MODEL = 'users.User'

#
#  LOAD MODULES
#
from .modules.AzureAppConfiguration import AzureAppConfiguration
from .modules.AzureCosmosDb import AzureCosmosDb
from .modules.Firebase import Firebase
ENVIRONMENT_CONFIG = AzureAppConfiguration.load(os.getenv("AZURE_APP_CONFIGURATION_ENDPOINT"), "django-api", os.getenv("ENVIRONMENT") or "LOCAL")
if ENVIRONMENT_CONFIG:
    COSMOS_DATABASE_CLIENT = AzureCosmosDb.load(ENVIRONMENT_CONFIG.get('cosmos-access-key'))
    Firebase.load(ENVIRONMENT_CONFIG.get('firebase-creds'))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'abc'#get_random_secret_key() 
if ENVIRONMENT_CONFIG and ENVIRONMENT_CONFIG.get('django-secret'):
    SECRET_KEY = ENVIRONMENT_CONFIG.get('django-secret')
#os.getenv("SECRET_KEY", default=get_random_secret_key())

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False if ENVIRONMENT != "LOCAL" else True

CSRF_TRUSTED_ORIGINS = ['https://*.preview.app.github.dev', 'https://*.appelent.com']
#ALLOWED_HOSTS = ['preview.app.github.dev', 'localhost', '127.0.0.1', '.appelent.com']
ALLOWED_HOSTS = ['*']

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"[^.\s]+\.appelent\.com",
]

ALLOWED_CIDR_NETS = ['10.244.0.0/16']


# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'rest_framework',
    'rest_framework_swagger',
    'rest_framework.authtoken',
    'django_prometheus',
    'api.apps.ApiConfig',
    'drf_yasg',
    'crud',
    'users',
    'oauth',
    'health_check',                             # required
    'health_check.db',                          # stock Django health checkers
    'health_check.cache',
    'health_check.storage',
    'health_check.contrib.migrations',
    'corsheaders',
]

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    'allow_cidr.middleware.AllowCIDRMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

REST_FRAMEWORK = {
    # other settings...

    'DEFAULT_AUTHENTICATION_CLASSES': [
        'api.authentication.FirebaseAuthentication',
        'api.authentication.TokenAuthSupportQueryString',
        'rest_framework.authentication.BasicAuthentication',
        'api.authentication.DevelopmentAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        #'rest_framework.authentication.TokenAuthentication', replaced by tokenauthsupportquerystring
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

ROOT_URLCONF = "api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "api.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

if os.getenv("DATABASE_URL") or (ENVIRONMENT_CONFIG and ENVIRONMENT_CONFIG.get('database-server-url')):
    # DATABASE_URL = os.getenv('postgresql-database-url') + '/django-api'
    # os.environ['DATABASE_URL'] = DATABASE_URL
    # DATABASES = {}
    # DATABASES['default'] = dj_database_url.config(conn_max_age=600)
    DATABASE_URL = ENVIRONMENT_CONFIG.get('database-server-url') + ENVIRONMENT_CONFIG.get('database-name')
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    # default database is sqlite locally. Watch out: This database is not persistent across container restarts
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


if ENVIRONMENT_CONFIG and ENVIRONMENT_CONFIG.get('redis-url'):
    if ENVIRONMENT_CONFIG.get('redis-prefix'):
        CACHES = {
            "default": {
                'BACKEND': 'django_prometheus.cache.backends.redis.RedisCache',
                'LOCATION': ENVIRONMENT_CONFIG.get('redis-url'),
                'KEY_PREFIX': ENVIRONMENT_CONFIG.get('redis-prefix')
            }
        }
    else:
        CACHES = {
            "default": {
                'BACKEND': 'django_prometheus.cache.backends.redis.RedisCache',
                'LOCATION': ENVIRONMENT_CONFIG.get('redis-url'),
                
            }
        }
else:
    # default cache is local memory cache
    CACHES = {
        'default': {
            'BACKEND': 'django_prometheus.cache.backends.locmem.LocMemCache',
            'LOCATION': 'unique-string',
        },
    }


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Loggin setup
# https://docs.djangoproject.com/en/4.1/topics/logging/
# from logtail import LogtailHandler
# import logging


# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'verbose': {
#             'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
#             'style': '{',
#         },
#         'simple': {
#             'format': '{levelname} {message}',
#             'style': '{',
#         },
#     },
#     'handlers': {
#         'file': {
#             'level': 'INFO',
#             'class': 'logging.FileHandler',
#             'filename': './logs/logging.log',
#         },
#         'logtail': {
#             'class': 'logtail.LogtailHandler',
#             'formatter': 'simple',
#             'source_token': os.getenv('LOGTAIL_KEY')
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['file', 'logtail'],
#             'level': 'DEBUG',
#             'propagate': True,
#         },
#     },
# }

# logger = logging.getLogger('django')
# lh = LogtailHandler(source_token=os.getenv('LOGTAIL_KEY'))
# # lh.setFormatter(formatter)
# logger.addHandler(lh)

# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'verbose': {
#             'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
#             'style': '{',
#         },
#         'simple': {
#             'format': '{levelname} {message}',
#             'style': '{',
#         },
#     },
#     'filters': {
#         'special': {
#             '()': 'project.logging.SpecialFilter',
#             'foo': 'bar',
#         },
#         'require_debug_true': {
#             '()': 'django.utils.log.RequireDebugTrue',
#         },
#     },
#     'handlers': {
#         'console': {
#             'level': 'INFO',
#             'filters': ['require_debug_true'],
#             'class': 'logging.StreamHandler',
#             'formatter': 'simple'
#         },
#         'mail_admins': {
#             'level': 'ERROR',
#             'class': 'django.utils.log.AdminEmailHandler',
#             'filters': ['special']
#         }
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['console'],
#             'propagate': True,
#         },
#         'django.request': {
#             'handlers': ['mail_admins'],
#             'level': 'ERROR',
#             'propagate': False,
#         },
#         'myproject.custom': {
#             'handlers': ['console', 'mail_admins'],
#             'level': 'INFO',
#             'filters': ['special']
#         }
#     }
# }


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

LOGIN_URL = 'login'
LOGOUT_URL = 'logout'
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"