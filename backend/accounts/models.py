from django.db import models
from django.contrib.auth.models import User

class UserRole(models.TextChoices):
    FACILITY_MANAGER = 'FACILITY_MANAGER', 'Concerned Facility Manager'
    DEPARTMENT_POC = 'DEPARTMENT_POC', 'Concerned Department POC'
    TECHNICIAN = 'TECHNICIAN', 'Worker / Technician'

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=30, choices=UserRole.choices)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"