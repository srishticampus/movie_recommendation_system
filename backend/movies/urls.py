#movies/urls.py
"""
Urls configuration page for the app movies
"""
from django.urls import path
from .views import (
    MovieListView, MovieDetailView, RatingView, 
    AddMovieToWatchlistView, WatchlistView, RemoveFromWatchlistView,
    UserRatingForMovieView, MovieRatingsView, MovieRecommendationView,
    TotalMoviesCountView, AllMoviesView
)

urlpatterns = [
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path("movies/<str:movie_id>/", MovieDetailView.as_view(), name="movie-detail"),
    path('add-to-watchlist/', AddMovieToWatchlistView.as_view(), name='add-to-watchlist'),
    path('remove-from-watchlist/<int:movie_id>/', RemoveFromWatchlistView.as_view(), name='remove-from-watchlist'),
    path('watchlist/', WatchlistView.as_view(), name='watchlist'),
    path('ratings/', RatingView.as_view(), name='rating-create'),
    path('ratings/<int:pk>/', RatingView.as_view(), name='rating-update-delete'),
    path('movies/<int:movie_tmdb_id>/my-rating/', UserRatingForMovieView.as_view(), name='user-rating-for-movie'),
    path('movies/<int:movie_tmdb_id>/ratings/', MovieRatingsView.as_view(), name='movie-ratings'),
    path('recommendations/', MovieRecommendationView.as_view(), name='movie-recommendations'),
    path('total-movies/', TotalMoviesCountView.as_view(), name='total-movies'),
    path('all-movies/', AllMoviesView.as_view(), name='all-movies'),
]