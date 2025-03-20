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
import {
  getTotalMoviesCount,
  getTotalUsers,
  getMovies,
  getAllMovies, // Import the new API function
} from "../../Services/apiService"; // Import API functions

function AdminHome() {
  const [totalMovies, setTotalMovies] = useState(0); // State for total movies
  const [totalUsers, setTotalUsers] = useState(0); // State for total users
  const [trendingMovies, setTrendingMovies] = useState([]); // State for trending movies
  const [newlyAddedMovies, setNewlyAddedMovies] = useState([]); // State for newly added movies
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  const maxValue = 2000; // Maximum value for the progress bar
  const circleSize = 200; // Size of the circle
  const radius = circleSize / 2; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle

  // Fetch total movies, total users, trending movies, and newly added movies on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total movies
        const moviesResponse = await getTotalMoviesCount();
        if (moviesResponse.success) {
          setTotalMovies(moviesResponse.data.total_movies); // Update state with total movies
        } else {
          throw new Error("Failed to fetch total movies.");
        }

        // Fetch total users
        const usersResponse = await getTotalUsers();
        if (usersResponse.success) {
          setTotalUsers(usersResponse.data.total_users); // Update state with total users
        } else {
          throw new Error("Failed to fetch total users.");
        }

        // Fetch trending movies
        const trendingMoviesResponse = await getMovies(1, "", ""); // Fetch movies (page 1, no query, no genre filter)
        if (trendingMoviesResponse.success) {
          setTrendingMovies(trendingMoviesResponse.data.movies); // Update state with trending movies
        } else {
          throw new Error("Failed to fetch trending movies.");
        }

        // Fetch newly added movies
        const newlyAddedMoviesResponse = await getAllMovies(); // Fetch all movies from the Movie model
        if (newlyAddedMoviesResponse.success) {
          setNewlyAddedMovies(newlyAddedMoviesResponse.data.movies); // Update state with newly added movies
        } else {
          throw new Error("Failed to fetch newly added movies.");
        }
      } catch (error) {
        setError(error.message); // Set error message
        toast.error("Failed to fetch movie data.");
      } finally {
        setLoading(false); // Set loading to false
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
                <Card className="separatemoviecard">
                  <Card.Img variant="top" src={movie.poster_url || Star} />{" "}
                  {/* Use movie poster or fallback image */}
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
                <Card className="separatemoviecard">
                  <Card.Img variant="top" src={movie.poster_url || Star} />{" "}
                  {/* Use movie poster or fallback image */}
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