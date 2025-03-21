#movies/views.py
"""
This module contains views and endpoints for the Movie Recommendation System.

It defines the API views for getting movies and other related features, using Django REST Framework.
"""
import requests
from django.conf import settings
from rest_framework import permissions, generics
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from django.core.cache import cache
from .models import Rating, Movie, MovieWatchList
from .serializers import RatingSerializer, MovieSerializer
from .recommendation_service import RecommendationService


class MovieListView(APIView):
    TIMEOUT = 60
    permission_classes = [permissions.AllowAny]

    def get_tmdb_genres(self):
        """Fetch genre list from TMDb with caching."""
        cache_key = "tmdb_genre_list"
        genres = cache.get(cache_key)

        if not genres:
            url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={settings.TMDB_API_KEY}&language=en-US"
            try:
                response = requests.get(url, timeout=self.TIMEOUT)
                response.raise_for_status()
                genres = response.json().get("genres", [])
                cache.set(cache_key, genres, timeout=60)  # Cache for 10 minutes
            except (requests.RequestException, requests.Timeout):
                genres = []
        return {genre["id"]: genre["name"] for genre in genres}

    def get_tmdb_movies(self, page=1, genre_id=None, query=None):
        """
        Fetch a paginated list of movies from TMDb with caching.
        """
        cache_key = f"tmdb_movies_page_{page}_genre_{genre_id}_query_{query}"
        movies = cache.get(cache_key)

        if not movies:
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
                movies = response.json()
                cache.set(cache_key, movies, timeout=60)  # Cache for 10 minutes
            except requests.RequestException as e:
                movies = {"results": [], "total_pages": 1, "error": str(e)}
        return movies

    def get(self, request):
        """Handle GET request with caching."""
        page = request.GET.get("page", 1)
        query = request.GET.get("query")
        genre_name = request.GET.get("genre")

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
    TIMEOUT = 60
    permission_classes = [permissions.AllowAny]

    def get_movie_details(self, movie_id):
        """Fetch movie details from TMDb with caching."""
        cache_key = f"tmdb_movie_details_{movie_id}"
        movie_data = cache.get(cache_key)

        if not movie_data:
            url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={settings.TMDB_API_KEY}&language=en-US"
            try:
                response = requests.get(url, timeout=self.TIMEOUT)
                response.raise_for_status()
                movie_data = response.json()
                cache.set(cache_key, movie_data, timeout=60)  # Cache for 10 minutes
            except requests.RequestException as e:
                movie_data = {"error": str(e)}
        return movie_data

    def get(self, request, movie_id):
        """Handle GET request to fetch detailed movie information."""
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
    API to add a movie to a user's watchlist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_movie_details(self, movie_id):
        """Fetch movie details from TMDb with caching."""
        cache_key = f"tmdb_movie_details_{movie_id}"
        movie_data = cache.get(cache_key)

        if not movie_data:
            url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={settings.TMDB_API_KEY}&language=en-US"
            try:
                response = requests.get(url, timeout=60)
                response.raise_for_status()
                movie_data = response.json()
                cache.set(cache_key, movie_data, timeout=60)  # Cache for 10 minutes
            except requests.RequestException as e:
                movie_data = {"error": str(e)}
        return movie_data

    def post(self, request):
        """Handle POST request to add a movie to the user's watchlist."""
        movie_id = request.data.get("movie_id")

        if not movie_id:
            return Response({"error": "Movie ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not str(movie_id).isdigit():
            return Response({"error": "Invalid movie ID format."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the movie exists in the database
        movie, created = Movie.objects.get_or_create(
            tmdb_id=movie_id,
            defaults={
                "title": "N/A",  # Placeholder title, will be updated below
            }
        )

        # If the movie was just created, fetch its details from TMDb
        if created:
            movie_data = self.get_movie_details(movie_id)
            if "error" in movie_data:
                movie.delete()  # Delete the placeholder movie if fetching details fails
                return Response({"error": movie_data["error"]}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            movie.title = movie_data.get("title", "N/A")
            movie.save()

        # Check if the movie is already in the user's watchlist
        if MovieWatchList.objects.filter(user=request.user, movie=movie).exists():
            return Response({"message": "Movie already exists in your watchlist."}, status=status.HTTP_200_OK)

        # Add the movie to the user's watchlist
        MovieWatchList.objects.create(user=request.user, movie=movie)

        return Response({
            "message": "Movie added to your watchlist successfully.",
            "movie": {
                "tmdb_id": movie.tmdb_id,
                "title": movie.title,
            }
        }, status=status.HTTP_201_CREATED)

class WatchlistView(APIView):
    """
    API to fetch the movies in the current user's watchlist with pagination and genre filtering.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_tmdb_genres(self):
        """Fetch genre list from TMDb with caching."""
        cache_key = "tmdb_genre_list"
        genres = cache.get(cache_key)

        if not genres:
            url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={settings.TMDB_API_KEY}&language=en-US"
            try:
                response = requests.get(url, timeout=60)
                response.raise_for_status()
                genres = response.json().get("genres", [])
                cache.set(cache_key, genres, timeout=60)  # Cache for 10 minutes
            except (requests.RequestException, requests.Timeout):
                genres = []
        return {genre["id"]: genre["name"] for genre in genres}

    def get_movie_details(self, movie_id):
        """Fetch movie details from TMDb with caching."""
        cache_key = f"tmdb_movie_details_{movie_id}"
        movie_data = cache.get(cache_key)

        if not movie_data:
            url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={settings.TMDB_API_KEY}&language=en-US"
            try:
                response = requests.get(url, timeout=60)
                response.raise_for_status()
                movie_data = response.json()
                cache.set(cache_key, movie_data, timeout=60)  # Cache for 10 minutes
            except requests.RequestException as e:
                movie_data = {"error": str(e)}
        return movie_data

    def get(self, request):
        """
        Handle GET request to fetch the user's watchlist with pagination and genre filtering.
        """
        user = request.user
        cache_key = f"user_{user.id}_watchlist_movies"
        cached_movies = cache.get(cache_key)

        # Pagination
        paginator = PageNumberPagination()
        paginator.page_size = 20  # Number of movies per page

        # Genre filter
        selected_genre = request.query_params.get("genre", "")

        if cached_movies:
            # Apply genre filtering to cached movies
            if selected_genre:
                cached_movies = [
                    movie for movie in cached_movies
                    if selected_genre.lower() in [g.lower() for g in movie.get("genres", [])]
                ]
            # Paginate the cached movies
            paginated_movies = paginator.paginate_queryset(cached_movies, request)
            return paginator.get_paginated_response({
                "movies": paginated_movies,
                "total_movies": len(cached_movies),
            })

        # Fetch the movies in the user's watchlist
        watchlist_movies = MovieWatchList.objects.filter(user=user).values_list('movie__tmdb_id', flat=True)

        # Check if the watchlist is empty
        if not watchlist_movies:
            return Response(
                {"detail": "Your watchlist is empty. Add movies to your watchlist to see them here."},
                status=status.HTTP_204_NO_CONTENT
            )

        # Fetch TMDb genre mapping
        genre_mapping = self.get_tmdb_genres()

        # Enrich the movie data with additional details
        enriched_movies = []
        for movie_id in watchlist_movies:
            # Fetch additional details from TMDb
            movie_data = self.get_movie_details(movie_id)
            if "error" in movie_data:
                continue  # Skip this movie if details cannot be fetched

            # Extract genres from the movie details
            genres = []
            if "genres" in movie_data:
                # If the 'genres' field is present, use it
                genres = [genre["name"] for genre in movie_data.get("genres", [])]
            elif "genre_ids" in movie_data:
                # If 'genre_ids' is present, map them to genre names
                genres = [genre_mapping.get(gid, "Unknown") for gid in movie_data.get("genre_ids", [])]

            # Apply genre filtering
            if selected_genre and selected_genre.lower() not in [g.lower() for g in genres]:
                continue  # Skip this movie if it doesn't match the selected genre

            # Format the movie data
            enriched_movies.append({
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
            })

        # Cache the enriched movies for 10 minutes
        cache.set(cache_key, enriched_movies, timeout=60)

        # Paginate the enriched movies
        paginated_movies = paginator.paginate_queryset(enriched_movies, request)
        return paginator.get_paginated_response({
            "movies": paginated_movies,
            "total_movies": len(enriched_movies),
        })

class AllMoviesView(APIView):
    """
    API to fetch all movies stored in the Movie model with detailed information.
    """
    permission_classes = [permissions.AllowAny]

    def get_tmdb_genres(self):
        """Fetch genre list from TMDb with caching."""
        cache_key = "tmdb_genre_list"
        genres = cache.get(cache_key)

        if not genres:
            url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={settings.TMDB_API_KEY}&language=en-US"
            try:
                response = requests.get(url, timeout=60)
                response.raise_for_status()
                genres = response.json().get("genres", [])
                cache.set(cache_key, genres, timeout=60)  # Cache for 10 minutes
            except (requests.RequestException, requests.Timeout):
                genres = []
        return {genre["id"]: genre["name"] for genre in genres}

    def get(self, request):
        """
        Handle GET request to return all movies with detailed information.
        """
        cache_key = "all_movies_enriched"
        enriched_movies = cache.get(cache_key)

        if not enriched_movies:
            # Fetch all movies from the Movie model
            movies = Movie.objects.all()

            # Fetch TMDb genre mapping
            genre_mapping = self.get_tmdb_genres()

            # Enrich the movie data with additional details
            enriched_movies = []
            for movie in movies:
                # Fetch additional details from TMDb
                movie_data = self.get_movie_details(movie.tmdb_id)
                if "error" in movie_data:
                    continue  # Skip this movie if details cannot be fetched

                # Format the movie data
                enriched_movies.append({
                    "id": movie.tmdb_id,
                    "title": movie_data.get("title", "N/A"),
                    "release_date": movie_data.get("release_date", "N/A"),
                    "rating": movie_data.get("vote_average", "N/A"),
                    "plot": movie_data.get("overview", "N/A"),
                    "genres": [genre_mapping.get(gid, "Unknown") for gid in movie_data.get("genre_ids", [])],
                    "poster_url": f"https://image.tmdb.org/t/p/w500{movie_data.get('poster_path')}" if movie_data.get("poster_path") else None,
                    "language": movie_data.get("original_language", "N/A"),
                    "popularity": movie_data.get("popularity", "N/A"),
                    "vote_count": movie_data.get("vote_count", "N/A"),
                    "runtime": movie_data.get("runtime", "N/A"),
                    "tagline": movie_data.get("tagline", "N/A"),
                    "budget": movie_data.get("budget", "N/A"),
                    "revenue": movie_data.get("revenue", "N/A"),
                })

            # Cache the enriched movies for 10 minutes
            cache.set(cache_key, enriched_movies, timeout=60)

        return Response({
            "movies": enriched_movies,
            "total_movies": len(enriched_movies),
        }, status=status.HTTP_200_OK)

    def get_movie_details(self, movie_id):
        """Fetch movie details from TMDb with caching."""
        cache_key = f"tmdb_movie_details_{movie_id}"
        movie_data = cache.get(cache_key)

        if not movie_data:
            url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={settings.TMDB_API_KEY}&language=en-US"
            try:
                response = requests.get(url, timeout=60)
                response.raise_for_status()
                movie_data = response.json()
                cache.set(cache_key, movie_data, timeout=60)  # Cache for 10 minutes
            except requests.RequestException as e:
                movie_data = {"error": str(e)}
        return movie_data


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

    def get_object(self):
        """
        Fetch the rating object for update/delete actions.
        """
        queryset = self.get_queryset()
        obj = generics.get_object_or_404(queryset, pk=self.kwargs['pk'])
        return obj

    def perform_create(self, serializer):
        """
        Create a new rating or update an existing one if it exists.
        """
        user = self.request.user
        movie_tmdb_id = self.request.data.get('movie')  # Use tmdb_id instead of id

        try:
            # Look up the movie by tmdb_id
            movie = Movie.objects.get(tmdb_id=movie_tmdb_id)
        except Movie.DoesNotExist as exc:
            raise ValidationError({"movie": "Movie not found in the database."}) from exc

        # Check if the user already rated this movie
        existing_rating = Rating.objects.filter(user=user, movie=movie).first()
        if existing_rating:
            raise ValidationError({"rating": "You have already rated this movie. Use update instead."})

        # Save the new rating
        serializer.save(user=user, movie=movie)

        # Recalculate and update the average rating for the movie
        self.update_movie_average_rating(movie)

    def perform_update(self, serializer):
        """
        Ensure users can only update their own ratings.
        """
        instance = self.get_object()
        if instance.user != self.request.user:
            raise ValidationError({"error": "You can only update your own rating."})

        # Save the updated rating
        serializer.save()

        # Recalculate and update the average rating for the movie
        self.update_movie_average_rating(instance.movie)

    def perform_destroy(self, instance):
        """
        Allow users to delete their rating.
        """
        if instance.user != self.request.user:
            raise ValidationError({"error": "You can only delete your own rating."})

        movie = instance.movie
        instance.delete()

        # Recalculate and update the average rating for the movie
        self.update_movie_average_rating(movie)

    def update_movie_average_rating(self, movie):
        """
        Recalculate and update the average rating for the movie.
        """
        avg_rating = movie.average_user_rating()
        movie.average_rating = avg_rating
        movie.save()


class UserRatingForMovieView(generics.RetrieveAPIView):
    """
    API to fetch the current user's rating for a specific movie.
    """
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Fetch the current user's rating for the specified movie.
        """
        user = self.request.user
        movie_tmdb_id = self.kwargs.get('movie_tmdb_id')

        try:
            movie = Movie.objects.get(tmdb_id=movie_tmdb_id)
        except Movie.DoesNotExist as exc:
            raise NotFound("Movie not found in the database.") from exc

        # Fetch the user's rating for the movie
        rating = Rating.objects.filter(user=user, movie=movie).first()
        if not rating:
            raise NotFound("You have not rated this movie yet.")

        return rating


class MovieRatingsView(generics.ListAPIView):
    """
    API to fetch all ratings for a specific movie.
    """
    serializer_class = RatingSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to view ratings

    def get_queryset(self):
        """
        Return all ratings for the specified movie.
        """
        movie_tmdb_id = self.kwargs.get('movie_tmdb_id')

        try:
            # Fetch the movie by tmdb_id
            movie = Movie.objects.get(tmdb_id=movie_tmdb_id)
        except Movie.DoesNotExist as exc:
            raise NotFound("Movie not found in the database.") from exc

        # Fetch all ratings for the movie
        return Rating.objects.filter(movie=movie)


class MovieRecommendationView(APIView):
    """
    API to fetch recommended movies based on the user's watchlist with pagination and genre filtering.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_tmdb_genres(self):
        """Fetch genre list from TMDb with caching."""
        cache_key = "tmdb_genre_list"
        genres = cache.get(cache_key)

        if not genres:
            url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={settings.TMDB_API_KEY}&language=en-US"
            try:
                response = requests.get(url, timeout=15)
                response.raise_for_status()
                genres = response.json().get("genres", [])
                cache.set(cache_key, genres, timeout=60)  # Cache for 10 minutes
            except (requests.RequestException, requests.Timeout):
                genres = []
        return {genre["id"]: genre["name"] for genre in genres}

    def get(self, request):
        """
        Fetch recommended movies for the current user with caching.
        """
        user = request.user
        cache_key = f"user_{user.id}_recommendations"
        recommended_movies = cache.get(cache_key)

        if not recommended_movies:
            # Fetch movies in the user's watchlist
            watchlist_movies = MovieWatchList.objects.filter(user=user).values_list('movie__tmdb_id', flat=True)

            # Get recommendations
            recommendation_service = RecommendationService()
            recommended_movies = recommendation_service.recommend_movies(watchlist_movies, n=100)

            # Cache the recommendations for 10 minutes
            cache.set(cache_key, recommended_movies, timeout=60)

        # Apply genre filtering if a genre is provided
        genre_name = request.GET.get("genre")
        genre_mapping = self.get_tmdb_genres()
        genre_id = next((id for id, name in genre_mapping.items() if genre_name and name.lower() == genre_name.lower()), None)

        if genre_id:
            # Filter recommended movies by genre
            recommended_movies = [
                movie for movie in recommended_movies
                if genre_id in movie.get("genre_ids", [])
            ]

        # Paginate the results
        paginator = PageNumberPagination()
        paginator.page_size = 20
        paginated_movies = paginator.paginate_queryset(recommended_movies, request)

        # Format the response
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
            for movie in paginated_movies
        ]

        return paginator.get_paginated_response({
            "movies": enriched_movies,
            "total_pages": paginator.page.paginator.num_pages,
            "current_page": paginator.page.number,
        })


class TotalMoviesCountView(APIView):
    """
    API to get the total count of movies in the database.
    """
    permission_classes = [permissions.IsAuthenticated]  # Allow anyone to access this endpoint

    def get(self, request):
        """
        Handle GET request to return the total count of movies.
        """
        total_movies = Movie.objects.count()
        return Response({"total_movies": total_movies}, status=status.HTTP_200_OK)
