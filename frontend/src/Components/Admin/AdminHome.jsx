import { toast } from "react-toastify";
import "../LandingPages/Landingpage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FooterLandingPage from "../LandingPages/FooterLandingPage";
import AdminNavbar from "./AdminNavbar";
import "./AdminHome.css";
import Card from "react-bootstrap/Card";
import Star from "../../assets/Star.png";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom"; // Import Link
import {
  getTotalMoviesCount,
  getTotalUsers,
  getMovies,
  getAllMovies,
} from "../../Services/apiService";

function AdminHome() {
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [newlyAddedMovies, setNewlyAddedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const maxValue = 2000;
  const circleSize = 200;
  const radius = circleSize / 2;
  const circumference = 2 * Math.PI * radius;

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesResponse = await getTotalMoviesCount();
        if (moviesResponse.success) {
          setTotalMovies(moviesResponse.data.total_movies);
        } else {
          throw new Error("Failed to fetch total movies.");
        }

        const usersResponse = await getTotalUsers();
        if (usersResponse.success) {
          setTotalUsers(usersResponse.data.total_users);
        } else {
          throw new Error("Failed to fetch total users.");
        }

        const trendingMoviesResponse = await getMovies(1, "", "");
        if (trendingMoviesResponse.success) {
          setTrendingMovies(trendingMoviesResponse.data.movies);
        } else {
          throw new Error("Failed to fetch trending movies.");
        }

        const newlyAddedMoviesResponse = await getAllMovies();
        if (newlyAddedMoviesResponse.success) {
          setNewlyAddedMovies(newlyAddedMoviesResponse.data.movies);
        } else {
          throw new Error("Failed to fetch newly added movies.");
        }
      } catch (error) {
        setError(error.message);
        toast.error("Failed to fetch movie data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render loading or error state
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-5 p-5">
        <p className="admin-dashboard-movie-head">Analytics</p>
        <div className="card p-4">
          <div className="row circle-row">
            {/* Circle 1: Total Movies */}
            <div className="circle-container">
              <div className="progress-ring-wrapper">
                <svg
                  className="progress-ring"
                  width={circleSize}
                  height={circleSize}
                >
                  <circle
                    className="background"
                    cx={radius}
                    cy={radius}
                    r={radius}
                    stroke="#ddd"
                  />
                  <circle
                    className="foreground"
                    cx={radius}
                    cy={radius}
                    r={radius}
                    stroke="#4CAF50"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - (totalMovies / maxValue) * circumference
                    }
                  />
                </svg>
              </div>
              <div className="circle-value">{totalMovies}</div>
              <div className="circle-label">Total Number of Movies</div>
            </div>

            {/* Circle 2: Total Users */}
            <div className="circle-container">
              <div className="progress-ring-wrapper">
                <svg
                  className="progress-ring"
                  width={circleSize}
                  height={circleSize}
                >
                  <circle
                    className="background"
                    cx={radius}
                    cy={radius}
                    r={radius}
                    stroke="#ddd"
                  />
                  <circle
                    className="foreground"
                    cx={radius}
                    cy={radius}
                    r={radius}
                    stroke="#FF6384"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - (totalUsers / maxValue) * circumference
                    }
                  />
                </svg>
              </div>
              <div className="circle-value">{totalUsers}</div>
              <div className="circle-label">Total Number of Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Trending Movies Section */}
      <div className="container mt-5 pt-5">
        <div className="row mt-5">
          <div className="col">
            <h4>Top Trending Movies</h4>
          </div>
        </div>
        <div className="row">
          {trendingMovies.length === 0 ? (
            <p className="text-center">No trending movies found.</p>
          ) : (
            trendingMovies.map((movie) => (
              <div key={movie.id} className="col-md-4 mb-4">
                {/* Wrap the card content in a Link */}
                <Link
                  to={`/admin-viewmovieDetails/${movie.id}`} // Pass movieId as a URL parameter
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card className="separatemoviecard">
                    <Card.Img variant="top" src={movie.poster_url || Star} />
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
                      <div className="mt-2 text-secondary">
                        <small>{movie.runtime || "N/A"}</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Newly Added Movies Section */}
      <div className="container mt-5 pt-5">
        <div className="row mt-5">
          <div className="col">
            <h4>Newly Added Movies</h4>
          </div>
        </div>
        <div className="row">
          {newlyAddedMovies.length === 0 ? (
            <p className="text-center">No newly added movies found.</p>
          ) : (
            newlyAddedMovies.map((movie) => (
              <div key={movie.id} className="col-md-4 mb-4">
                {/* Wrap the card content in a Link */}
                <Link
                  to={`/admin-viewmovieDetails/${movie.id}`} // Pass movieId as a URL parameter
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card className="separatemoviecard">
                    <Card.Img variant="top" src={movie.poster_url || Star} />
                    <Card.Body>
                      <Card.Title>{movie.title}</Card.Title>
                      <div className="row">
                        <div className="col-7">
                          Genres: {movie.genres?.join(", ") || "N/A"}
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
                      <div className="mt-2 text-secondary">
                        <small>{movie.runtime || "N/A"}</small>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="landing_sec_5">
        <FooterLandingPage />
      </div>
    </div>
  );
}

export default AdminHome;