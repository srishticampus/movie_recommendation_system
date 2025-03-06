import UserLandingBanner from "../User/UserHomeNowShowing";
import { toast } from "react-toastify";
import "../LandingPages/Landingpage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { viewCount } from "../../Services/AdminServiece";
import { IMG_BASE_URL } from "../../Services/BaseURL";
import { ViewById } from "../../Services/CommonServices";
import FooterLandingPage from "../LandingPages/FooterLandingPage";
import AdminNavbar from "./AdminNavbar";

function Carousel({ groupedCards = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % (groupedCards.length || 1));
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) =>
        (prevIndex - 1 + (groupedCards.length || 1)) %
        (groupedCards.length || 1)
    );
  };

  return (
    <div>
      <div className="container">
        <div id="carouselExampleIndicators2" className="carousel slide">
          <div className="carousel-inner">
            {groupedCards.map((group, index) => (
              <div
                key={index}
                className={`carousel-item ${
                  index === activeIndex ? "active" : ""
                }`}
              >
                <div className="row">
                  <div className="col-auto">
                    <button
                      className="btn btn-primary mb-3 mr-1 carousel-control-prev"
                      onClick={prevSlide}
                    >
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
                    <button
                      className="btn btn-primary mb-3 carousel-control-next"
                      onClick={nextSlide}
                    >
                      <i className="fa fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminHome() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const navigate = useNavigate();
  const id = localStorage.getItem("user");
  const [userDetails, setUserDetails] = useState({});

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await ViewById("viewUserById", id);
  //       if (result.success) {
  //         setUserDetails(result.user || {});
  //       } else {
  //         toast.error(result.message);
  //       }
  //     } catch (error) {
  //       toast.error(error, "An unexpected error occurred during Data View");
  //     }
  //   };
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchData2 = async () => {
  //     try {
  //       const result = await viewCount("nowShowingMovies");
  //       if (result.success) {
  //         setData(result.user.length > 0 ? result.user : []);
  //       } else {
  //         toast.error(result.message);
  //       }
  //     } catch (error) {
  //       toast.error(error, "An unexpected error occurred during Data View");
  //     }
  //   };
  //   fetchData2();
  // }, []);

  // useEffect(() => {
  //   const fetchData3 = async () => {
  //     try {
  //       const result = await viewCount("comingSoonMovies");
  //       if (result.success) {
  //         setData2(result.user.length > 0 ? result.user : []);
  //       } else {
  //         toast.error(result.message);
  //       }
  //     } catch (error) {
  //       toast.error(error, "An unexpected error occurred during Data View");
  //     }
  //   };
  //   fetchData3();
  // }, []);

  return (
    <div>
    <AdminNavbar/>
      <UserLandingBanner className="userLandingBanner" />
      <div className="landing-sec2">
        <p className="landing-div2 mt-5 mb-5">Now Showing Movies</p>
      </div>
      <div className="row g-4">
        {data.map((item) => (
          <div className="col-md-3" key={item.id}>
            <div className="card h-100" style={{ width: "18rem" }}>
              <img
                src={`${IMG_BASE_URL}/${item.movieImage?.filename}`}
                alt={item.movieName}
              />
              <p>{item.movieName}</p>
              <p>{item.duration}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="landing-sec3 mt-5">
        <p className="key_features">KEY FEATURES</p>
        <p className="All_You_Need">
          All You Need for the Perfect Movie Experience
        </p>
        <div
          className="container"
          style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
        >
          {/* Key features cards */}
          <div className="cardSec3_Cards" style={{ flex: "1 1 22%" }}>
            <p className="Sec3_Cards_Sec_header">
              "Personalized Recommendations"
            </p>
            <div className="card-body Sec3_card_body">
              <p>
                Discover movies that match your unique taste! Our platform
                analyzes your watch history and ratings to provide AI-powered
                recommendations. Whether you’re into action-packed thrillers or
                heartwarming dramasto your screen.
              </p>
            </div>
          </div>
          <div className="cardSec3_Cards" style={{ flex: "1 1 22%" }}>
            <p className="Sec3_Cards_Sec_header">
              "Create and Manage Your Watch List"
            </p>
            <div className="card-body Sec3_card_body">
              <p>
                Keep track of the movies you want to see! With our easy-to-use
                Watch List feature, you can bookmark titles and organize your
                to-watch queue. Never forget a must-see movie again—access your
                list anytime, anywhere.
              </p>
            </div>
          </div>
          <div className="cardSec3_Cards" style={{ flex: "1 1 22%" }}>
            <p className="Sec3_Cards_Sec_header">"Rate and Review Movies"</p>
            <div className="card-body Sec3_card_body">
              <p>
                Express your love (or critique) for every movie you watch! Rate
                movies on a 5-star scale and share detailed reviews with the
                community. Your ratings help refine your recommendations and
                guide fellow movie lovers.
              </p>
            </div>
          </div>
          <div className="cardSec3_Cards" style={{ flex: "1 1 22%" }}>
            <p className="Sec3_Cards_Sec_header">
              "Watch Instantly on Any Device"
            </p>
            <div className="card-body Sec3_card_body">
              <p>
                Enjoy your favorite movies with just a click. Our platform lets
                you stream directly from any device—be it your smartphone,
                tablet, or smart TV. Experience seamless playback and HD quality
                for an immersive viewing experience
              </p>
            </div>
          </div>
        </div>
      </div>
      {data2.length > 0 && (
        <div className="landing_sec_4">
          <p className="landing_sec_4_head mt-5 mb-5">Coming Soon Movies</p>
          <div className="row g-4">
            {data2.map((item) => (
              <div className="col-md-3" key={item.id}>
                <div className="card h-100" style={{ width: "18rem" }}>
                  <img
                    src={`${IMG_BASE_URL}/${item.movieImage?.filename}`}
                    alt={item.movieName}
                  />
                  <p>{item.movieName}</p>
                  <p>{item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="landing_sec_5">
        <FooterLandingPage />
      </div>{" "}
    </div>
  );
}

export default AdminHome;
