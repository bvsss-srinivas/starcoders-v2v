from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import get_user_model
from django.conf import settings
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, UserSerializer

User = get_user_model()

class RegisterThrottle(AnonRateThrottle):
    scope = 'register'

class LoginThrottle(AnonRateThrottle):
    scope = 'login'

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    throttle_classes = [RegisterThrottle]

    def perform_create(self, serializer):
        user = serializer.save()
        
        # Create pending verification record
        from apps.verification.models import Verification, VerificationHistory
        verification = Verification.objects.create(user=user, status='pending')
        VerificationHistory.objects.create(verification=verification, status='pending', changed_by=user)
        
        try:
            from django.core.mail import send_mail
            send_mail(
                'Welcome to ElevateHer AI!',
                f'Hi {user.first_name or user.username},\n\nThank you for registering. Your career journey starts here!',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")

class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes = [LoginThrottle]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            
            # Remove tokens from response body for security
            del response.data['access']
            del response.data['refresh']

            # Set HttpOnly cookies
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=15 * 60 # 15 minutes
            )
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=7 * 24 * 60 * 60 # 7 days
            )
            
        return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token:
            request.data['refresh'] = refresh_token
            
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                access_token = response.data.get('access')
                refresh_token_new = response.data.get('refresh') # if ROTATE_REFRESH_TOKENS is true
                
                if 'access' in response.data:
                    del response.data['access']
                if 'refresh' in response.data:
                    del response.data['refresh']

                response.set_cookie(
                    key='access_token',
                    value=access_token,
                    httponly=True,
                    secure=not settings.DEBUG,
                    samesite='Lax',
                    max_age=15 * 60
                )
                
                if refresh_token_new:
                    response.set_cookie(
                        key='refresh_token',
                        value=refresh_token_new,
                        httponly=True,
                        secure=not settings.DEBUG,
                        samesite='Lax',
                        max_age=7 * 24 * 60 * 60
                    )
            return response
        except Exception as e:
            return Response({"detail": "Token is invalid or expired"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(generics.GenericAPIView):
    permission_classes = (AllowAny,) # Because token might be expired

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            response = Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response
        except Exception as e:
            # Always clear cookies even if blacklisting fails (e.g. token expired/invalid)
            response = Response({"message": "Logged out with errors."}, status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response

class UserMeView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
