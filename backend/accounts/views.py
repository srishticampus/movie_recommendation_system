#accounts/views.py
"""
This module contains views and endpoints for the Movie Recommendation System.

It defines the API views for token authentication, permissions, and other
related features, using Django REST Framework and Simple JWT for token handling.
"""
# Create your views here.
from rest_framework import generics,viewsets,permissions
from accounts.models import User
from accounts.serializers import UserSerializer
#User Registration View

class UserViewSet(viewsets.ModelViewSet):
    """
    API viewset for user creation and update.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
           return [permissions.AllowAny()]
        return super().get_permissions()        
    