#accounts/serializers.py
"""
This module contains serializers for the accounts app.

It defines serializers for the user profile and related models, enabling data
serialization and deserialization for API requests and responses. This includes
handling custom fields and business logic, such as linking user profiles with
authenticated users.
"""
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User,Profile,ContactMessage

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    Includes profile_pic and phone_number from the related Profile model.
    """
    profile_pic = serializers.SerializerMethodField()  # Add profile_pic field
    phone_number = serializers.SerializerMethodField()  # Add phone_number field

    class Meta:
        """
        Define the fields to include in the serializer.
        """
        model = User
        fields = ['id', 'email', 'full_name', 'password', 'user_type', 'is_active', 'is_staff', 'profile_pic', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def get_profile_pic(self, obj):
        """
        Get the profile picture URL from the related Profile model.
        """
        if hasattr(obj, 'profile'):
            return obj.profile.profile_pic.url if obj.profile.profile_pic else None
        return None

    def get_phone_number(self, obj):
        """
        Get the phone number from the related Profile model.
        """
        if hasattr(obj, 'profile'):
            return obj.profile.phone_number
        return None

    def create(self, validated_data):
        """
        Create and return a new user instance, given the validated data.
        """
        validated_data.setdefault('is_active', True)
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        """
        Update and return an existing user instance, given the validated data.
        """
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Profile model.
    """
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name')

    class Meta:
        """
        Define the fields to include in the serializer.
        """
        model = Profile
        fields = ['full_name', 'email', 'profile_pic', 'phone_number']

    def update(self, instance, validated_data):
        """
        Update the profile and associated user fields.
        """
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update user fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for JWT token generation.
    """
    def validate(self, attrs):
        """
        Validate user credentials and return tokens.
        """
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise ValidationError({"error": "Email and password are required."}, code="invalid_credentials")

        user = authenticate(email=email, password=password)
        if not user:
            raise ValidationError({"error": "Invalid email or password."}, code="invalid_credentials")

        if not user.is_active:
            raise ValidationError({"error": "This account is not active."}, code="inactive_account")

        data = super().validate(attrs)
        data.update({
            "email": user.email,
            "full_name": user.full_name,
            "user_type": user.user_type,
        })
        return data


class LoginSerializer(serializers.Serializer):
    """
    Serializer for the login endpoint.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """
        Validate email and password.
        """
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise ValidationError({"error": "Email and password are required."}, code="invalid_credentials")

        user = authenticate(email=email, password=password)
        if not user:
            raise ValidationError({"error": "Invalid email or password."}, code="invalid_credentials")

        if not user.is_active:
            raise ValidationError({"error": "This account is not active."}, code="inactive_account")

        attrs['user'] = user
        return attrs

    def create(self, validated_data):
        """
        Generate JWT tokens for the user.
        """
        user = validated_data['user']
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "email": user.email,
            "full_name": user.full_name,
            "user_type": user.user_type,
        }

class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Serializer for the ContactMessage model.
    """
    class Meta:
        """
        Define the fields to include in the serializer.
        """
        model = ContactMessage
        fields = ['id', 'name', 'email', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']