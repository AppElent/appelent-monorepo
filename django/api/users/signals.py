from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from firebase_admin import auth

User = get_user_model()


def check_superuser(sender, instance, signal, *args, **kwargs):
    print('123 user is saved')
    if sender is User and instance.is_superuser and not instance.email.endswith('@company.com'):
        pass
    # Get firebase user
    firebase_user = auth.get_user(instance.firebase_uid)


post_save.connect(check_superuser, sender=User)
