from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import os

from .modules.TestClass import TestClass

@api_view(['GET'])
def dummy(request):
    return Response([], status=status.HTTP_200_OK)