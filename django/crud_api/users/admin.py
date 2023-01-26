from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User

# Register your models here.
#admin.site.register(User, UserAdmin)


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Define admin model for custom User model with no email field."""
    exclude = ('password', )
    ordering = ('email',)
    list_display = ('email', 'first_name', 'last_name', 'is_superuser', )
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('is_superuser',)
    readonly_fields = ('email', 'username', )
    fieldsets = DjangoUserAdmin.fieldsets
    # fieldsets = (
    #     (None, {'fields': ('email', 'password', 'firebase_uid')}),)


# Add extra fields
# UserAdmin.fieldsets += ('firebase_uid',)
UserAdmin.list_display += ('firebase_uid',)  # don't forget the commas
UserAdmin.list_filter += ('firebase_uid',)
UserAdmin.fieldsets +=  (('Extra Fields', {'fields': ('firebase_uid', )}),)
