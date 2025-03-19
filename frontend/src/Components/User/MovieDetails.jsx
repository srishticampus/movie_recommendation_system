import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Image,
  Modal,
  Form,
} from "react-bootstrap";
import { useParams } from "react-router";
import {
  getMovieDetails,
  addToWatchList,
  getUserRatings,
  submitRating,
} from "../../Services/apiService";
import UserNavbar from "./Usernavbar";

const MovieDetails = () => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [movie, setMovie] = useState(null);
  const { id } = useParams();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    getMovieDetails(id).then((data) => {
      setMovie(data.data);
    });
    getUserRatings(id).then((data) => {
      setUserRating(data?.data?.rating);
      setRating(data?.data?.rating || 0);
    });
  }, [id]);

  const handleWatchlistToggle = () => {
    addToWatchList(id).then((data) => {
      setIsInWatchlist(true);
    });
  };

  const handleShowRatingModal = () => {
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value));
  };

  const handleRatingSubmit = () => {
    // Implement API call to submit the rating here
    console.log("Submitting rating:", rating);

    submitRating(id, rating)
      .then((data) => {
        setUserRating(rating);
        // Optionally, update the movie details to reflect the new rating if needed
      })
      .catch((error) => {
        console.error("Error submitting rating:", error);
        // Handle error, maybe show an error message to the user
      });

    handleCloseRatingModal();
    // Optionally, refresh the movie details to show the new rating.
  };

  return (
    <>
      <UserNavbar />

      <div
        style={{
          backgroundColor: "black",
          color: "white",
          minHeight: "100vh",
          marginTop: "56px",
        }}
      >
        <style>
          {`
          .movie-banner {
            height: 400px;
            background-size: cover;
            background-position: center;
            filter: brightness(0.7); /* Darken the banner */
          }
          .movie-details-card {
            background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent black */
            border: none;
          }
          .watchlist-button {
            background-color: #dc3545; /* Bootstrap danger color */
            border: none;
          }
          .watchlist-button:hover {
            background-color: #c82333;
          }
        `}
        </style>
        {/* Banner (Optional) */}
        {movie && movie.poster_url && (
          <div
            className="movie-banner"
            style={{
              backgroundImage: `url(${movie.poster_url})`,
            }}
          ></div>
        )}

        <Container className="py-4">
          <Row>
            {/* Poster */}
            <Col md={4} className="mb-3">
              {movie ? (
                <Image src={movie.poster_url} alt={movie.title} fluid rounded />
              ) : (
                <div>Loading...</div>
              )}
            </Col>

            {/* Details */}
            <Col md={8}>
              {movie ? (
                <Card className="movie-details-card ">
                  <Card.Body>
                    <Card.Title as="h2" style={{ color: "white" }}>
                      {movie.title}
                    </Card.Title>
                    <Card.Text style={{ color: "white" }}>
                      <strong style={{ color: "white" }}>Release Date:</strong>{" "}
                      {movie.release_date}
                      <br />
                      <strong style={{ color: "white" }}>Rating:</strong>{" "}
                      {movie.rating}
                      <br />
                      <strong style={{ color: "white" }}>
                        Your Rating:
                      </strong>{" "}
                      {userRating || "Not Rated"}
                      <br />
                      <strong style={{ color: "white" }}>Genres:</strong>{" "}
                      {movie.genres.join(", ")}
                      <br />
                      <strong style={{ color: "white" }}>Runtime:</strong>{" "}
                      {movie.runtime} minutes
                      <br />
                      <strong style={{ color: "white" }}>Tagline:</strong>{" "}
                      {movie.tagline}
                    </Card.Text>
                    <Card.Text style={{ color: "white" }}>
                      {movie.plot}
                    </Card.Text>
                    <Button
                      variant="danger"
                      onClick={handleWatchlistToggle}
                      className="watchlist-button"
                      disabled={isInWatchlist}
                    >
                      {isInWatchlist
                        ? "Already in Watchlist"
                        : "Add to Watchlist"}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleShowRatingModal}
                      className="ms-2"
                    >
                      Add a Rating
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <div></div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <Modal show={showRatingModal} onHide={handleCloseRatingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rate this Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Your Rating (1-10)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="10"
                value={rating}
                onChange={handleRatingChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRatingModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRatingSubmit}>
            Submit Rating
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MovieDetails;
