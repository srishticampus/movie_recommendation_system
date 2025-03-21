import { useEffect, useState } from "react";
import { getMovies, addToWatchList } from "../../Services/apiService";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Star from "../../assets/default-movie-1.jpg";
import UserNavbar from "./Usernavbar";
import Form from "react-bootstrap/Form";
import "../Admin/AdminviewMovie.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function UserViewAllMovieList() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Track the current page

  // Fetch movies based on filters
  const fetchMovies = async () => {
    try {
      const response = await getMovies(page, searchQuery, selectedGenre); // Include page parameter
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
    if (!searchQuery && !selectedGenre) {
      // If both searchQuery and selectedGenre are empty, fetch the default page
      setPage(1);
      fetchMovies();
    } else {
      // Otherwise, fetch movies with the current filters
      setPage(1); // Reset to the first page when applying new filters
      fetchMovies();
    }
  };

  // Handle adding a movie to the watchlist
  const handleAddToWatchlist = async (movieId, event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the card
    try {
      await addToWatchList(movieId);
      alert("Movie added to watchlist!");
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
      alert("Failed to add movie to watchlist.");
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1); // Increment page
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1)); // Decrement page, but don't go below 1
  };

  // Fetch movies on component mount or when page, searchQuery, or selectedGenre changes
  useEffect(() => {
    fetchMovies();
  }, [page, searchQuery, selectedGenre]);

  return (
    <div>
      <UserNavbar />
      <div className="container mt-5 pt-5">
        <div className="row mt-5">
          <div className="col">
            <h4>All Movies</h4>
          </div>
          <div className="col">
            {/* <Form className="searchbar1">
              <Form.Control
                type="search"
                placeholder="Search Here..."
                aria-label="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form> */}
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
              {/* Card with Link for navigation */}
              <Card className="separatemoviecard">
                <Link
                  to={`/user-view-movie-details/${movie.id}`} // Pass movieId as a URL parameter
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card.Img
                    style={{ width: "100%" }}
                    variant="top"
                    src={movie.poster_url || Star} // Use fallback image if poster_url is missing
                    className="p-2"
                  />
                  <Card.Body className="p-2 text-center">
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
                  </Card.Body>
                </Link>
                {/* Button to add to watchlist */}
                <div className="text-center my-2">
                  <Button
                    variant="danger"
                    onClick={(e) => handleAddToWatchlist(movie.id, e)} // Pass event to stop propagation
                  >
                    Add to Watchlist
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="d-flex justify-content-center m-4 align-items-center">
          <Button
            variant="danger"
            className="m-2"
            onClick={handlePreviousPage}
            disabled={page === 1} // Disable "Previous" button on the first page
          >
            Previous
          </Button>
          <Button
            variant="danger"
            onClick={handleNextPage}
            disabled={movies.length === 0} // Disable "Next" button if no movies are returned
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserViewAllMovieList;