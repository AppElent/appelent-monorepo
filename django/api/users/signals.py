from django.db.models.signals import pre_save, m2m_changed
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from firebase_admin import auth
import json

User = get_user_model()

def get_claims(user):
    claims = {
        'admin': user.is_superuser,
        'staff': user.is_staff,
        'groups': []
    }
    for group in user.groups.all():
        claims['groups'].append(group.name)
    return claims

def update_claims(sender, instance, update_fields, *args, **kwargs):
    # Do not run when user is logging in
    if update_fields is not None and iter(update_fields).__next__() == 'last_login' and len(update_fields) == 1:
        return

    if sender is User and instance.is_superuser and not instance.email.endswith('@company.com'):
        pass

    if instance.pk is None:
        return

    # Get firebase user
    firebase_user = None
    if instance.firebase_uid is not None:
        firebase_user = auth.get_user(instance.firebase_uid)
    else:
        try:
            firebase_user = auth.get_user_by_email(instance.email)
        except:
            pass
    
    if not firebase_user:
        firebase_user = auth.create_user(email=instance.email, password=instance.password)

    instance.firebase_uid = firebase_user.uid

    # Groups
    # print(instance.groups.all())
    # for group in instance.groups.all():
    #     print(group)

    if firebase_user:
        # firebase_user = auth.create_user(
        #     email=instance.email)
        # Update user claims
        claims = get_claims(instance)
        print('claims', claims)
        auth.set_custom_user_claims(firebase_user.uid, json.dumps(claims))
        auth.get

@receiver(signal=m2m_changed, sender=User.groups.through)
def my_receiver(instance, action, reverse, model, pk_set, using, *args, **kwargs):
    claims = get_claims(instance)

    try:
        firebase_user = auth.get_user(instance.firebase_uid)
    except:
        pass

    if action == "post_remove" or action == "post_add" and firebase_user is not None:
        auth.set_custom_user_claims(firebase_user.uid, json.dumps(claims))

pre_save.connect(update_claims, sender=User)

