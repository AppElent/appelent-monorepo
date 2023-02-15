from django.urls import path, include
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter
from .views import RegistrationView, ChangePasswordView

class OptionalSlashRouter(DefaultRouter):      
    def __init__(self, *args, **kwargs):         
        super(DefaultRouter, self).__init__(*args, **kwargs)         
        self.trailing_slash = '/?' 

router = OptionalSlashRouter('/?')
#router.register('register', RegistrationView.as_view(), basename='register')
#router.register('change-password', ChangePasswordView.as_view(), basename='change-password')

urlpatterns = [
    path('', include(router.urls)),
    path('register', RegistrationView.as_view(), name='register'),
    path('change-password', ChangePasswordView.as_view(), name='change-password'),
]