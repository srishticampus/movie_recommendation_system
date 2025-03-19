#accounts/models.py
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser,BaseUserManager,PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.db import models
"""
This module contains database models for the accounts app.

It defines the User model extension. These models handle user data and profiles  forming the foundation for user management in
the system.
"""

# Custom User Manager
class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers for authentication instead of usernames.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
         custom create user function including email
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Custom super user create function with email instead of username
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # Ensure full_name is set, otherwise provide a default
        if not extra_fields.get("full_name"):
            extra_fields["full_name"] = "Admin"
        return self.create_user(email, password, **extra_fields)

# Custom User Model
class User(AbstractUser):
    """
    Custom User model to replace the default User model
    """
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)  # Check this field
    user_type = models.CharField(max_length=50, choices=[('admin', 'Admin'), ('user', 'User')],default='user')  # Check this field
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
#ContactMessage model
class ContactMessage(models.Model):
    """
    model to store contact messages from users
    """
    name = models.CharField(max_length=255)
    email = models.EmailField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set timestamp

    def __str__(self):
        return f"{self.name} - {self.email}"
