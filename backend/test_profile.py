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
    User.objects.filter(email='testprofile@example.com').delete()
    
    print("--- 1. Register User ---")
    reg_data = {
        'email': 'testprofile@example.com',
        'username': 'testprofile',
        'password': 'SecurePassword123!',
        'password_confirm': 'SecurePassword123!',
        'first_name': 'Original',
        'last_name': 'Name'
    }
    client.post('/api/users/register/', reg_data, format='json')
    
    print("\n--- 2. Login ---")
    res = client.post('/api/users/login/', {'email': 'testprofile@example.com', 'password': 'SecurePassword123!'}, format='json')
    if res.status_code != 200:
        print("Login failed")
        return
        
    print("\n--- 3. Fetch Profile (GET /me/) ---")
    res = client.get('/api/users/me/')
    print(res.data)
    
    print("\n--- 4. Update Profile (PUT /me/) ---")
    update_data = {
        'first_name': 'UpdatedFirst',
        'last_name': 'UpdatedLast',
        'username': 'updatedusername',
        'email': 'hacked@example.com' # This should be ignored due to read_only_fields
    }
    res = client.put('/api/users/me/', update_data, format='json')
    if res.status_code == 200:
        print("✅ Profile updated successfully")
        print("New Data:", res.data)
        if res.data['email'] == 'testprofile@example.com':
            print("✅ Email was correctly ignored (read-only)")
        else:
            print("❌ Email was changed!")
    else:
        print("❌ Profile update failed", res.status_code, res.data)

if __name__ == '__main__':
    run()
