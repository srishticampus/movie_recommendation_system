#accounts/urls.py
"""
Urls configuration page for the app accounts
"""
from django.urls import path,include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import UserViewSet,RegisterView,LoginView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
