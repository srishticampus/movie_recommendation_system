#accounts/views.py
"""
This module contains views and endpoints for the Movie Recommendation System.

It defines the API views for token authentication, permissions, and other
related features, using Django REST Framework and Simple JWT for token handling.
"""
# Create your views here.
from django.db.models.functions import ExtractWeek
from django.db.models import Count
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action,api_view
from rest_framework.views import APIView
from rest_framework import status
from .models import User,Profile
from .serializers import UserSerializer, LoginSerializer,ProfileSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API viewset for user creation and update.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class ProfileViewSet(viewsets.ModelViewSet):
    """
    API viewset for user profiles.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Ensure users can only access their own profile.
        """
        return Profile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Retrieve the current user's profile.
        """
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            # Return 204 No Content if the profile does not exist
            return Response({"detail": "the profile does not exist"},status=status.HTTP_204_NO_CONTENT)

        serializer = self.get_serializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['put'])
    def update_me(self, request):
        """
        Update the current user's profile.
        """
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            # Create a new profile if it doesn't exist
            profile = Profile.objects.create(user=request.user)

        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if not serializer.is_valid():
            # Return 400 Bad Request if the data is invalid
            return Response(
                {"error": "Invalid data.", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterView(generics.CreateAPIView):
    """
    API view for user registration.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        """
            Create a new user instance and return a response.
        """
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid data.", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save(is_active=True)
        return Response(
            {
                "message": "User registered successfully.",
                "data": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "user_type": user.user_type,
                    "is_active": user.is_active,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    API view for user login.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Validate user credentials and return tokens.
        """
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid data.", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tokens = serializer.save()
        return Response(
            {
                "message": "Login successful.",
                "data": tokens,
            },
            status=status.HTTP_200_OK,
        )

@api_view(['GET'])
def total_users(request):
    """
    API to get the total number of users.
    """
    total = User.objects.count()
    return Response({"total_users": total}, status=status.HTTP_200_OK)

@api_view(['GET'])
def users_by_week(request, year, month):
    """
    API to get the count of users who joined in each week of a specific year and month.
    """
    try:
        # Annotate users with their registration week
        users = User.objects.filter(
            date_joined__year=year,
            date_joined__month=month
        ).annotate(
            week=ExtractWeek('date_joined')
        )

        # Group users by week and count them
        week_counts = users.values('week').annotate(count=Count('id')).order_by('week')

        # Format the response
        response_data = {
            "year": year,
            "month": month,
            "week_counts": {
                f"week{week['week'] - (week_counts[0]['week'] - 1)}": week['count']
                for week in week_counts
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
