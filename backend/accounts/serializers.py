#accounts/serializers.py
"""
This module contains serializers for the accounts app.

It defines serializers for the user profile and related models, enabling data
serialization and deserialization for API requests and responses. This includes
handling custom fields and business logic, such as linking user profiles with
authenticated users.
"""
from rest_framework import serializers
from accounts.models import User
#Serializer for the User Model

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'username': {'required': True},
                        'email': {'required': True},
                        'password': {'required': True,'write_only':True},
                        'user_type':{'required':True},}
    def create(self, validated_data):
        """
        Create and return a new user instance, given the validated data.
        """
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    def update(self, instance, validated_data):
        """
        Update and return an existing user instance, given the validated data.
        """
        password = validated_data.pop('password', None)
        for attr,value in validated_data.items():
            setattr(instance,attr,value)
        if password is not None:
            instance.set_password(password)
        return instance        