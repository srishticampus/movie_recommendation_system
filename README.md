# Installation Guide for Movie Recommendation System (Dockerized)

This guide outlines the steps to install and run the Movie Recommendation System application using Docker on both Windows and Linux.

---

## Prerequisites

### 1. Install Docker

#### Windows

1. Download Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop/).
2. Run the installer and follow the installation steps.
3. After installation, start Docker Desktop and ensure it's running.
4. Verify the installation:
   ```bash
   docker --version
   ```

#### Linux

1. Update your package index:
   ```bash
   sudo apt update
   ```
2. Install Docker:
   ```bash
   sudo apt install docker.io
   ```
3. Enable Docker to start on boot:
   ```bash
   sudo systemctl enable docker
   ```
4. Start the Docker service:
   ```bash
   sudo systemctl start docker
   ```
5. Verify the installation:
   ```bash
   docker --version
   ```

---

### 2. Install Docker Compose

#### Windows

Docker Compose is included with Docker Desktop for Windows. No additional installation is required.

#### Linux

1. Download Docker Compose:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/2.1.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   ```
2. Apply executable permissions:
   ```bash
   sudo chmod +x /usr/local/bin/docker-compose
   ```
3. Verify the installation:
   ```bash
   docker-compose --version
   ```

---

### 3. Install Git

#### Windows

1. Download Git from [Git's official website](https://git-scm.com/).
2. Run the installer and follow the setup instructions.
3. Verify the installation:
   ```bash
   git --version
   ```

#### Linux

1. Install Git:
   ```bash
   sudo apt install git
   ```
2. Verify the installation:
   ```bash
   git --version
   ```

---

## Steps to Install and Run

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movie_recommendation_system
```

### 2. Build and Start Docker Containers

Run the following command to build and start the application using Docker Compose:

```bash
docker compose up --build
```

This command will:

- Build the Docker images for the application and its dependencies.
- Start the containers.

### 3. Access the Application

- **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Backend**: Open [http://localhost:8000](http://localhost:8000) for API access.

### 4. Create Superuser (Optional)

To access the Django admin panel, create a superuser:

```bash
docker compose exec backend python manage.py createsuperuser
```

Follow the prompts to set up a username, email, and password.

---

## Common Docker Commands

### Start Containers

```bash
docker compose up
```

### Stop Containers

```bash
docker compose down
```

### Rebuild Containers

```bash
docker compose up --build
```

### View Logs

```bash
docker compose logs
```

### Access a Running Container

```bash
docker exec -it <container_name> bash
```

Replace `<container_name>` with the name of the container you want to access.

---

## Debugging Common Issues

1. **Port Already in Use**:

   - If a port conflict occurs, update the `docker-compose.yml` file to use different ports.

2. **Database Issues**:

   - If migrations fail or the database becomes corrupted, reset the database:
     ```bash
     docker compose down -v
     docker compose up --build
     ```

3. **Container Not Starting**:

   - Check the logs for errors:
     ```bash
     docker compose logs
     ```

---

By following this guide, you can easily set up and run the Movie Recommendation System application using Docker on both Windows and Linux.

API Documentation

Authentication
This API uses JWT (JSON Web Tokens) for authentication. After logging in, you will receive an access token and a refresh token. Include the access token in the Authorization header for protected endpoints.

Example Header:
Authorization: Bearer <access_token>

Endpoints
1. Register a New User
URL: /api/register/

Method: POST

Description: Register a new user.

Request Body:
{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "Test User",
  "user_type": "user"
}

Response (Success - 201 Created):
{
  "message": "User registered successfully.",
  "data": {
    "id": 1,
    "email": "test@example.com",
    "full_name": "Test User",
    "user_type": "user",
    "is_active": true,
    "is_staff": false
  }
}

Response (Error - 400 Bad Request):
{
  "error": "Invalid data.",
  "details": {
    "email": ["This field is required."],
    "password": ["This field is required."]
  }
}

2. Login
URL: /api/login/

Method: POST

Description: Authenticate a user and return JWT tokens.

Request Body:
{
  "email": "test@example.com",
  "password": "password123"
}
Response (Success - 200 OK):

{
  "message": "Login successful.",
  "data": {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "test@example.com",
    "full_name": "Test User",
    "user_type": "user"
  }
}

Response (Error - 400 Bad Request):

{
  "error": "Invalid email or password."
}

3. Refresh Token
URL: /api/token/refresh/

Method: POST

Description: Refresh an expired access token using the refresh token.

Request Body:

{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (Success - 200 OK):

{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (Success - 200 OK):

{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (Error - 401 Unauthorized):

{
  "error": "Token is invalid or expired."
}
MovieList Api with Pagination, Genre Names, and Search

1️⃣ Get a List of Movies
Endpoint:

http
GET movies//movies/
Description:
Fetches a list of movies with optional filtering by genre, search query, and pagination.

Optional Query Parameters:
Parameter	Type	Description
page	int	Page number (default: 1)
query	string	Search movies by title
genre	string	Filter movies by genre name
cURL Example
Fetch the first page of movies:

curl -X GET "http://yourdomain.com/movies/movies/" -H "Accept: application/json"
Fetch the second page of movies:


curl -X GET "http://yourdomain.com/movies/movies/?page=2" -H "Accept: application/json"
Search for a movie (Inception):


curl -X GET "http://yourdomain.com/movies/movies/?query=Inception" -H "Accept: application/json"
Filter movies by genre (Action):

sh
Copy
Edit
curl -X GET "http://yourdomain.com/movies/movies/?genre=Action" -H "Accept: application/json"
Response (JSON)
json
{
  "movies": [
    {
      "id": 27205,
      "title": "Inception",
      "release_date": "2010-07-15",
      "rating": 8.8,
      "plot": "A thief who enters the dreams of others to steal secrets...",
      "genres": ["Action", "Sci-Fi"],
      "poster_url": "https://image.tmdb.org/t/p/w500/path_to_poster.jpg",
      "language": "en",
      "popularity": 97.5,
      "vote_count": 21000
    }
  ],
  "total_pages": 10,
  "current_page": 1
}
2️⃣ Get Movie Details
Endpoint:

http
GET movies/movies/{movie_id}/
Description:
Fetches detailed information about a specific movie by its ID.

Path Parameter:
Parameter	Type	Description
movie_id	int	The ID of the movie
cURL Example
Fetch details of a movie with ID 27205 (Inception):

curl -X GET "http://yourdomain.com/movies/movies/27205/" -H "Accept: application/json"
Response (JSON)
json
{
  "id": 27205,
  "title": "Inception",
  "release_date": "2010-07-15",
  "rating": 8.8,
  "plot": "A thief who enters the dreams of others to steal secrets...",
  "genres": ["Action", "Sci-Fi"],
  "poster_url": "https://image.tmdb.org/t/p/w500/path_to_poster.jpg",
  "language": "en",
  "popularity": 97.5,
  "vote_count": 21000,
  "runtime": 148,
  "tagline": "Your mind is the scene of the crime.",
  "budget": 160000000,
  "revenue": 829895144
}
3️⃣ Error Responses
The API provides proper error handling:

HTTP  Status Code	Meaning	Example Response
400	  Bad Request	{ "error": "Invalid page number" }
404	  Not Found	{ "error": "Movie not found" }
503	  Service Unavailable	{ "error": "Unable to fetch data from TMDb" }
Example: Fetch details for a non-existent movie (99999999):

curl -X GET "http://yourdomain.com/movies/movies/99999999/" -H "Accept: application/json"
Response:
json
{
  "error": "Movie not found"
}
🌟 Summary
Feature	          Endpoint	              Method	    Params
Get Movie List	  movies//movies/	        GET	        page, query, genre
Get Movie Details	movies//movies/{id}/	GET	        movie_id