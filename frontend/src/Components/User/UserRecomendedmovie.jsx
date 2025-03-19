import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Star from "../../assets/Star.png";
import UserNavbar from "./Usernavbar";
import "../Admin/AdminviewMovie.css";
import { useState, useEffect } from "react";
import { getMovies } from "../../Services/apiService";
import { Link } from "react-router";
// import countryCodeToFlagEmoji from "country-code-to-flag-emoji";

function UserRecomendedmovie() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMovies = async () => {
    try {
      const data = await getMovies(1, searchQuery, selectedGenre, "", "", "");
      console.log(data.data.movies);
      setMovies(data.data.movies);
      let genreList = new Set();
      for (let i = 0; i < data.data.movies.length; i++) {
        genreList.add(data.data.movies[i].genres[0]);
      }
      setGenres([...genreList]);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSearch = () => {
    fetchMovies();
  };

  useEffect(() => {
    const fetchInitialMovies = async () => {
      try {
        const data = await getMovies(1, "", "");
        console.log(data.data.movies);
        setMovies(data.data.movies);
        let genreList = new Set();
        for (let i = 0; i < data.data.movies.length; i++) {
          genreList.add(data.data.movies[i].genres[0]);
        }
        setGenres([...genreList]);
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
          <span className="headingone m-5">All Movies</span>
          <input
            className="mainsearchbar m-5"
            placeholder="Search here..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="headingtwo">Filter</span>
          <select
            name="finestatus"
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
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {movies.map((movie) => (
            <div className="col" key={movie.id}>
              <Link
                style={{ textDecoration: "none" }}
                to={`/movie/${movie.id}`}
              >
                <Card className="separatemoviecard h-100">
                  <Card.Img
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                    }}
                    variant="top"
                    src={movie.poster_url}
                  />
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <div className="row">
                      <div className="col-7">{movie.genres.join(", ")} </div>
                      <div className="col-5">
                        {" "}
                        <img
                          src={Star}
                          alt="Star"
                          style={{ width: "20px", height: "20px" }}
                        />
                        <small>{movie.rating}/10</small>
                      </div>
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
export default UserRecomendedmovie;
