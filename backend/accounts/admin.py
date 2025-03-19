#accounts/admin.py
"""
This module contains the admin configuration for the accounts app.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User,ContactMessage

# Registering the User model in the admin panel
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin class for the User model.
    """
    list_display = ['email', 'full_name', 'user_type', 'is_active', 'is_staff']
    list_filter = ['user_type', 'is_active', 'is_staff']
    search_fields = ['email', 'full_name', 'user_type']
    ordering = ['email']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'user_type')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2', 'is_active', 'is_staff', 'user_type'),
        }),
    )

    def get_fieldsets(self, request, obj=None):
        """
        Custom fieldsets for the User model.
        """
        if not obj:
            return self.add_fieldsets
        return super().get_fieldsets(request, obj)

# Registering the ContactMessage model in the admin panel
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """
    Admin class for the ContactMessage
    """
    list_display = ("name", "email", "created_at")
    search_fields = ("name", "email", "description")
