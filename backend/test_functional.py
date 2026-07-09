import os
import django
import sys
import tempfile
import io

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core_project.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()

def run():
    client = APIClient()
    
    User.objects.filter(email='backendtest@example.com').delete()
    
    print("--- 1. Register User (Checking Email) ---")
    reg_data = {
        'email': 'backendtest@example.com',
        'username': 'backendtest',
        'password': 'SecurePassword123!',
        'password_confirm': 'SecurePassword123!',
        'first_name': 'Backend',
        'last_name': 'Test'
    }
    
    # Capture stdout to see if email was printed
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        res = client.post('/api/users/register/', reg_data, format='json')
        
    output = f.getvalue()
    if res.status_code == 201:
        if 'Welcome to ElevateHer AI!' in output:
            print("✅ Email printed to console successfully!")
        else:
            print("❌ Email was NOT printed to console.")
            print("Output was:", output)
    else:
        print("Registration failed", res.data)
        return
        
    print("\n--- 2. Login ---")
    res = client.post('/api/users/login/', {'email': 'backendtest@example.com', 'password': 'SecurePassword123!'}, format='json')
    if res.status_code != 200:
        print("Login failed")
        return
        
    print("\n--- 3. Upload Resume ---")
    mock_file = SimpleUploadedFile("test_resume.pdf", b"file_content", content_type="application/pdf")
    res = client.post('/api/resumes/', {'file': mock_file, 'filename': 'test_resume.pdf'}, format='multipart')
    if res.status_code == 201:
        print("✅ Resume uploaded successfully!")
        print(res.data)
    else:
        print("❌ Resume upload failed", res.data)
        
    print("\n--- 4. Schedule Mock Interview ---")
    res = client.post('/api/interviews/', {'role': 'Data Scientist', 'company': 'Meta', 'date': '2026-11-01', 'time': '10:00 AM'}, format='json')
    if res.status_code == 201:
        print("✅ Interview scheduled successfully!")
        print(res.data)
    else:
        print("❌ Interview scheduling failed", res.data)

if __name__ == '__main__':
    run()
