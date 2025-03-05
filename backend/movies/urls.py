#movies/urls.py
"""
Urls configuration page for the app movies
"""
from django.urls import path
from .views import MovieListView

urlpatterns = [
    path('movies/', MovieListView.as_view(), name='movie-list'),
]

