#movies/serializers.py
"""
This module contains serializers for the movies app.
"""
from rest_framework import serializers
from .models import Movie, Rating, MovieWatchList

class MovieSerializer(serializers.ModelSerializer):
    average_user_rating = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['id', 'tmdb_id', 'title', 'average_user_rating', 'average_rating']

    def get_average_user_rating(self, obj):
        return obj.average_user_rating()

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    movie_title = serializers.ReadOnlyField(source='movie.title')
    movie = serializers.IntegerField(write_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'user', 'movie', 'movie_title', 'rating', 'review', 'created_at', 'updated_at']
        read_only_fields = ['user', 'movie_title']

    def validate_movie(self, value):
        try:
            movie = Movie.objects.get(tmdb_id=value)
        except Movie.DoesNotExist as exc:
            raise serializers.ValidationError("Movie not found in the database.") from exc
        return movie

    def create(self, validated_data):
        user = self.context['request'].user
        movie = validated_data['movie']
        existing_rating = Rating.objects.filter(user=user, movie=movie).first()
        
        if existing_rating:
            existing_rating.rating = validated_data.get('rating', existing_rating.rating)
            existing_rating.review = validated_data.get('review', existing_rating.review)
            existing_rating.save()
            return existing_rating

        validated_data['user'] = user
        return super().create(validated_data)

class MovieWatchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieWatchList
        fields = ['id', 'user', 'movie', 'added_at']
        read_only_fields = ['user', 'added_at']