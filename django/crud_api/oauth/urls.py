from django.urls import path
from .views import *

urlpatterns = [
    path('<str:name>/authorize', authorize),
    # path('oauth/<str:name>/authorizationurl', get_authorization_url),
    path('<str:name>/token', save_access_token),
    # path('oauth/<str:name>/refresh', refresh_access_token),
]