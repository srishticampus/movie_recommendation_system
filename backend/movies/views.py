#movies/views.py
"""
This module contains views and endpoints for the Movie Recommendation System.

It defines the API views for getting movies  and other
related features, using Django REST Framework.
"""
import requests
from django.conf import settings
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .utils import add_info_omdb
# Create your views here.

class MovieListView(APIView):
    """
    API to fetch movies from TMDb with genre names, filtering, search, and pagination.
    """
    TIMEOUT = 5
    permission_classes = [permissions.AllowAny]

    def get_tmdb_genres(self):
        """Fetch genre list from TMDb"""
        url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={settings.TMDB_API_KEY}&language=en-US"
        try:
            response = requests.get(url, timeout=self.TIMEOUT)
            response.raise_for_status()
            genres = response.json().get("genres", [])
            return {genre["id"]: genre["name"] for genre in genres}  # Map genre ID to name
        except (requests.RequestException, requests.Timeout) as e:
            print(f"TMDb Genre API Error: {e}")
            return {}

    def get_tmdb_movies(self, page=1, genre_id=None, query=None):
        """
        Fetch a paginated list of movies from TMDb with optional genre filtering and search.
        """
        base_url = "https://api.themoviedb.org/3/"
        if query:
            # Search movies by title
            url = f"{base_url}search/movie?api_key={settings.TMDB_API_KEY}&language=en-US&query={query}&page={page}"
        else:
            # Get popular movies or filter by genre
            url = f"{base_url}discover/movie?api_key={settings.TMDB_API_KEY}&language=en-US&page={page}"
            if genre_id:
                url += f"&with_genres={genre_id}"

        try:
            response = requests.get(url, timeout=self.TIMEOUT)
            response.raise_for_status()
            return response.json()
        except (requests.RequestException, requests.Timeout) as e:
            print(f"TMDb API Error: {e}")
            return {"results": [], "total_pages": 1}

    def get(self, request):
        """Handle GET request to return movies with filtering, search, and pagination"""
        page = request.GET.get("page", 1)
        query = request.GET.get("query", None)  # Search query
        genre_name = request.GET.get("genre", None)  # Genre filter (name, not ID)
        
        try:
            page = int(page)
        except ValueError:
            page = 1

        genre_mapping = self.get_tmdb_genres()
        genre_id = None
        if genre_name:
            # Convert genre name to genre ID
            genre_id = next((id for id, name in genre_mapping.items() if name.lower() == genre_name.lower()), None)

        movie_data = self.get_tmdb_movies(page=page, genre_id=genre_id, query=query)
        movies = movie_data.get("results", [])
        total_pages = movie_data.get("total_pages", 1)

        enriched_movies = []
        for movie in movies:
            enriched_movies.append({
                "id": movie["id"],
                "title": movie.get("title", "N/A"),
                "release_date": movie.get("release_date", "N/A"),
                "rating": movie.get("vote_average", "N/A"),
                "plot": movie.get("overview", "N/A"),
                "genres": [genre_mapping.get(genre_id, "Unknown") for genre_id in movie.get("genre_ids", [])],
                "poster_url": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get("poster_path") else "N/A",
                "language": movie.get("original_language", "N/A"),
                "popularity": movie.get("popularity", "N/A"),
                "vote_count": movie.get("vote_count", "N/A"),
            })

        return Response({
            "movies": enriched_movies,
            "total_pages": total_pages,
            "current_page": page
        }, status=status.HTTP_200_OK)
