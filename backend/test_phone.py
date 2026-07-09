import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core_project.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

def run():
    client = APIClient()
    
    # 1. Register a test user
    User.objects.filter(email='phonetest@example.com').delete()
    
    print("--- 1. Register User with Phone Number ---")
    reg_data = {
        'email': 'phonetest@example.com',
        'username': 'phonetest',
        'password': 'SecurePassword123!',
        'password_confirm': 'SecurePassword123!',
        'first_name': 'Original',
        'last_name': 'Name',
        'phone_number': '123-456-7890'
    }
    res = client.post('/api/users/register/', reg_data, format='json')
    if res.status_code != 201:
        print("Registration failed", res.data)
        return
        
    print("\n--- 2. Login ---")
    res = client.post('/api/users/login/', {'email': 'phonetest@example.com', 'password': 'SecurePassword123!'}, format='json')
    if res.status_code != 200:
        print("Login failed")
        return
        
    print("\n--- 3. Fetch Profile (GET /me/) ---")
    res = client.get('/api/users/me/')
    print(res.data)
    if res.data.get('phone_number') == '123-456-7890':
        print("✅ Phone number saved during registration")
    else:
        print("❌ Phone number NOT saved during registration")
    
    print("\n--- 4. Update Profile (PUT /me/) ---")
    update_data = {
        'first_name': 'UpdatedFirst',
        'last_name': 'UpdatedLast',
        'username': 'phonetest',
        'phone_number': '098-765-4321'
    }
    res = client.put('/api/users/me/', update_data, format='json')
    if res.status_code == 200:
        print("✅ Profile updated successfully")
        print("New Data:", res.data)
        if res.data.get('phone_number') == '098-765-4321':
            print("✅ Phone number updated correctly")
        else:
            print("❌ Phone number NOT updated")
    else:
        print("❌ Profile update failed", res.status_code, res.data)

if __name__ == '__main__':
    run()
