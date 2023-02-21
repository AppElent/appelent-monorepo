from crum import get_current_user
from django.db import models
from django.contrib.auth import get_user_model
from django_prometheus.models import ExportModelOperationsMixin

User = get_user_model()

class AuditLog(ExportModelOperationsMixin('auditlog'), models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=get_current_user)
    resource = models.CharField(max_length=200)
    action = models.CharField(max_length=200)
    author = models.TextField(null=True, blank=True)
    data = models.TextField(null=True, blank=True)
    previous_data = models.TextField(null=True, blank=True)
    meta = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.value 