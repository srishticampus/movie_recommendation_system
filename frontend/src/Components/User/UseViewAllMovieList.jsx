import { useEffect, useState } from "react";
import { movieList, getMoviesByGenre } from "../../Services/apiService"; // Import API functions
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import UserNavbar from "./Usernavbar";

function UseViewAllMovieList() {
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
    const response = await movieList();
    if (response.success) {
      setMovies(response.data.movies);
    } else {
      setError("Failed to load movies.");
    }
  };

  // Handle filtering
  const handleFilter = async () => {
    let filteredMovies = [];

    if (selectedGenre) {
      const response = await getMoviesByGenre(selectedGenre);
      console.log(response,"kk");
      
      if (response.success) {
        filteredMovies = response.data.movies;
      }
    } else {
      const response = await movieList();
      if (response.success) {
        filteredMovies = response.data.movies;
      }
    }

    if (selectedLanguage) {
      filteredMovies = filteredMovies.filter((movie) => movie.language === selectedLanguage);
    }

    setMovies(filteredMovies);
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

        {/* Filter Section */}
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
            <option value="drama">Horror</option>
            <option value="drama">Thriller</option>
            <option value="drama">Documentary</option>
            <option value="drama">Fantasy</option>
            <option value="drama">Family</option>
            <option value="drama">Adventure</option>
            <option value="drama">Romance</option>
            <option value="drama">Crime</option>
            <option value="drama">Fiction</option>
            <option value="drama">Science </option>
            <option value="drama">TV Movie </option>
            <option value="drama">Music </option>
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
            <option value="it">Italic</option>
            <option value="es">Spanish</option>

          </select>

          <Button variant="danger" className="moviesearchtab" onClick={handleFilter}>
            Search
          </Button>
        </center>

        {/* Movies List */}
        <div className="row mt-4">
          { <p className="text-center">Loading movies...</p>}
          {error && <p className="text-center text-danger">{error}</p>}
          {movies.length === 0 && <p className="text-center">No movies found.</p>}

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
        </div>
      </div>
    </div>
  );
}

export default UseViewAllMovieList;
