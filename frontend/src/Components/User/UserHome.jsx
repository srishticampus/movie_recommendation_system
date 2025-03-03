import UserLandingBanner from "./UserHomeNowShowing";
import { toast } from "react-toastify";
import "../LandingPages/Landingpage.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { viewCount } from "../../Services/AdminServiece";
import { IMG_BASE_URL } from "../../Services/BaseURL";
import { ViewById } from "../../Services/CommonServices";
import FooterLandingPage from "../LandingPages/FooterLandingPage"

function Carousel({ groupedCards = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % (groupedCards.length || 1));
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + (groupedCards.length || 1)) % (groupedCards.length || 1));
  };

  return (
    <div className="container mt-5">
      <div id="carouselExampleIndicators2" className="carousel slide">
        <div className="carousel-inner">
          {groupedCards.map((group, index) => (
            <div key={index} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
              <div className="row">
                <div className="col-auto">
                  <button className="btn btn-primary mb-3 mr-1 carousel-control-prev" onClick={prevSlide}>
                    <i className="fa fa-arrow-left"></i>
                  </button>
                </div>
                {group.map((card) => (
                  <div key={card.id} className="col-sm-2 mb-3">
                    <div className="card BootstrapCard">
                      {/* <img className="img-fluid" src={`${IMG_BASE_URL}/${card.movieImage?.filename}`} alt={`movie ${card.id}`} /> */}
                    </div>
                  </div>
                ))}
                <div className="col-auto">
                  <button className="btn btn-primary mb-3 carousel-control-next" onClick={nextSlide}>
                    <i className="fa fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserHome() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const navigate = useNavigate();
  const id = localStorage.getItem("user");
  const [userDetails, setUserDetails] = useState({});

//   useEffect(() => {
//     if (!localStorage.getItem("user")) {
//       navigate("/");
//     }
//   }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ViewById("viewUserById", id);
        if (result.success) {
          setUserDetails(result.user || {});
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error(error,"An unexpected error occurred during Data View");
      }
    };
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const result = await viewCount("nowShowingMovies");
        if (result.success) {
          setData(result.user.length > 0 ? result.user : []);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error(error,"An unexpected error occurred during Data View");
      }
    };
    fetchData2();
  }, []);

  useEffect(() => {
    const fetchData3 = async () => {
      try {
        const result = await viewCount("comingSoonMovies");
        if (result.success) {
          setData2(result.user.length > 0 ? result.user : []);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error(error,"An unexpected error occurred during Data View");
      }
    };
    fetchData3();
  }, []);

  return (
    <div>
      <UserLandingBanner className='userLandingBanner' />
      <div className="landing-sec2">
        <p className="landing-div2 mt-5 mb-5">Now Showing Movies</p>
      </div>
      <div className="row g-4">
        {data.map((item) => (
          <div className="col-md-3" key={item.id}>
            <div className="card h-100" style={{ width: "18rem" }}>
              <img src={`${IMG_BASE_URL}/${item.movieImage?.filename}`} alt={item.movieName} />
              <p>{item.movieName}</p>
              <p>{item.duration}</p>
            </div>
          </div>
        ))}
      </div>

      {data2.length > 0 && (
        <div className="landing_sec_4">
          <p className="landing_sec_4_head mt-5 mb-5">Coming Soon Movies</p>
          <div className="row g-4">
            {data2.map((item) => (
              <div className="col-md-3" key={item.id}>
                <div className="card h-100" style={{ width: "18rem" }}>
                  <img src={`${IMG_BASE_URL}/${item.movieImage?.filename}`} alt={item.movieName} />
                  <p>{item.movieName}</p>
                  <p>{item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <FooterLandingPage />
    </div>
  );
}

export default UserHome;
