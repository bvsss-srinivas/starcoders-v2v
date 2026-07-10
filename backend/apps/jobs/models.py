from django.db import models

class Job(models.Model):
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    salary = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    apply_url = models.URLField(max_length=500, blank=True, null=True)
    job_type = models.CharField(max_length=100) # e.g. Full-time, Remote
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} at {self.company}"
