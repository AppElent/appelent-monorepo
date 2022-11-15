from django.db.models.signals import post_save
from django.contrib.auth import get_user_model

User = get_user_model()


def check_superuser(sender, instance, signal, *args, **kwargs):
    print('123 user is saved')
    if sender is User and instance.is_superuser and not instance.email.endswith('@company.com'):
        pass


post_save.connect(check_superuser, sender=User)
