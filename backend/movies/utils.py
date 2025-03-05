#movies/utils.py
import os
import json
import requests
from django.conf import settings

CACHE_FILE = "omdb_cache.json"

# Load cache if exists, otherwise use empty array
if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, "r") as file:
        movie_cache = json.load(file)
else:
    movie_cache = []

def get_info(imdb_id, omdb_api_key):
    """
    Fetch movie details from OMDB API or return from cache if available.
    """
    global movie_cache
    # Check if the movie is in cache
    for movie in movie_cache:
        if movie.get("imdbID") == imdb_id:
            return movie
    
    # Fetch from OMDB API
    url = f"https://www.omdbapi.com/?i={imdb_id}&apikey={omdb_api_key}"
    response = requests.get(url)

    if response.status_code != 200:
        return None  # Return None if request failed

    movie_data = response.json()
    
    # Save to cache
    movie_cache.append(movie_data)
    
    # Save updated cache to file
    with open(CACHE_FILE, "w") as file:
        json.dump(movie_cache, file)
    
    return movie_data

def add_info_omdb(movies, omdb_api_key):
    """
    Enhance movie list with detailed OMDB info.
    """
    for movie in movies:
        imdb_id = movie.get("imdb_id")
        if not imdb_id:
            continue  # Skip movies without IMDb ID
        
        movie_info = get_info(imdb_id, omdb_api_key)
        
        if movie_info:
            movie["title"] = movie_info.get("Title", "N/A")
            movie["released"] = movie_info.get("Released", "N/A")
            movie["rating"] = movie_info.get("imdbRating", "N/A")
            movie["plot"] = movie_info.get("Plot", "N/A")
            movie["genre"] = movie_info.get("Genre", "N/A")
            movie["poster_url"] = movie_info.get("Poster", "N/A")
            movie["director"] = movie_info.get("Director", "N/A")
            movie["actors"] = movie_info.get("Actors", "N/A")
            movie["awards"] = movie_info.get("Awards", "N/A")
            movie["runtime"] = movie_info.get("Runtime", "N/A")
            movie["language"] = movie_info.get("Language", "N/A")
    
    return movies
