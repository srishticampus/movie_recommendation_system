#movies/views.py
"""
This module contains views and endpoints for the Movie Recommendation System.

It defines the API views for getting movies  and other
related features, using Django REST Framework.
"""
import requests
from django.conf import settings
from rest_framework import permissions,generics
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Rating, Movie
from .serializers import RatingSerializer
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
            return {}

    def get_tmdb_movies(self, page=1, genre_id=None, query=None):
        """
        Fetch a paginated list of movies from TMDb with optional genre filtering and search.
        """
        base_url = "https://api.themoviedb.org/3/"
        if query:
            url = f"{base_url}search/movie?api_key={settings.TMDB_API_KEY}&language=en-US&query={query}&page={page}"
        else:
            url = f"{base_url}discover/movie?api_key={settings.TMDB_API_KEY}&language=en-US&page={page}"
            if genre_id:
                url += f"&with_genres={genre_id}"

        try:
            response = requests.get(url, timeout=self.TIMEOUT)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"results": [], "total_pages": 1, "error": str(e)}

    def get(self, request):
        """Handle GET request to return movies with filtering, search, and pagination"""
        page = request.GET.get("page", 1)
        query = request.GET.get("query")  # Search query
        genre_name = request.GET.get("genre")  # Genre filter (name, not ID)
        
        try:
            page = int(page)
            if page < 1:
                return Response({"error": "Page number must be greater than 0"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Invalid page number"}, status=status.HTTP_400_BAD_REQUEST)

        genre_mapping = self.get_tmdb_genres()
        genre_id = next((id for id, name in genre_mapping.items() if genre_name and name.lower() == genre_name.lower()), None)

        movie_data = self.get_tmdb_movies(page=page, genre_id=genre_id, query=query)
        if "error" in movie_data:
            return Response({"error": movie_data["error"]}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        movies = movie_data.get("results", [])
        total_pages = movie_data.get("total_pages", 1)

        enriched_movies = [
            {
                "id": movie["id"],
                "title": movie.get("title", "N/A"),
                "release_date": movie.get("release_date", "N/A"),
                "rating": movie.get("vote_average", "N/A"),
                "plot": movie.get("overview", "N/A"),
                "genres": [genre_mapping.get(gid, "Unknown") for gid in movie.get("genre_ids", [])],
                "poster_url": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get("poster_path") else None,
                "language": movie.get("original_language", "N/A"),
                "popularity": movie.get("popularity", "N/A"),
                "vote_count": movie.get("vote_count", "N/A"),
            }
            for movie in movies
        ]

        return Response({
            "movies": enriched_movies,
            "total_pages": total_pages,
            "current_page": page
        }, status=status.HTTP_200_OK)


class MovieDetailView(APIView):
    """
    API to fetch detailed information about a single movie from TMDb.
    """
    TIMEOUT = 5
    permission_classes = [permissions.AllowAny]

    def get_movie_details(self, movie_id):
        """Fetch movie details from TMDb."""
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={settings.TMDB_API_KEY}&language=en-US"

        try:
            response = requests.get(url, timeout=self.TIMEOUT)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}

    def get(self, request, movie_id):
        """Handle GET request to fetch detailed movie information"""
        if not movie_id.isdigit():
            return Response({"error": "Invalid movie ID format"}, status=status.HTTP_400_BAD_REQUEST)

        movie_data = self.get_movie_details(movie_id)
        if "error" in movie_data:
            return Response({"error": movie_data["error"]}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        genres = [genre["name"] for genre in movie_data.get("genres", [])]
        movie_detail = {
            "id": movie_data["id"],
            "title": movie_data.get("title", "N/A"),
            "release_date": movie_data.get("release_date", "N/A"),
            "rating": movie_data.get("vote_average", "N/A"),
            "plot": movie_data.get("overview", "N/A"),
            "genres": genres,
            "poster_url": f"https://image.tmdb.org/t/p/w500{movie_data.get('poster_path')}" if movie_data.get("poster_path") else None,
            "language": movie_data.get("original_language", "N/A"),
            "popularity": movie_data.get("popularity", "N/A"),
            "vote_count": movie_data.get("vote_count", "N/A"),
            "runtime": movie_data.get("runtime", "N/A"),
            "tagline": movie_data.get("tagline", "N/A"),
            "budget": movie_data.get("budget", "N/A"),
            "revenue": movie_data.get("revenue", "N/A"),
        }

        return Response(movie_detail, status=status.HTTP_200_OK)

class AddMovieToWatchlistView(APIView):
    """
    API to add a movie to the Movie table before allowing users to rate it.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_movie_details(self, movie_id):
        """Fetch movie details from TMDb."""
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={settings.TMDB_API_KEY}&language=en-US"

        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}

    def post(self, request):
        """Handle POST request to add a movie to the database."""
        movie_id = request.data.get("movie_id")

        if not movie_id:
            return Response({"error": "Movie ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not str(movie_id).isdigit():
            return Response({"error": "Invalid movie ID format."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the movie already exists in the database
        if Movie.objects.filter(id=movie_id).exists():
            return Response({"message": "Movie already exists in watchlist."}, status=status.HTTP_200_OK)

        # Fetch movie details from TMDb
        movie_data = self.get_movie_details(movie_id)
        if "error" in movie_data:
            return Response({"error": movie_data["error"]}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Save movie details in the Movie model
        movie = Movie.objects.create(
            id=movie_data["id"],
            title=movie_data.get("title", "N/A"),
            release_date=movie_data.get("release_date", None),
            rating=movie_data.get("vote_average", 0.0),
            plot=movie_data.get("overview", ""),
            language=movie_data.get("original_language", ""),
            poster_url=f"https://image.tmdb.org/t/p/w500{movie_data.get('poster_path')}" if movie_data.get("poster_path") else None,
        )

        return Response({
            "message": "Movie added to watchlist successfully.",
            "movie": {
                "id": movie.id,
                "title": movie.title,
                "release_date": movie.release_date,
                "rating": movie.rating,
                "plot": movie.plot,
                "poster_url": movie.poster_url,
                "language": movie.language,
            }
        }, status=status.HTTP_201_CREATED)

class RatingView(generics.CreateAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    """
    API view to allow users to add, update, or delete their rating and review for a movie.
    """
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Limit to ratings made by the authenticated user.
        """
        return Rating.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Create a new rating or update an existing one if it exists.
        """
        user = self.request.user
        movie_id = self.request.data.get('movie')

        try:
            movie = Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist as exc:
            raise ValidationError({"movie": "Movie not found."}) from exc

        # Check if the user already rated this movie
        existing_rating = Rating.objects.filter(user=user, movie=movie).first()
        if existing_rating:
            raise ValidationError({"rating": "You have already rated this movie. Use update instead."})

        serializer.save(user=user, movie=movie)

    def perform_update(self, serializer):
        """
        Ensure users can only update their own ratings.
        """
        instance = self.get_object()
        if instance.user != self.request.user:
            raise ValidationError({"error": "You can only update your own rating."})

        serializer.save()

    def perform_destroy(self, instance):
        """
        Allow users to delete their rating.
        """
        if instance.user != self.request.user:
            raise ValidationError({"error": "You can only delete your own rating."})

        instance.delete()
