from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import get_user_model
from django.contrib.auth import update_session_auth_hash
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, UserSerializer, UserSettingsSerializer
from .models import UserSettings

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
            send_mail(
                'Welcome to ElevateHer AI!',
                f'Hi {user.first_name or user.username},\n\nThank you for registering. Your career journey starts here!',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")

class LoginView(views.APIView):
    permission_classes = (AllowAny,)
    throttle_classes = [LoginThrottle]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # We need to manually authenticate
        from django.contrib.auth import authenticate
        user = authenticate(request, email=email, password=password)
        
        if not user:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
            
        # Check if 2FA is enabled
        if getattr(user.settings, 'two_factor_enabled', False):
            # Generate OTP
            import random
            from datetime import timedelta
            from django.utils import timezone
            from .models import OTP
            
            code = f"{random.randint(100000, 999999)}"
            expires_at = timezone.now() + timedelta(minutes=10)
            
            # Delete old OTPs and create new one
            OTP.objects.filter(user=user).delete()
            OTP.objects.create(user=user, code=code, expires_at=expires_at)
            
            # Send simulated email
            print(f"====================================")
            print(f"2FA OTP for {user.email}: {code}")
            print(f"====================================")
            
            return Response({"requires_otp": True, "email": user.email})
            
        # If no 2FA, issue JWT immediately
        return self.get_auth_response(user)

    def get_auth_response(self, user):
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        from .serializers import UserSerializer
        
        response = Response({
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
            max_age=15 * 60
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
            max_age=7 * 24 * 60 * 60
        )
        return response

class VerifyOTPView(views.APIView):
    permission_classes = (AllowAny,)
    throttle_classes = [LoginThrottle]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        code = request.data.get('otp')
        
        from django.contrib.auth import authenticate
        user = authenticate(request, email=email, password=password)
        if not user:
            return Response({"detail": "Invalid session or credentials."}, status=status.HTTP_401_UNAUTHORIZED)
            
        from django.utils import timezone
        from .models import OTP
        try:
            otp_obj = OTP.objects.get(user=user, code=code, expires_at__gt=timezone.now())
            otp_obj.delete() # Consume OTP
            
            # Return same auth response as LoginView
            login_view = LoginView()
            return login_view.get_auth_response(user)
            
        except OTP.DoesNotExist:
            return Response({"detail": "Invalid or expired OTP code."}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token:
            request.data['refresh'] = refresh_token
            
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                access_token = response.data.get('access')
                refresh_token_new = response.data.get('refresh')
                
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
    permission_classes = (AllowAny,)

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
            response = Response({"message": "Logged out with errors."}, status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response

class UserMeView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserSettingsView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSettingsSerializer

    def get_object(self):
        return self.request.user.settings


class ChangePasswordView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(current_password):
            return Response({"detail": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
            
        if len(new_password) < 8:
            return Response({"detail": "New password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        
        return Response({"detail": "Password successfully updated."})


class ForgotPasswordView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email__iexact=email)
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uidb64}/{token}"
            
            # Simulated email send
            try:
                send_mail(
                    'Password Reset for ElevateHer AI',
                    f'Hi,\n\nPlease click the link below to reset your password:\n{reset_link}\n\nIf you did not request this, please ignore this email.',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Simulated email sent to {user.email}. Reset Link: {reset_link}")
                
            return Response({
                "detail": "If an account exists with this email, a password reset link has been sent.",
                "dev_reset_link": reset_link
            })
                
        except User.DoesNotExist:
            return Response({"detail": "Development mode: No user found with this email."}, status=status.HTTP_404_NOT_FOUND)


class ResetPasswordView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        uidb64 = request.data.get('uidb64')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not uidb64 or not token or not new_password:
            return Response({"detail": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)
            
        if len(new_password) < 8:
            return Response({"detail": "New password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            
        if user is not None and PasswordResetTokenGenerator().check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password has been successfully reset."})
        else:
            return Response({"detail": "The password reset link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)


class ExportDataView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        data = {
            "profile": {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "username": user.username,
                "phone_number": user.phone_number,
                "date_joined": user.date_joined.isoformat(),
            },
            "settings": UserSettingsSerializer(user.settings).data,
            "resumes": list(user.resumes.values('filename', 'target_role', 'score', 'status', 'uploaded_at', 'last_scored_at')),
            "community_posts": list(user.forum_posts.values('title', 'content', 'created_at')),
            "finance_goals": list(user.financial_goals.values('title', 'category', 'target_amount', 'current_amount', 'created_at')),
            "interviews": list(user.interviews.values('title', 'interview_type', 'difficulty', 'status', 'scheduled_at'))
        }
        return Response(data)


class DeleteAccountView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        password = request.data.get('password')
        
        if not user.check_password(password):
            return Response({"detail": "Incorrect password. Cannot delete account."}, status=status.HTTP_400_BAD_REQUEST)
            
        user.delete()
        
        response = Response({"detail": "Account successfully deleted."}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response
