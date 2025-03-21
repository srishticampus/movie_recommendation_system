import { useEffect, useState } from "react";
import { CardGroup, Row, Col, Modal, Button, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import a from "../../assets/Aboutus_Background.png";
import "../Admin/Moviedetails.css";
import star from "../../assets/Star.png";
import { FaRegBookmark } from "react-icons/fa6";
import { IoMdPlay } from "react-icons/io";
import UserNavbar from "./Usernavbar";
import { toast } from "react-toastify";
import {
  getMovieDetails,
  addRating,
  updateRating,
  getMyRatingForMovie,
  getRatingsForMovie,
  addToWatchList,
  getWatchlist,
} from "../../Services/apiService";
import { useParams } from "react-router-dom";

function UserViewMovieDetails() {
  const [movie, setMovie] = useState(null); // Initialize as null
  const [ratings, setRatings] = useState([]); // All ratings for the movie
  const [myRating, setMyRating] = useState(null); // User's rating for the movie
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false); // Track if movie is in watchlist
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false); // Loading state for watchlist

  const { movieId } = useParams(); // Get movieId from URL params

  // Fetch movie details, ratings, and watchlist status
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movie details
        const movieResponse = await getMovieDetails(movieId);
        if (movieResponse.success) {
          setMovie(movieResponse.data); // Set movie data
        } else {
          toast.error("Failed to fetch movie details.");
          setMovie(null); // Set movie to null if not found
        }

        // Fetch ratings for the movie
        const ratingsResponse = await getRatingsForMovie(movieId);
        if (ratingsResponse.success) {
          setRatings(ratingsResponse.data); // Set all ratings
        } else {
          toast.error("Failed to fetch ratings.");
          setRatings([]); // Set empty array if ratings not found
        }

        // Fetch user's rating for the movie
        const myRatingResponse = await getMyRatingForMovie(movieId);
        if (myRatingResponse.success) {
          setMyRating(myRatingResponse.data); // Set user's rating
          setRating(myRatingResponse.data.rating);
          setReview(myRatingResponse.data.review);
        } else {
          setMyRating(null); // Set user rating to null if not found
        }

        // Fetch user's watchlist and check if the movie is in it
        const watchlistResponse = await getWatchlist();
        if (watchlistResponse.success) {
          const isMovieInWatchlist = watchlistResponse.data.results.movies.some(
            (movie) => movie.id === parseInt(movieId)
          );
          setIsInWatchlist(isMovieInWatchlist); // Update watchlist status
        } else {
          toast.error("Failed to fetch watchlist.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, [movieId]);

  // Handle adding movie to watchlist
  const handleAddToWatchlist = async (movieId, event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the card
    try {
      console.log("Adding movie to watchlist with ID:", movieId);
      const response = await addToWatchList(movieId);
      if (response.success) {
        alert("Movie added to watchlist!");
      } else {
        console.error("Failed to add movie to watchlist:", response.errors);
        alert("Failed to add movie to watchlist.");
      }
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
      alert("An error occurred while adding to watchlist.");
    }
  };
  
  // Handle rating modal open
  const handleRatingModalOpen = () => {
    setShowRatingModal(true);
  };

  // Handle rating modal close
  const handleRatingModalClose = () => {
    setShowRatingModal(false);
    setIsEditing(false);
    setRating(0);
    setReview("");
  };

  // Handle rating submission
  const handleRatingSubmit = async () => {
    if (!rating || !review) {
      toast.error("Please provide a rating and review.");
      return;
    }
  
    try {
      let response;
      if (isEditing) {
        // Update existing rating
        console.log("Updating rating with payload:", {
          movie: movieId,
          rating: Number(rating),
          review: review,
        });
        response = await updateRating(myRating.id, {
          movie: movieId, // Include the movie ID
          rating: Number(rating), // Ensure rating is a number
          review: review, // Ensure review is a string
        });
      } else {
        // Add new rating
        console.log("Adding rating with payload:", {
          movie: movieId,
          rating: Number(rating),
          review: review,
        });
        response = await addRating(movieId, {
          movie: movieId, // Include the movie ID
          rating: Number(rating),
          review: review,
        });
      }
  
      if (response.success) {
        toast.success("Rating submitted successfully!");
        setMyRating(response.data); // Update user's rating
        setShowRatingModal(false);
  
        // Refresh ratings list
        const ratingsResponse = await getRatingsForMovie(movieId);
        if (ratingsResponse.success) {
          setRatings(ratingsResponse.data); // Update all ratings
        }
      } else {
        toast.error("Failed to submit rating.");
        console.error("Response error:", response.errors);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the rating.");
      console.error("Error details:", error.response?.data); // Log detailed error
    }
  };
  // Render star rating input
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <span
          key={i}
          style={{ cursor: "pointer", color: i <= rating ? "gold" : "gray" }}
          onClick={() => setRating(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Fallback UI if movie is not found
  if (!movie) {
    return (
      <div>
        <UserNavbar />
        <div className="text-center mt-5">
          <h3>Movie not found.</h3>
          <p>Please check the movie ID or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserNavbar />
      <div className="customermovieviewdetailssect1">
        <img src={a} alt="demontebgimg" id="customermovieviewdetailssect1bgimg" />
        <div className="customermovieviewdetailssect1details">
          <Row>
            <Col sm={2} className="customermovieviewdetailssect1detailscol1">
              <img
                src={movie.poster_url || a}
                alt="demonteposter"
                id="customermovieviewdetailssect1posterimg"
              />
            </Col>
            <Col className="customermovieviewdetailssect1detailscol2">
              <div id="customermovieviewdetailsdemontename">
                {movie.title} &nbsp;
                <button id="customermovieviewdetailsdemonterating">
                  <img src={star} alt="star" />
                  <span id="customermovieviewdetailsdemonteratingvalue">
                    &nbsp;{movie.rating}
                  </span>
                  <span id="customermovieviewdetailsdemonteratingtotal">/10</span>
                </button>
              </div>
              <div>
                <button className="customermovieviewdetailsdemontemovietype">
                  2D, 3D
                </button>
                &nbsp;
                <button className="customermovieviewdetailsdemontemovietype">
                  {movie.language}
                </button>
                <div id="customermovieviewdetailsdemontemoviegenre">
                  {movie.genres.join(", ")}
                </div>
                <div id="customermovieviewdetailsdemontemovietime">
                  {movie.runtime} min
                </div>
                <div>
                  <button id="customermovieviewdetailsdemontewatchnowbtn">
                    <IoMdPlay />
                    &nbsp;Watch Now
                  </button>
                  &nbsp;
                  <button
                    id="customermovieviewdetailsdemontemarkbtn"
                    onClick={handleAddToWatchlist}
                    disabled={isInWatchlist || isWatchlistLoading}
                  >
                    {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Movie Description Section */}
      <div className="customermoviedescsect">
        <div className="customermoviedescsectheading">Movie Description</div>
        <br />
        <div className="customermoviedescsectcontent">
          {movie.plot || "No description available."}
        </div>
        <br />
        <br />

        {/* Ratings & Reviews Section */}
        <div>
          <Row>
            <Col className="customermoviedescsectratingdisplaycol" sm={10}>
              <div className="customermoviedescsectheading">
                Ratings & Reviews
              </div>
              <br />
              <div className="customermoviedescsectratingcardsect">
                <CardGroup className="customermoviedescsectratingcardgroup m-2">
                  {ratings.length > 0 ? (
                    ratings.map((rating) => (
                      <Row key={rating.id} className="customermoviedescsectratingcardgrouprow m-2">
                        <Card className="customermoviedescsectratingsinglecard">
                          <div className="customermovieratingcardheader">
                            <img
                              src={rating.user.profile_image || a}
                              alt="ratinguser"
                              style={{ width: "25px", height: "25px" }}
                            />
                            &nbsp;{rating.user}
                          </div>
                          <div className="customermovieratingcardbody">
                            <div className="customermoviedescsectratingcardtext">
                              {rating.review}
                            </div>
                            <br />
                          </div>
                          <div className="customermoviedescsectratingcardfooter">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </div>
                        </Card>
                      </Row>
                    ))
                  ) : (
                    <p>No ratings available for this movie.</p>
                  )}
                </CardGroup>
              </div>
            </Col>

            <Col className="customermoviedescsectaverageratingdisplaycol">
              <center>
                <div className="customermoviedescsectratingbtntitle">
                  Ratings
                </div>
                <div id="customermoviedescsectcurrentrating">
                  {movie.rating}
                  <span id="customermoviedescsectratingtotal">/10</span>
                </div>
                <div className="customermoviedescsectratingcount">
                  {ratings.length} Rating(s) and {ratings.length} Review(s)
                </div>
              </center>
            </Col>
          </Row>
        </div>

        {/* Recommended Movies Section */}
        <div>
          <div className="customermoviedescsectheading">You May Also Like</div>
          <div className="customermoviedescsectrecommendcardsect">
            {movie.recommendations && movie.recommendations.length > 0 ? (
              movie.recommendations.map((recommendation, index) => (
                <Card key={index} className="customermoviedescsectrecommendsinglecard">
                  <Card.Img
                    src={recommendation.poster_url || a}
                    className="customermoviedescrecommendmovieimg"
                  />
                  <Card.Body>
                    <Card.Title className="customermovierecommendcardtitle">
                      {recommendation.title}
                    </Card.Title>
                    <Card.Text className="customermovierecommendcardtext">
                      {recommendation.genres.join(", ")}
                      <br />
                      {recommendation.runtime} min
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No recommendations available.</p>
            )}
          </div>
          <br />
          <br />
        </div>
      </div>

      {/* User Rating Section */}
      <div className="user-rating-section m-5">
        <h3>Your Rating</h3>
        {myRating ? (
          <div>
            <p>Your Rating: {myRating.rating}/10</p>
            <p>Your Review: {myRating.review}</p>
            <Button variant="danger" onClick={() => { setIsEditing(true); handleRatingModalOpen(); }}>
              Edit Rating
            </Button>
          </div>
        ) : (
          !isInWatchlist ? (
            <p>Add this movie to your watchlist to rate it.</p>
          ) : (
            <Button
              variant="danger"
              onClick={handleRatingModalOpen}
            >
              Add Rating
            </Button>
          )
        )}
      </div>

      {/* Rating Modal */}
      <Modal show={showRatingModal} onHide={handleRatingModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Rating" : "Add Rating"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <div>{renderStars()}</div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleRatingModalClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleRatingSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserViewMovieDetails;