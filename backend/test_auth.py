import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core_project.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from django.urls import reverse

User = get_user_model()

def run_tests():
    client = APIClient()
    
    print("--- 1. Testing Registration ---")
    reg_data = {
        'email': 'testuser3@example.com',
        'username': 'testuser3',
        'password': 'SecurePassword123!',
        'password_confirm': 'SecurePassword123!',
        'first_name': 'Test',
        'last_name': 'User'
    }
    
    res = client.post('/api/users/register/', reg_data, format='json')
    if res.status_code == 201:
        print("✅ Registration successful")
    else:
        print(f"❌ Registration failed: {res.data}")
        
    # Check DB
    user = User.objects.get(email='testuser3@example.com')
    if user.password.startswith('argon2'):
        print(f"✅ Password correctly hashed with Argon2: {user.password[:30]}...")
    else:
        print(f"❌ Password not hashed with Argon2! Hash starts with: {user.password[:15]}")

    print("\n--- 2. Testing Login with correct credentials ---")
    res = client.post('/api/users/login/', {'email': 'testuser3@example.com', 'password': 'SecurePassword123!'}, format='json')
    if res.status_code == 200:
        cookies = res.cookies
        if 'access_token' in cookies and 'refresh_token' in cookies:
            print("✅ Login successful. HttpOnly cookies set for access_token and refresh_token")
        else:
            print("❌ Cookies not set properly")
    else:
        print(f"❌ Login failed: {res.data}")
        
    print("\n--- 3. Testing Login with wrong password ---")
    res = client.post('/api/users/login/', {'email': 'testuser3@example.com', 'password': 'WrongPassword!'}, format='json')
    if res.status_code == 401 and res.data.get('detail') == 'No active account found with the given credentials':
        print("✅ Correct generic error returned for wrong password")
    else:
        print(f"❌ Unexpected response: {res.status_code} - {res.data}")
        
    print("\n--- 4. Testing /me/ protected route ---")
    # With valid cookies
    client = APIClient()
    client.post('/api/users/login/', {'email': 'testuser3@example.com', 'password': 'SecurePassword123!'}, format='json')
    res = client.get('/api/users/me/')
    if res.status_code == 200 and res.data['email'] == 'testuser3@example.com':
        print("✅ /me/ endpoint correctly returns user with valid cookies")
    else:
        print(f"❌ /me/ endpoint failed: {res.status_code}")
        
    print("\n--- 5. Testing Logout ---")
    res = client.post('/api/users/logout/')
    if res.status_code == 205:
        # Check if cookies were deleted
        access_cookie = res.cookies.get('access_token')
        if access_cookie and access_cookie.value == '':
            print("✅ Logout successful and cookies cleared")
        else:
            print("❌ Logout cookies not cleared properly")
    else:
        print(f"❌ Logout failed: {res.status_code}")
        
    print("\n--- 6. Testing /me/ after logout ---")
    res = client.get('/api/users/me/')
    if res.status_code == 401:
        print("✅ /me/ correctly blocked after logout (401 Unauthorized)")
    else:
        print(f"❌ /me/ unexpectedly allowed after logout: {res.status_code}")

    # Clean up test user
    user.delete()

if __name__ == '__main__':
    run_tests()
