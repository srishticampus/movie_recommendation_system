import React, { useState, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import Star from "../../assets/default-movie-1.jpg";
import UserNavbar from "./Usernavbar";
import "../Admin/AdminviewMovie.css";
import { getRecommendations, addToWatchList } from "../../Services/apiService";
import { Link } from "react-router-dom"; // Import Link

function UserRecomendedmovie() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async () => {
    console.log("Fetching movies for page:", page);
    try {
      const response = await getRecommendations(page, searchQuery, selectedGenre);
      const data = response.data;
      console.log("API response:", data);

      if (data && data.results && data.results.movies) {
        setMovies(data.results.movies);
        setTotalPages(data.results.total_pages);

        // Extract unique genres for the filter dropdown
        let genreList = new Set();
        for (let i = 0; i < data.results.movies.length; i++) {
          if (data.results.movies[i].genres && data.results.movies[i].genres.length > 0) {
            genreList.add(data.results.movies[i].genres[0]);
          }
        }
        setGenres([...genreList]);
      } else {
        console.error("Invalid response structure:", data);
        setError("Failed to fetch movies. Invalid response structure.");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch movies.");
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset to the first page when applying new filters
    fetchMovies();
  };

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

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  // Fetch movies when page, searchQuery, or selectedGenre changes
  useEffect(() => {
    fetchMovies();
  }, [page, searchQuery, selectedGenre]);

  return (
    <div>
      <UserNavbar />
      <div className="container mt-5 pt-5">
        <div className="row mt-5">
          <div className="col">
            <h4>Recommended Movies</h4>
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
          {error && <p className="text-center text-danger">{error}</p>}
          {movies.length === 0 && !error && (
            <p className="text-center">No movies found.</p>
          )}
          {movies.map((movie) => (
            <div key={movie.id} className="col-md-4 mb-4">
              <Card className="separatemoviecard">
                {/* Wrap card content in a Link */}
                <Link
                  to={`/user-view-movie-details/${movie.id}`} // Pass movieId as a URL parameter
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card.Img
                    style={{ width: "100%" }}
                    variant="top"
                    src={movie.poster_url || Star}
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
        <div className="d-flex justify-content-center m-4 align-items-center">
          <Button
            variant="danger"
            className="m-2"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="danger"
            onClick={handleNextPage}
            disabled={page === totalPages || movies.length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserRecomendedmovie;