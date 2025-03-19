import { useEffect, useState } from "react";
import { getWatchedMovies } from "../../Services/apiService";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import UserNavbar from "./Usernavbar";
import Star from "../../assets/Star.png";

function UserViewWatchedMovie() {
  const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      const response = await getWatchedMovies();
      if (response.success) {
        setMovies(response.data);
      } else {
        setError("Failed to load watched movies.");
      }
    };

    fetchWatchedMovies();
  }, []);

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
              <Form.Control type="search" placeholder="Search Here..." aria-label="Search" />
            </Form>
          </div>
        </div>

        <center className="mt-2">
          <span className="headingtwo">Filter</span>
          <select name="genre" className="moviedropdowntab">
            <option>Genre</option>
            <option>Action</option>
            <option>Comedy</option>
            <option>Drama</option>
          </select>
          <select name="year" className="moviedropdowntab">
            <option>Year</option>
            <option>2023</option>
            <option>2022</option>
          </select>
          <select name="language" className="moviedropdowntab">
            <option>Language</option>
            <option>English</option>
            <option>Spanish</option>
          </select>
          <select name="rating" className="moviedropdowntab">
            <option>Rating</option>
            <option>8+</option>
            <option>7+</option>
          </select>
          <Button variant="danger" className="moviesearchtab">
            Search
          </Button>
        </center>

        {/* Loading and Error Handling */}
        {error && <p className="text-center mt-4 text-danger">{error}</p>}

        <div className="row mt-4">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="col-md-4 mb-4">
                <Card className="separatemoviecard">
                  <Card.Img variant="top" src={movie.poster || Star} alt={movie.title} />
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <div className="row">
                      <div className="col-7">{movie.genre || "Unknown Genre"}</div>
                      <div className="col-5">
                        <img src={Star} alt="Star" style={{ width: "20px", height: "20px" }} />
                        <small>{movie.rating || "N/A"}/10</small>
                      </div>
                    </div>
                    <div className="mt-2 text-secondary">
                      <small>{movie.duration || "Unknown Duration"}</small>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
             <p className="text-center mt-4">No movies found in your watched list.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserViewWatchedMovie;
