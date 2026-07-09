from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Try to get token from header first
        header = self.get_header(request)
        if header is not None:
            raw_token = self.get_raw_token(header)
        else:
            # If no header, try to get it from the cookie
            raw_token = request.COOKIES.get('access_token')
            if raw_token is not None:
                # JWTAuthentication expects raw_token to be bytes
                raw_token = raw_token.encode('utf-8')

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
