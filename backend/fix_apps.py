import os

apps = ['jobs', 'finance', 'community', 'gamification']
for app in apps:
    path = f'apps/{app}/apps.py'
    if os.path.exists(path):
        with open(path, 'r') as f:
            c = f.read()
        c = c.replace(f"name = '{app}'", f"name = 'apps.{app}'")
        with open(path, 'w') as f:
            f.write(c)
        print(f"Fixed {path}")
