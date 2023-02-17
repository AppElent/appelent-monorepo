from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
import os

from .modules.TestClass import TestClass

@api_view(['GET'])
def dummy(request):
    return Response([], status=status.HTTP_200_OK)


@api_view(['GET'])
def environment(request):
    return Response(os.environ, status=status.HTTP_200_OK)

@api_view(['GET'])
def userinfo(request):
    print('authentication_class', request.user.authentication_class)
    return Response({}, status=status.HTTP_200_OK)