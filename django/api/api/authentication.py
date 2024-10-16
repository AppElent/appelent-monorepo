

# 
from rest_framework import authentication, exceptions, HTTP_HEADER_ENCODING
from django.contrib.auth import get_user_model
#from django.conf import settings
User = get_user_model()
from firebase_admin import auth


# stdartup firebase
# import json
# import os
# import firebase_admin
# from firebase_admin import credentials, auth
# if not firebase_admin._apps:
#     # cred = credentials.Certificate('path/to/serviceAccountKey.json') 
#     # default_app = firebase_admin.initialize_app(cred)
#     cred = credentials.Certificate(json.loads(os.getenv("FIREBASE_CREDS")))
#     firebase_admin.initialize_app(cred)
# user = auth.get_user("KqVejHU9lzXX8xbpdKtXTLhm3yg1")
# print('user', user.uid, user.custom_claims)
# print('--- Firebase loaded successfully ---')

#print(settings.environment)
from django.conf import settings
#print(settings.environment)

class DevelopmentAuthentication(authentication.TokenAuthentication):
    """
    Extend the TokenAuthentication class to support development authentication
    in the form of "http://www.example.com/?development=<token_key>"
    """

    

    def authenticate(self, request):
        # Check if 'token_auth' is in the request query params.
        # Give precedence to 'Authorization' header.
        if 'development' in request.query_params and \
                'HTTP_AUTHORIZATION' not in request.META and \
                    settings.ENVIRONMENT == 'LOCAL':
            user=user = User.objects.get(email="ericjansen@live.nl")
            user.authentication_class = "DevelopmentAuthentication"
            return (user, None)



def get_authorization_header(request):
    """
    Return request's 'Authorization:' header, as a bytestring.
    Hide some test client ickyness where the header can be unicode.
    """
    auth = request.META.get('HTTP_AUTHORIZATION', b'')
    if isinstance(auth, str):
        # Work around django test client oddness
        auth = auth.encode(HTTP_HEADER_ENCODING)
    return auth


class TokenAuthSupportQueryString(authentication.TokenAuthentication):
    """
    Extend the TokenAuthentication class to support querystring authentication
    in the form of "http://www.example.com/?access_token=<token_key>"
    """

    def authenticate(self, request):
        # Check if 'token_auth' is in the request query params.
        # Give precedence to 'Authorization' header.
        if 'access_token' in request.query_params and \
                'HTTP_AUTHORIZATION' not in request.META:
            return self.authenticate_credentials(request.query_params.get('access_token'))
        else:
            return super(TokenAuthSupportQueryString, self).authenticate(request)


class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Authentication for firebase front-ends.
    Needs Authorization header in the form of "Firebase <token>" to work.
    """
    keyword = 'Firebase'

    def authenticate(self, request, **credentials):
        authheader = get_authorization_header(request)

        if not authheader:
            return None

        authheader = authheader.split()

        if not authheader or authheader[0].lower() != self.keyword.lower().encode():
            return None

        if len(authheader) == 1:
            msg = ('Invalid token header. No credentials provided.')
            raise exceptions.AuthenticationFailed(msg)
        elif len(authheader) > 2:
            msg = ('Invalid token header. Token string should not contain spaces.')
            raise exceptions.AuthenticationFailed(msg)
        print('firebase auth hier komt ie')
        token = authheader[1]

        try:
            decoded = auth.verify_id_token(token)
        except:
            raise exceptions.AuthenticationFailed('Token incorrect')

        try:
            user = User.objects.get(email=decoded["email"])
            if user.firebase_uid is None:
                user.firebase_uid = decoded["uid"]
                user.save()
        except User.DoesNotExist:
            try:
                user = User.objects.create_user(email=decoded["email"])
            except:
                raise exceptions.AuthenticationFailed(
                    'User does not exist and cannot be created')
        user.authentication_class = "FirebaseAuthentication"

        return (user, decoded)
