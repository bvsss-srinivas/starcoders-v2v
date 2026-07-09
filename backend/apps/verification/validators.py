import magic
from django.core.exceptions import ValidationError

ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
]

def validate_file_type(file):
    if not file:
        return
    
    file.seek(0)
    mime_type = magic.from_buffer(file.read(2048), mime=True)
    file.seek(0)
    
    if mime_type not in ALLOWED_MIME_TYPES:
        raise ValidationError(f'Unsupported file type: {mime_type}. Only PDF, JPEG, PNG, and WEBP are allowed.')
