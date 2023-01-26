from authlib.integrations.requests_client import OAuth2Session
from django.http import HttpResponseRedirect
from rest_framework import status, renderers
from rest_framework.decorators import api_view, authentication_classes, permission_classes, renderer_classes
from rest_framework.response import Response
from django.core.cache import cache
import urllib
from requests.models import PreparedRequest
import os
import json

#from ..serializers import OAuth2TokenSerializer
#from ..models import OAuth2Token, Oauth2State
# rom ..singletons import oauth, check_registered
#from ..modules.oauth import get_provider, save_token, get_session, update_token

from azure.cosmos import CosmosClient

# Get providers from azure cosmos db
try:
    environment = str(os.getenv("ENVIRONMENT") or "LOCAL").lower()
    access_key = os.getenv('COSMOS_ACCESS_KEY') or ''
    container_name = "providers_" + environment
    query = "select * from " + container_name + " p"
    print(environment, query)
    client = CosmosClient(
        "https://cdb-appelent.documents.azure.com:443/", access_key)
    database = client.get_database_client("oauth_providers")
    container = database.get_container_client(container_name)
    providers = []
    for item in container.query_items(query=query, enable_cross_partition_query=True):
        providers.append(item)
    print('--- Cosmos DB Adapter loaded successfully. ---')
except Exception as e:
    print('!!!!! Data from Cosmos DB could not be retrieved. Is Environment Variable COSMOS_ACCESS_KEY set?')
    print(e)


def get_provider(name):
    return next((x for x in providers if x.get('id') == name), None)


def get_cache_key(key):
    return 'oauth:' + key


@api_view(['GET'])
def authorize(request, name):
    provider = get_provider(name)
    if provider is None:
        return Response('Cannot get OauthProvider because ' + name + ' is not set up in OauthProvider table', status=status.HTTP_412_PRECONDITION_FAILED)

    # determine scope and other variables
    scope = provider["default_scope"] if request.GET.get(
        'scope') is None else request.GET.get('scope')
    redirect_url = request.GET.get('redirect_url')
    config = request.GET.get('config')

    oauth_session = OAuth2Session(
        provider["client_id"], redirect_uri=provider["redirect_url"], scope=scope)
    authorization_url, state = oauth_session.create_authorization_url(
        provider["authorize_url"])

    # Create saved state object and save it
    state_object = {"scope": scope, "redirect_url": redirect_url, "config": config}
    cache.set(get_cache_key(state), state_object, 300)

    # If query param is set return redirect
    if str(request.GET.get('redirect')).lower() == "true":
        return HttpResponseRedirect(authorization_url)
    return Response(authorization_url)
    # return oauth.create_client(name).authorize_redirect(request, redirect_uri)
    # return oauth.enelogic.authorize_redirect(request, redirect_uri)


@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
@renderer_classes([renderers.JSONRenderer])
def get_access_token(request, name):
    provider = get_provider(name)
    if provider is None:
        return Response('Cannot get OauthProvider because ' + name + ' is not set up in OauthProvider table', status=status.HTTP_412_PRECONDITION_FAILED)

    # Retrieve state from response and check if its correct
    urlstate = request.query_params.get('state')
    print('urlstate', urlstate)

    # Get saved state
    savedstate = cache.get(get_cache_key(urlstate))
    print('state', savedstate)

    if savedstate is None:
        return Response('Saved state cannot be found', status=status.HTTP_400_BAD_REQUEST)
    else:
        cache.delete('oauth:' + urlstate)

    if request.method == 'GET' and savedstate["redirect_url"] is not None:
        # If method is GET, we return from API endpoint and should first return with a redirect to the provided redirect Url
        # First we have to save the authorization response so that we can use this when we request the token
        # Client is responsible for requesting the token with provided code parameter
        savedstate["authorization_response"] = request.get_full_path()
        cache.set(get_cache_key(urlstate), savedstate, 300)

        # Add query state param
        redirect_url = savedstate["redirect_url"]
        config = savedstate.get("config")
        params = {'state': urlstate, 'config': config}
        #quoted_params = urllib.parse.urlencode(params)
        #full_url = redirect_url + quoted_params
        req = PreparedRequest()
        req.prepare_url(redirect_url, params)

        return HttpResponseRedirect(req.url)

    if request.method == 'POST':
        # Assumption is that this is requested by the client, so authorization response should be in state
        if savedstate["authorization_response"] is None:
            return Response('Authorization response not present in cache', status=status.HTTP_412_PRECONDITION_FAILED)

    authorization_response = request.get_full_path() if savedstate.get(
        "authorization_response") is None else savedstate.get("authorization_response")

    # Retrieve access token
    oauth_session = OAuth2Session(
        provider["client_id"], redirect_uri=provider["redirect_url"], scope=savedstate["scope"], state=urlstate)
    token = oauth_session.fetch_token(
        provider["access_token_url"],
        authorization_response=authorization_response,
        # Google specific extra parameter used for client
        # authentication
        client_secret=provider["client_secret"]
    )

    print('token', token)

    #result = save_token(name, savedstate.user, token)
    if savedstate["redirect_url"] is not None and request.method == 'GET':
        return HttpResponseRedirect(savedstate["redirect_url"] + '?state=' + urlstate + '&config=' + config)
    return Response(token, status=status.HTTP_200_OK)


@api_view(['POST'])
def refresh_access_token(request, name):
    provider = get_provider(name)
    if provider is None:
        return Response('Cannot get OauthProvider because ' + name + ' is not set up in OauthProvider table', status=status.HTTP_412_PRECONDITION_FAILED)

    # try:
    #     instance = OAuth2Token.objects.get(user=savedstate.user, name=name)
    #     serializer = OAuth2TokenSerializer(data=token, instance=instance)
    # except OAuth2Token.DoesNotExist:
    #     serializer = OAuth2TokenSerializer(data=token)
    # if serializer.is_valid():
    #     serializer.save()
    #     return Response('Credentials saved successfully. You can close this window.', status=status.HTTP_201_CREATED)
    # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# def get_authorization_url(request, name):
#     provider = get_provider(name)
#     if provider is None:
#         return Response('Cannot get OauthProvider because ' + name + ' is not set up in OauthProvider table', status=status.HTTP_412_PRECONDITION_FAILED)
#     redirect_uri = provider.redirect_uri
#     oauth_session = OAuth2Session(provider.client_id, redirect_uri=provider.redirect_uri, scope=provider.default_scope)
#     authorization_url, state = oauth_session.authorization_url(provider.authorize_url, state=defaultstate(request.user.id))
#     save_state(name, state)
#     return Response(authorization_url)

# @api_view(['GET', 'POST'])
# @authentication_classes([])
# @permission_classes([])
# @renderer_classes([renderers.JSONRenderer])
# def save_access_token(request, name):
#     provider = get_provider(name)
#     if provider is None:
#         return Response('Cannot get OauthProvider because ' + name + ' is not set up in OauthProvider table', status=status.HTTP_412_PRECONDITION_FAILED)
#     urlstate = request.query_params.get('state')
#     savedstate = Oauth2State.objects.filter(name=name, state=urlstate).first()
#     if savedstate is None:
#         return Response('Saved state cannot be found', status=status.HTTP_400_BAD_REQUEST)
#     savedstate.delete()
#     oauth_session = OAuth2Session(provider.client_id, redirect_uri=provider.redirect_uri, scope=provider.default_scope, state=urlstate)
#     token = oauth_session.fetch_token(
#         provider.access_token_url,
#         authorization_response=request.get_full_path(),
#         # Google specific extra parameter used for client
#         # authentication
#         client_secret=provider.client_secret
#     )
#     result = save_token(name, savedstate.user, token)
#     if result is True:
#         return Response('Credentials saved successfully. You can close this window.', status=status.HTTP_201_CREATED)
#     return Response(result, status=status.HTTP_400_BAD_REQUEST)
#     # try:
#     #     instance = OAuth2Token.objects.get(user=savedstate.user, name=name)
#     #     serializer = OAuth2TokenSerializer(data=token, instance=instance)
#     # except OAuth2Token.DoesNotExist:
#     #     serializer = OAuth2TokenSerializer(data=token)
#     # if serializer.is_valid():
#     #     serializer.save()
#     #     return Response('Credentials saved successfully. You can close this window.', status=status.HTTP_201_CREATED)
#     # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'POST'])
# def refresh_access_token(request, name):
#     provider = get_provider(name)
#     if provider is None:
#         return Response('Cannot get OauthProvider because ' + name + ' is not set up in OauthProvider table', status=status.HTTP_412_PRECONDITION_FAILED)

#     token = OAuth2Token.objects.get(name=name, user=request.user)
#     if not token:
#         return Response(name + ' token cannnot be found in database', status=status.HTTP_412_PRECONDITION_FAILED)

#     session = get_session(name, request.user)
#     if not session:
#         return Response('Session cannnot be found', status=status.HTTP_412_PRECONDITION_FAILED)

#     result = refresh_token(name, request.user, token)
#     if result is True:
#         return Response('Credentials updated successfully. You can close this window.', status=status.HTTP_201_CREATED)
#     return Response(result, status=status.HTTP_400_BAD_REQUEST)
