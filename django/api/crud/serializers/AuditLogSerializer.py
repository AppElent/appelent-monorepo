from rest_framework import serializers
from ..models.AuditLog import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = AuditLog
        #fields = ['id', 'title', 'author']
        fields = "__all__"
        #exclude = ['user']
