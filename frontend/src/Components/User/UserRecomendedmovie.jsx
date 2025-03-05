import { toast } from "react-toastify";
import "./UserRecommendedmovie.css"
import logo from "../../assets/Star.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { viewCount, approveById } from "../../Services/AdminServiece";
import { IMG_BASE_URL } from "../../Services/BaseURL";
import { ViewById } from "../../Services/CommonServices";
import UserNavbar from "./Usernavbar";
import { Card,Button,CardGroup } from "react-bootstrap";
import star from "../../assets/Aboutus_Background.png";
function UserRecomendedmovie() {
  const [data, setData] = useState([]);

  const fetchData2 = async () => {
    try {
      const result = await viewCount("nowShowingMovies");

      if (result.success) {
        console.log(result);
        if (result.user.length > 0) {
          setData(result.user);
        } else {
          setData([]);
        }
      } else {
        console.error("Data error:", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred during Data View");
    }
  };
  useEffect(() => {
    fetchData2(); // Call the async function
  }, []);

  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (localStorage.getItem("user") == null) {
  //       navigate("/");
  //     }
  //   });

  const id = localStorage.getItem("user");
  const [userDetails, setUserDetails] = useState({});
  const [genre, setGenre] = useState([]);

  const fetchData = async () => {
    try {
      const result = await ViewById("viewUserById", id);
      if (result.success) {
        setUserDetails(result.user || null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred during Data View");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const movieDetailView = (id) => {
    navigate(`/user-movie-details/${id}`);
  };

  return (
    <div>
    <UserNavbar/>
    
    <div className="mt-5">
    <center>
      <div className='Mainheading mt-5'>
        <span className='headingone'>All Movies</span>
        <input className='mainsearchbar' placeholder='Search here...' />
      </div>
      <div>
        <span className='headingtwo'>Filter</span>
        <select name='finestatus' className='moviedropdowntab'>
          <option>Genre</option>
          <option>.</option>
          <option>.</option>
        </select>
        <select name='finestatus' className='moviedropdowntab'>
          <option>Year</option>
          <option>.</option>
          <option>.</option>
        </select>
        <select name='finestatus' className='moviedropdowntab'>
          <option>Language</option>
          <option>.</option>
          <option>.</option>
        </select>
        <select name='finestatus' className='moviedropdowntab'>
          <option>Rating</option>
          <option>.</option>
          <option>.</option>
        </select>
        <Button variant="danger" className='moviesearchtab'>Search</Button>
      </div>
      <div>
        <CardGroup className='moviecardgrp'>
          <Card className='separatemoviecard'>
            <Card.Img variant="top" src={star} />
            <Card.Body>
              <Card.Title className='cardmoviename'>Kalki
                <label className='cardmovieratingstar'><img src={logo} alt="Star" /> 7.7/10</label>
              </Card.Title>
              <Card.Text>Horror, Comedy</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="cardmovieduration">2hr 26min</small>
            </Card.Footer>
          </Card>
          <Card className='separatemoviecard'>
            <Card.Img variant="top" src={star} />
            <Card.Body>
              <Card.Title className='cardmoviename'>Poovan
                <label className='cardmovieratingstar'><img src={logo} alt="Star" /> 7.7/10</label>
              </Card.Title>
              <Card.Text>Horror, Comedy</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="cardmovieduration">2hr 26min</small>
            </Card.Footer>
          </Card>
          <Card className='separatemoviecard'>
            <Card.Img variant="top" src={star} />
            <Card.Body>
              <Card.Title className='cardmoviename'>Operation Java
                <label className='cardmovieratingstar'><img src={logo} alt="Star" /> 7.7/10</label>
              </Card.Title>
              <Card.Text>Horror, Comedy</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="cardmovieduration">2hr 26min</small>
            </Card.Footer>
          </Card>
          <Card className='separatemoviecard'>
            <Card.Img variant="top" src={star} />
            <Card.Body>
              <Card.Title className='cardmoviename'>Pranaya Vilasam
                <label className="cardmovieratingstar"><img src={logo} alt="Star" /> 7.7/10</label>
              </Card.Title>
              <Card.Text>Horror, Comedy</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="cardmovieduration">2hr 26min</small>
            </Card.Footer>
          </Card>
          <Card className='separatemoviecard'>
            <Card.Img variant="top" src={star} />
            <Card.Body>
              <Card.Title className='cardmoviename'>Demonte 2
                <label className='cardmovieratingstar'><img src={logo} alt="Star" /> 7.7/10</label>
              </Card.Title>
              <Card.Text>Horror, Comedy</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="cardmovieduration">2hr 26min</small>
            </Card.Footer>
          </Card>
          <Card className='separatemoviecard'>
            <Card.Img variant="top" src={star} />
            <Card.Body>
              <Card.Title className='cardmoviename'>Inni Utharam
                <label className='cardmovieratingstar'><img src={logo} alt="Star" /> 7.7/10</label>
              </Card.Title>
              <Card.Text>Thriller</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="cardmovieduration">2hr 6min</small>
            </Card.Footer>
          </Card>
        </CardGroup>
      </div>
    </center>
  </div>
      </div>
  );
}

export default UserRecomendedmovie;
