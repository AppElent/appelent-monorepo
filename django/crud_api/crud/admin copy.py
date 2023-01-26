from django.contrib import admin
from .models.Event import Event

# Register your models here.
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    ordering = ['datetime']
    search_fields = ['value', 'application']