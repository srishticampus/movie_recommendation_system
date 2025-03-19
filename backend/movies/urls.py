#movies/urls.py
"""
Urls configuration page for the app movies
"""
from django.urls import path
from .views import (MovieListView,MovieDetailView,RatingView,AddMovieToWatchlistView,WatchlistView,
                    UserRatingForMovieView,MovieRatingsView)

urlpatterns = [
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path("movies/<str:movie_id>/", MovieDetailView.as_view(), name="movie-detail"),
    path('add-to-watchlist/', AddMovieToWatchlistView.as_view(), name='add-to-watchlist'),
    path('watchlist/', WatchlistView.as_view(), name='watchlist'),  # For viewing the user's watchlist
    path('ratings/', RatingView.as_view(), name='rating-create'),  # For creating ratings
    path('ratings/<int:pk>/', RatingView.as_view(), name='rating-update-delete'),  # For updating/deleting ratings
    path('movies/<int:movie_tmdb_id>/my-rating/', UserRatingForMovieView.as_view(), name='user-rating-for-movie'),  # For fetching the user's rating for a movie
    path('movies/<int:movie_tmdb_id>/ratings/', MovieRatingsView.as_view(), name='movie-ratings'),  # For fetching all ratings for a movie
]