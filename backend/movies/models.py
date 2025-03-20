#movies/models.py
"""
This module contains database models for the movies app.
"""
import requests
from django.db import models
from django.conf import settings
from django.db.models import Avg
from decimal import Decimal

class Movie(models.Model):
    """
    This model represents a movie in the system.
    """
    tmdb_id = models.IntegerField(unique=True)  # TMDb movie ID (unique for each movie)
    title = models.CharField(max_length=255)
    average_rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)  # Field to store average rating

    def average_user_rating(self):
        """
        Calculate the average rating given by all users for this movie, including the TMDb rating.
        """
        # Fetch the TMDb rating and convert it to Decimal
        tmdb_rating = Decimal(str(self.fetch_external_rating()))

        # Calculate the average rating from all users
        user_ratings_avg = self.ratings.aggregate(avg_rating=Avg('rating'))['avg_rating']

        if user_ratings_avg is not None:
            # If user ratings exist, combine them with the TMDb rating
            combined_avg = (Decimal(str(user_ratings_avg)) + tmdb_rating) / Decimal('2')
        else:
            # If no user ratings exist, use the TMDb rating
            combined_avg = tmdb_rating

        # Update the average_rating field
        self.average_rating = combined_avg
        self.save()

        return combined_avg

    def fetch_external_rating(self):
        """Fetch movie rating from the TMDb API."""
        timeout = 15
        tmdb_api_key = settings.TMDB_API_KEY  # Ensure you have this key in settings.py
        url = f"https://api.themoviedb.org/3/movie/{self.tmdb_id}?api_key={tmdb_api_key}"
        
        try:
            response = requests.get(url, timeout=timeout)
            response.raise_for_status()
            data = response.json()
            return data.get('vote_average', 0)  # Default to 0 if no rating is found
        except requests.exceptions.RequestException:
            return 0  # Return 0 if API call fails

    def __str__(self):
        return self.title


class MovieWatchList(models.Model):
    """
    This model represents a user's watchlist.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='watchlist')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='watchlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        """
        Ensure a user can only add a movie to their watchlist once.
        """
        unique_together = ('user', 'movie')  # A user can only add a movie once

    def __str__(self):
        return f"{self.user.email} - {self.movie.title}"

class Rating(models.Model):
    """
    This model represents a user's rating and review for a movie.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='ratings')
    rating = models.DecimalField(max_digits=3, decimal_places=1)  # Rating out of 10 (e.g., 8.5)
    review = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """
        Define constraints for the Rating model.
        """
        unique_together = ('user', 'movie')  # Ensure a user can rate a movie only once

    def __str__(self):
        return f"{self.user.email} - {self.movie.title}: {self.rating}"
