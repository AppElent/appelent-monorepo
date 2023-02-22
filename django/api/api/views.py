from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
import os
from django.core.cache import cache
from api.permission import IsStaff

from .modules.TestClass import TestClass

@api_view(['GET'])
def dummy(request):
    cache.set('test', 'dit is een test')
    return Response([], status=status.HTTP_200_OK)


# @api_view(['GET'])
# @permission_classes([IsStaff])
# def environment(request):
#     return Response(os.environ, status=status.HTTP_200_OK)

@api_view(['GET'])
def userinfo(request):
    return Response({}, status=status.HTTP_200_OK)


@api_view(['GET'])
def hostname(request):
    return Response(request.get_host(), status=status.HTTP_200_OK)