import requests
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from django.conf import settings

class RecommendationService:
    def __init__(self):
        self.tmdb_api_key = settings.TMDB_API_KEY
        self.base_url = "https://api.themoviedb.org/3"
        self.genre_list = self.get_genre_list()  # Fetch all possible genres from TMDb
        self.keyword_list = self.get_keyword_list()  # Fetch all possible keywords from TMDb (optional)

    def get_genre_list(self):
        """
        Fetch the list of all genres from TMDb.
        """
        url = f"{self.base_url}/genre/movie/list?api_key={self.tmdb_api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            genres = response.json().get("genres", [])
            return [genre["id"] for genre in genres]
        return []

    def get_keyword_list(self):
        """
        Fetch the list of all keywords from TMDb (optional).
        """
        # TMDb does not provide a direct endpoint for all keywords, so this is optional.
        # You can manually define a list of common keywords or skip this.
        return []

    def get_movie_details(self, movie_id):
        """
        Fetch movie details from TMDb API.
        """
        url = f"{self.base_url}/movie/{movie_id}?api_key={self.tmdb_api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        return None

    def get_similar_movies(self, movie_id, n=10):
        """
        Fetch similar movies from TMDb API.
        """
        url = f"{self.base_url}/movie/{movie_id}/similar?api_key={self.tmdb_api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            similar_movies = response.json().get("results", [])
            return similar_movies[:n]
        return []

    def get_movie_embeddings(self, movie_ids):
        """
        Fetch movie embeddings (e.g., genres, keywords) for similarity calculation.
        Ensure all embeddings have the same length.
        """
        embeddings = []
        for movie_id in movie_ids:
            movie_details = self.get_movie_details(movie_id)
            if movie_details:
                # Use one-hot encoding for genres
                genre_ids = [genre["id"] for genre in movie_details.get("genres", [])]
                genre_embedding = [1 if genre_id in genre_ids else 0 for genre_id in self.genre_list]

                # Use one-hot encoding for keywords (optional)
                keywords = self.get_movie_keywords(movie_id)
                keyword_embedding = [1 if keyword in keywords else 0 for keyword in self.keyword_list]

                # Combine genre and keyword embeddings
                embedding = genre_embedding + keyword_embedding
                embeddings.append(embedding)
        return embeddings

    def get_movie_keywords(self, movie_id):
        """
        Fetch keywords for a movie from TMDb API.
        """
        url = f"{self.base_url}/movie/{movie_id}/keywords?api_key={self.tmdb_api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            keywords = response.json().get("keywords", [])
            return [keyword["id"] for keyword in keywords]
        return []

    def recommend_movies(self, watchlist_movie_ids, n=10):
        """
        Recommend movies based on the user's watchlist.
        """
        if not watchlist_movie_ids:
            return []

        # Get embeddings for watchlist movies
        watchlist_embeddings = self.get_movie_embeddings(watchlist_movie_ids)

        # Calculate average embedding for the watchlist
        avg_embedding = np.mean(watchlist_embeddings, axis=0)

        # Fetch similar movies for each movie in the watchlist
        recommended_movies = []
        for movie_id in watchlist_movie_ids:
            similar_movies = self.get_similar_movies(movie_id, n)
            recommended_movies.extend(similar_movies)

        # Remove duplicates and movies already in the watchlist
        recommended_movies = [movie for movie in recommended_movies if movie["id"] not in watchlist_movie_ids]
        recommended_movies = list({movie["id"]: movie for movie in recommended_movies}.values())

        # Sort by similarity score (using cosine similarity)
        recommended_embeddings = self.get_movie_embeddings([movie["id"] for movie in recommended_movies])
        similarity_scores = cosine_similarity([avg_embedding], recommended_embeddings)[0]
        sorted_indices = np.argsort(similarity_scores)[::-1]

        # Return top N recommendations
        return [recommended_movies[i] for i in sorted_indices[:n]]