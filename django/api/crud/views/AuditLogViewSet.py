from rest_framework import viewsets
from rest_framework.response import Response
from ..serializers.AuditLogSerializer import AuditLogSerializer
from ..models.AuditLog import AuditLog
from ..permissions import IsOwner

class AuditLogViewSet(viewsets.ModelViewSet):
    """
    Events can be used for logging or notification purposes
    """
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer 
    permission_classes = [IsOwner]
    filterset_fields = ('resource', 'action', 'meta')
    ordering_fields = ['resource', 'action']

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        if getattr(self, 'swagger_fake_view', False):
            return None
        user = self.request.user
        return AuditLog.objects.filter(user=user)
