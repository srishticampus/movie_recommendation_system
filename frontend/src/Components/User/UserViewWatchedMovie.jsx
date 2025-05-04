import { useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import UserNavbar from "./Usernavbar";
import Star from "../../assets/Star.png";
import { getWatchlist, removeFromWatchList } from "../../Services/apiService";
import { Link } from "react-router-dom";

function UserViewWatchedMovie() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for filters, pagination, and search
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for removal confirmation modal
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [movieToRemove, setMovieToRemove] = useState(null);

  // Fetch movies based on filters, pagination, and search
  const fetchWatchedMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getWatchlist(currentPage, selectedGenre, searchQuery);
      if (response.success) {
        if (response.data && response.data.results && Array.isArray(response.data.results.movies)) {
          setMovies(response.data.results.movies);
          setTotalPages(response.data.results.total_pages || 1);
        } else {
          setError("Invalid response format: movies array not found.");
        }
      } else {
        setError("Failed to load watched movies.");
      }
    } catch (error) {
      setError("An error occurred while fetching watched movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchedMovies();
  }, [currentPage, selectedGenre, searchQuery]);

  // Handle removal confirmation
  const handleRemoveClick = (movie) => {
    setMovieToRemove(movie);
    setShowRemoveModal(true);
  };

  // Handle actual removal
  const confirmRemove = async () => {
    if (!movieToRemove) return;
    
    try {
      const response = await removeFromWatchList(movieToRemove.id);
      if (response.success) {
        toast.success("Movie removed from watchlist!");
        // Refresh the list
        fetchWatchedMovies();
      } else {
        toast.error("Failed to remove movie from watchlist.");
      }
    } catch (error) {
      toast.error("An error occurred while removing movie.");
    } finally {
      setShowRemoveModal(false);
      setMovieToRemove(null);
    }
  };

  // Handle filter changes
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1);
  };

  // Handle search query changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="container mt-5 pt-5">
        <div className="row mt-5">
          <div className="col">
            <h4>Watched Movies</h4>
          </div>
          <div className="col">
            <Form className="searchbar1">
              <Form.Control
                type="search"
                placeholder="Search Here..."
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Form>
          </div>
        </div>

        <center className="mt-2">
          <span className="headingtwo">Filter</span>
          <select
            name="genre"
            className="moviedropdowntab"
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            <option value="">Genre</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Romance">Romance</option>
            <option value="Science Fiction">Science Fiction</option>
          </select>
          <Button variant="danger" className="moviesearchtab">
            Search
          </Button>
        </center>

        {/* Loading and Error Handling */}
        {loading && <p className="text-center mt-4">Loading watched movies...</p>}
        {error && <p className="text-center mt-4 text-danger">{error}</p>}

        <div className="row mt-4">
          {movies && movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="col-md-4 mb-4 position-relative">
                {/* Remove button (X in corner) */}
                <button
                  className="position-absolute top-0 end-0 m-2 bg-danger text-white rounded-circle border-0"
                  style={{ width: "30px", height: "30px", zIndex: 1 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveClick(movie);
                  }}
                  aria-label="Remove from watchlist"
                >
                  ×
                </button>
                
                <Card className="separatemoviecard">
                  <Link
                    to={`/user-view-movie-details/${movie.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Card.Img
                      variant="top"
                      src={movie.poster_url || Star}
                      alt={movie.title}
                    />
                    <Card.Body>
                      <Card.Title>{movie.title}</Card.Title>
                      <div className="row">
                        <div className="col-7">
                          {movie.genres ? movie.genres.join(", ") : "Unknown Genre"}
                        </div>
                        <div className="col-5">
                          <img src={Star} alt="Star" style={{ width: "20px", height: "20px" }} />
                          <small>{movie.rating || "N/A"}/10</small>
                        </div>
                      </div>
                      <div className="mt-2 text-secondary">
                        <small>{movie.release_date || "Unknown Release Date"}</small>
                      </div>
                    </Card.Body>
                  </Link>
                </Card>
              </div>
            ))
          ) : (
            !loading && <p className="text-center mt-4">No movies found in your watched list.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center m-4 align-items-center">
          <Button
            variant="danger"
            className="m-2"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="danger"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || !movies || movies.length === 0}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Removal Confirmation Modal */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove "{movieToRemove?.title}" from your watchlist?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemove}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserViewWatchedMovie;