#accounts/urls.py
"""
Urls configuration page for the app accounts
"""
from django.urls import path,include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import (UserViewSet,RegisterView,LoginView,ProfileViewSet,total_users,users_by_week,
                            UserAdminViewSet,ContactMessageListCreateAPIView)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'admin/users', UserAdminViewSet, basename='admin-users')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('total-users/', total_users, name='total-users'),
    path('users-by-week/<int:year>/<int:month>/', users_by_week, name='users-by-week'),
    path('contact-messages/', ContactMessageListCreateAPIView.as_view(), name='contact-messages'),
]
