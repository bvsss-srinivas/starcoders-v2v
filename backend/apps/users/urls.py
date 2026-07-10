from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, UserMeView, CustomTokenRefreshView,
    UserSettingsView, ChangePasswordView, ExportDataView, DeleteAccountView,
    ForgotPasswordView, ResetPasswordView, VerifyOTPView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('me/', UserMeView.as_view(), name='user-me'),
    
    path('settings/', UserSettingsView.as_view(), name='user-settings'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('export-data/', ExportDataView.as_view(), name='export-data'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]
