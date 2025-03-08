#movies/serializers.py
"""
This module contains serializers for the movies app.
"""
from rest_framework import serializers
from .models import Movie, Rating

class MovieSerializer(serializers.ModelSerializer):
    average_user_rating = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['id', 'tmdb_id', 'title', 'average_user_rating']

    def get_average_user_rating(self, obj):
        return obj.average_user_rating()

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')  # Show user email instead of ID
    movie_title = serializers.ReadOnlyField(source='movie.title')  # Display movie title

    class Meta:
        model = Rating
        fields = ['id', 'user', 'movie', 'movie_title', 'rating', 'review', 'created_at', 'updated_at']
        read_only_fields = ['user']

    def create(self, validated_data):
        """Ensure a user updates their rating instead of creating a duplicate."""
        user = self.context['request'].user
        movie = validated_data['movie']

        # Check if user has already rated the movie
        existing_rating = Rating.objects.filter(user=user, movie=movie).first()
        if existing_rating:
            # Update the existing rating instead of creating a new one
            existing_rating.rating = validated_data.get('rating', existing_rating.rating)
            existing_rating.review = validated_data.get('review', existing_rating.review)
            existing_rating.save()
            return existing_rating

        # If no previous rating exists, create a new one
        validated_data['user'] = user
        return super().create(validated_data)
