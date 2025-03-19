import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Star from "../../assets/Star.png";
import UserNavbar from "./Usernavbar";
import "../Admin/AdminviewMovie.css";
import { useState, useEffect } from "react";
import { getWatchList } from "../../Services/apiService";
import { Link } from "react-router";
// import countryCodeToFlagEmoji from "country-code-to-flag-emoji";

function UserWatchedmovie() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchInitialMovies = async () => {
      try {
        const data = await getWatchList();
        console.log(data.data);
        setMovies(data.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchInitialMovies();
  }, []);
  return (
    <div>
      <UserNavbar />
      <div className="container mt-5">
        <div className="Mainheading mt-5 pt-5"></div>
        <center>
          <span className="headingone m-5">Watchlist</span>
        </center>
        <div className="d-flex flex-column align-items-center">
          {movies.map((movie) => (
            <div key={movie.id} style={{ margin: "10px", width: "80%" }}>
              <Link
                style={{ textDecoration: "none" }}
                to={`/movie/${movie.tmdb_id}`}
              >
                <Card className="separatemoviecard" style={{ width: "100%" }}>
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <div className="row">
                      {" "}
                      <img
                        src={Star}
                        alt="Star"
                        style={{
                          width: "20px",
                          height: "20px",
                        }}
                      />
                      <small>{movie.average_rating}/10</small>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default UserWatchedmovie;
