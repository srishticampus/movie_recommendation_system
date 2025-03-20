import { useEffect, useState } from "react";
import { getMovies } from "../../Services/apiService"; // Import the getMovies function
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import UserNavbar from "./Usernavbar";

function UserViewAllMovieList() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  // Filters
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Fetch all movies on page load
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const response = await getMovies();
    if (response.success) {
      setMovies(response.data.movies);
    } else {
      setError("Failed to load movies.");
    }
  };

  // Handle filtering
  const handleFilter = async () => {
    const response = await getMovies(1, "", selectedGenre); // Use getMovies with genre filter
    if (response.success) {
      let filteredMovies = response.data.movies;

      // Apply additional language filter if selected
      if (selectedLanguage) {
        filteredMovies = filteredMovies.filter((movie) => movie.language === selectedLanguage);
      }

      setMovies(filteredMovies);
    } else {
      setError("Failed to filter movies.");
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="container mt-5 pt-5">
        <div className="row mt-5">
          <div className="col">
            <h4>All Movies</h4>
          </div>
        </div>

        {/* Filter Section 
        <center className="mt-2">
          <span className="headingtwo">Filter</span>
          <select
            name="genre"
            className="moviedropdowntab"
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Genre</option>
            <option value="comedy">Comedy</option>
            <option value="action">Action</option>
            <option value="horror">Horror</option>
            <option value="thriller">Thriller</option>
            <option value="documentary">Documentary</option>
            <option value="fantasy">Fantasy</option>
            <option value="family">Family</option>
            <option value="adventure">Adventure</option>
            <option value="romance">Romance</option>
            <option value="crime">Crime</option>
            <option value="fiction">Fiction</option>
            <option value="science">Science</option>
            <option value="tv_movie">TV Movie</option>
            <option value="music">Music</option>
          </select>

          <select
            name="language"
            className="moviedropdowntab"
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="">Language</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="it">Italian</option>
          </select>

          <Button variant="danger" className="moviesearchtab" onClick={handleFilter}>
            Search
          </Button>
        </center>

         Movies List 
        <div className="row mt-4">
          {movies.length === 0 && !error && <p className="text-center">Loading movies...</p>}
          {error && <p className="text-center text-danger">{error}</p>}
          {movies.length === 0 && !error && <p className="text-center">No movies found.</p>}

          {movies.map((movie) => (
            <div key={movie.id} className="col-md-4 mb-4">
              <Card className="separatemoviecard">
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <div className="row">
                    <div className="col-7">Genres: {movie.genres.join(", ")}</div>
                    <div className="col-5">
                      Rating: <strong>{movie.rating}/10</strong>
                    </div>
                  </div>
                  <div className="mt-2">
                    Language: <strong>{movie.language}</strong>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>*/}
      </div>
    </div>
  );
}

export default UserViewAllMovieList;