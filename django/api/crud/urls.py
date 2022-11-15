from django.urls import path, include
from rest_framework.authtoken import views
from .views.EventViewSet import EventViewSet
from rest_framework.routers import DefaultRouter

class OptionalSlashRouter(DefaultRouter):      
    def __init__(self, *args, **kwargs):         
        super(DefaultRouter, self).__init__(*args, **kwargs)         
        self.trailing_slash = '/?' 

router = OptionalSlashRouter('/?')
router.register('events', EventViewSet, basename='events')

urlpatterns = [
    path('', include(router.urls)),
]