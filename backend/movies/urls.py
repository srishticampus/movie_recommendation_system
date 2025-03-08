#movies/urls.py
"""
Urls configuration page for the app movies
"""
from django.urls import path
from .views import MovieListView,MovieDetailView,RatingView,AddMovieToWatchlistView

urlpatterns = [
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path("movies/<str:movie_id>/", MovieDetailView.as_view(), name="movie-detail"),
    path('add-to-watchlist/', AddMovieToWatchlistView.as_view(), name='add-to-watchlist'),
    path('ratings/', RatingView.as_view(), name='rating-manage'),
]