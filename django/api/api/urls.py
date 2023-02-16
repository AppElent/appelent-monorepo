"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from . import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.views.generic import RedirectView


schema_view = get_schema_view(
    openapi.Info(
        title="AppElent API",
        default_version='v1.0.0',
        description="Welcome to the AppElent API",
        terms_of_service="https://www.appelent.com",
        contact=openapi.Contact(email="info@appelent.com"),
        license=openapi.License(name="MIT"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    # All API routes
    #path('api/', include('api.urls')),
    path('oauth/', include('oauth.urls')),
    path('crud/', include('crud.urls')),
    path('oauth/', include('oauth.urls')),
    path('users/', include('users.urls')),
    path('dummy/', views.dummy, name='dummy'),
    path('environment/', views.environment, name='environment'),
    path('', RedirectView.as_view(url='/swagger', permanent=False)),
    re_path(r'^specs(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),  #<-- Here
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),  #<-- Here
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'),  #<-- Here
    re_path(r'^health/', include('health_check.urls')),
]
