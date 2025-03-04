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
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'password', 'user_type', 'is_active', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True},
        }

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