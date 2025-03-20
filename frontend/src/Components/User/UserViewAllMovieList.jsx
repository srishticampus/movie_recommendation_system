import { useEffect, useState } from "react";
import { getMovies, addToWatchList } from "../../Services/apiService"; // Replace getRecommendations with getMovies
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Star from "../../assets/Star.png";
import UserNavbar from "./Usernavbar";
import Form from "react-bootstrap/Form";
import "../Admin/AdminviewMovie.css";

function UserViewAllMovieList() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Fetch movies based on filters
  const fetchMovies = async () => {
    try {
      const response = await getMovies(1, searchQuery, selectedGenre); // Use getMovies with filters
      if (response.success) {
        setMovies(response.data.movies);
        // Extract unique genres for the filter dropdown
        const genreList = new Set();
        response.data.movies.forEach((movie) => {
          movie.genres.forEach((genre) => genreList.add(genre));
        });
        setGenres([...genreList]);
      } else {
        setError("Failed to fetch movies.");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch movies.");
    }
  };

  // Handle search and filter
  const handleSearch = () => {
    fetchMovies();
  };

  // Handle adding a movie to the watchlist
  const handleAddToWatchlist = async (movieId) => {
    try {
      await addToWatchList(movieId);
      alert("Movie added to watchlist!");
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
      alert("Failed to add movie to watchlist.");
    }
  };

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      <UserNavbar />
      <div className="container mt-5 pt-5">
        <div className="row mt-5">
          <div className="col">
            <h4>All Movies</h4>
          </div>
          <div className="col">
            <Form className="searchbar1">
              <Form.Control
                type="search"
                placeholder="Search Here..."
                aria-label="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form>
          </div>
        </div>
        <center>
          <span className="headingone m-5">All Movies</span>
          <input
            className="mainsearchbar m-5"
            placeholder="Search here..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="headingtwo">Filter</span>
          <select
            name="genre"
            className="moviedropdowntab"
            onChange={(e) => setSelectedGenre(e.target.value)}
            value={selectedGenre}
          >
            <option value="">Genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <Button
            variant="danger"
            className="moviesearchtab"
            onClick={handleSearch}
          >
            Search
          </Button>
        </center>
        <div className="row">
          {movies.length === 0 && !error && (
            <p className="text-center">Loading movies...</p>
          )}
          {error && <p className="text-center text-danger">{error}</p>}
          {movies.length === 0 && !error && (
            <p className="text-center">No movies found.</p>
          )}
          {movies.map((movie) => (
            <div key={movie.id} className="col-md-4 mb-4">
              <Card className="separatemoviecard">
                <Card.Img
                  style={{ width: "100%" }}
                  variant="top"
                  src={movie.poster_url || Star} // Use fallback image if poster_url is missing
                />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <div className="row">
                    <div className="col-7">
                      Genres: {movie.genres.join(", ")}
                    </div>
                    <div className="col-5">
                      <img
                        src={Star}
                        alt="Star"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <small>{movie.rating}/10</small>
                    </div>
                  </div>
                  <div className="mt-2">
                    Language: <strong>{movie.language}</strong>
                  </div>
                  {/* Button to add to watchlist */}
                  <Button
                    variant="success"
                    className="addwatchlistbtn"
                    onClick={() => handleAddToWatchlist(movie.id)}
                  >
                    Add to Watchlist
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserViewAllMovieList;