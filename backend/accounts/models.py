#accounts/models.py
from django.db import models
"""
This module contains database models for the accounts app.

It defines the User model extension, Profile model. These models handle user dataand profiles  forming the foundation for user management in
the system.
"""
# Create your models here.

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user model inheriting from AbstractUser.
    """
    USER_TYPE_CHOICES = (
        ('user', 'Normal User'),
        ('admin', 'Admin'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='user')
    email = models.EmailField(unique=True)
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"