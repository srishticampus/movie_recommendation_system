#movies/serializers.py
"""
This module contains serializers for the movies app.
"""
from rest_framework import serializers
from .models import Movie, Rating

class MovieSerializer(serializers.ModelSerializer):
    """
    Serializer for the Movie model.
    """
    average_user_rating = serializers.SerializerMethodField()

    class Meta:
        """
        Define the fields to include in the serialized output.
        """
        model = Movie
        fields = ['id', 'tmdb_id', 'title', 'average_user_rating', 'average_rating']

    def get_average_user_rating(self, obj):
        """
        Calculate the average user rating for the movie.
        """
        return obj.average_user_rating()

class RatingSerializer(serializers.ModelSerializer):
    """
    Serializer for the Rating model.
    """
    user = serializers.ReadOnlyField(source='user.email')  # Show user email instead of ID
    movie_title = serializers.ReadOnlyField(source='movie.title')  # Display movie title
    movie = serializers.IntegerField(write_only=True)  # Accept tmdb_id as input

    class Meta:
        """
        Define the fields to include in the serialized output.
        """
        model = Rating
        fields = ['id', 'user', 'movie', 'movie_title', 'rating', 'review', 'created_at', 'updated_at']
        read_only_fields = ['user', 'movie_title']

    def validate_movie(self, value):
        """
        Validate that the movie exists in the database.
        """
        try:
            movie = Movie.objects.get(tmdb_id=value)
        except Movie.DoesNotExist as exc:
            raise serializers.ValidationError("Movie not found in the database.") from exc
        return movie  # Return the Movie object instead of tmdb_id

    def create(self, validated_data):
        """
        Create or update a rating.
        """
        user = self.context['request'].user
        movie = validated_data['movie']  # This is now the Movie object

        # Check if the user has already rated this movie
        existing_rating = Rating.objects.filter(user=user, movie=movie).first()
        if existing_rating:
            # Update the existing rating
            existing_rating.rating = validated_data.get('rating', existing_rating.rating)
            existing_rating.review = validated_data.get('review', existing_rating.review)
            existing_rating.save()
            return existing_rating

        # If no previous rating exists, create a new one
        validated_data['user'] = user
        return super().create(validated_data)
