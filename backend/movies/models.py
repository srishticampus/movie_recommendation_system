#movies/models.py
"""
This module contains database models for the movies app.
"""
import requests
from django.db import models
from django.conf import settings
from django.db.models import Avg

class Movie(models.Model):
    tmdb_id = models.IntegerField(unique=True)  # TMDb movie ID
    title = models.CharField(max_length=255)

    def average_user_rating(self):
        """Calculate the average rating given by users, or fetch from the external API if no ratings exist."""
        avg_rating = self.ratings.aggregate(avg_rating=Avg('rating'))['avg_rating']
        
        if avg_rating is not None:
            return avg_rating  # Return calculated average rating

        # Fetch from external API if no user ratings exist
        return self.fetch_external_rating()

    def fetch_external_rating(self):
        """Fetch movie rating from the TMDb API."""
        TMDB_API_KEY = settings.TMDB_API_KEY  # Ensure you have this key in settings.py
        url = f"https://api.themoviedb.org/3/movie/{self.tmdb_id}?api_key={TMDB_API_KEY}"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            return data.get('vote_average', 0)  # Default to 0 if no rating is found
        except requests.exceptions.RequestException:
            return 0  # Return 0 if API call fails

    def __str__(self):
        return self.title

class Rating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='ratings')
    rating = models.DecimalField(max_digits=3, decimal_places=1)  # Rating out of 10 (e.g., 8.5)
    review = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'movie')  # Ensure a user can rate a movie only once

    def __str__(self):
        return f"{self.user.email} - {self.movie.title}: {self.rating}"
