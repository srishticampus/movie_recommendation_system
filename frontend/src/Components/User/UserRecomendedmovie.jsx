import { toast } from "react-toastify";
import "../LandingPages/Landingpage.css";
import logo from "../../assets/Vector.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { viewCount, approveById } from "../../Services/AdminServiece";
import { IMG_BASE_URL } from "../../Services/BaseURL";
import { ViewById } from "../../Services/CommonServices";
import UserNavbar from "./Usernavbar";

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
    <div className="user-data-container mt-5">
      <div className="container mt-5 pt-5">
        <h1 className="mt-5">Recommended movies</h1>

        <div className="row my-5 d-flex">
        <div className="col-2 justify-content-end ">Filter</div>
        <div className="col-2"></div>
        <div className="col-2">wdw</div>
        <div className="col-2">wdw</div>
        <div className="col-2">wdw</div>
        <div className="col-2">wdw</div>

        </div>

        <div className="row g-4">
          {/* {data.map((item, index) => (
      <div key={item._id || index} className="col-md-3 " onClick={()=>{movieDetailView(item._id)}}>
        <div className="h-100 p-3" style={{ width: "18rem" }}>
          <img
            src={`${IMG_BASE_URL}/${item.movieImage.filename}`}
            alt={item.movieName}
            className="card-img-top"
          />
          <div className="card-body">
            <h5 className="card-title">{item.movieName}</h5>
            <p className="card-text"> {item.movieType}</p>
            <p className="card-text"> {item.duration}</p>
          </div>
        </div>
      </div>
    ))}*/}

          <div
            className="col-md-3 "
            onClick={() => {
              movieDetailView();
            }}
          >
            <div className="h-100 p-3" style={{ width: "18rem" }}>
              <img
                src={
                  "https://tse3.mm.bing.net/th?id=OIP.E3UNwm389l_qdOdJ6zbhCAHaE8&pid=Api&P=0&h=180"
                }
                alt="jnj"
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">item.movieName</h5>
                <p className="card-text"> item.movieType</p>
                <p className="card-text"> item.duration</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div></div>
  );
}

export default UserRecomendedmovie;
