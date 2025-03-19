#movies/admin.py
from django.contrib import admin
from .models import Movie, Rating,MovieWatchList
# Register your models here.


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Movie model.
    """
    list_display = ('id', 'tmdb_id', 'title', 'average_user_rating', 'average_rating')  # Fields to display in the list view
    search_fields = ('title', 'tmdb_id')  # Fields to search by
    list_filter = ('title',)  # Fields to filter by
    readonly_fields = ('average_user_rating', 'average_rating')  # Make these fields read-only

    def average_user_rating(self, obj):
        """
        Display the average user rating for the movie, including the TMDb rating.
        """
        return obj.average_user_rating()
    average_user_rating.short_description = 'Combined Average Rating'  # Custom column header

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Rating model.
    """
    list_display = ('id', 'user', 'movie', 'rating', 'review', 'created_at', 'updated_at')  # Fields to display in the list view
    search_fields = ('user__email', 'movie__title')  # Fields to search by
    list_filter = ('rating', 'created_at', 'updated_at')  # Fields to filter by
    readonly_fields = ('created_at', 'updated_at')  # Make timestamps read-only

@admin.register(MovieWatchList)
class MovieWatchListAdmin(admin.ModelAdmin):
    """
    Admin configuration for the MovieWatchList model.
    """
    list_display = ('id', 'user', 'movie', 'added_at')  # Fields to display in the list view
    search_fields = ('user__email', 'movie__title')  # Fields to search by
    list_filter = ('added_at',)  # Fields to filter by
    readonly_fields = ('added_at',)  # Make added_at read-only