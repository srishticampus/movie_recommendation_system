import { useEffect, useState } from "react";
import { CardGroup, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import a from "../../assets/Aboutus_Background.png";
import "./Moviedetails.css";
import star from "../../assets/Star.png";
import { FaRegBookmark } from "react-icons/fa6";
import { IoMdPlay } from "react-icons/io";
import AdminNavbar from "./AdminNavbar";
import { toast } from "react-toastify";
import { getMovieDetails, getRatingsForMovie } from "../../Services/apiService";
import { useParams } from "react-router-dom";

function MovieDetailedPage() {
  const [movie, setMovie] = useState(null); // Initialize as null
  const [ratings, setRatings] = useState([]); // All ratings for the movie
  const { movieId } = useParams(); // Get movieId from URL params

  // Fetch movie details and ratings
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
      } catch (error) {
        toast.error("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, [movieId]);

  // Fallback UI if movie is not found
  if (!movie) {
    return (
      <div>
        <AdminNavbar />
        <div className="text-center mt-5">
          <h3>Movie not found.</h3>
          <p>Please check the movie ID or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
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
                  {/* <button id="customermovieviewdetailsdemontemarkbtn">
                    &nbsp;Mark as Watched
                  </button>
                  &nbsp; */}
                  <button id="customermovieviewdetailsdemontebookmark">
                    <FaRegBookmark />
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

        {/* Cast Section
        <div className="customermoviedescsectheading">Cast</div>
        <div className="customermoviedescsectcastcardsect">
          <CardGroup className="customermoviedescsectcastcardgroup">
            {movie.cast && movie.cast.length > 0 ? (
              movie.cast.map((actor, index) => (
                <Card key={index} className="customermoviedescsectcastsinglecard">
                  <Card.Img src={actor.image || a} className="customermoviedescimg" />
                  <Card.Body>
                    <Card.Title className="customermoviecardtitle">
                      {actor.name}
                    </Card.Title>
                    <Card.Text className="customermoviecardtext">
                      {actor.role}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No cast information available.</p>
            )}
          </CardGroup>
        </div> */}

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
    </div>
  );
}

export default MovieDetailedPage;