import { useState } from "react";
import logo from "../../assets/Vector (1).png";
import { Link } from "react-router";
import film1 from "../../assets/film1.png";
import film2 from "../../assets/film2.png";
import film3 from "../../assets/film3.png";
import film4 from "../../assets/film4.png";
import film5 from "../../assets/film5.png";
import film6 from "../../assets/film6.png";
import tamil from "../../assets/tamil.jpg";
import telugu from "../../assets/telugu.jpg";
import FooterLandingPage from "./FooterLandingPage";
import Navbar from "../Navbar/Navbar"
import "./Landingpage.css"

function Carousel({ groupedCards }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % groupedCards.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + groupedCards.length) % groupedCards.length);
  };

  return (
    <div className="container mt-5">
      <div id="carouselExampleIndicators2" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          {groupedCards.map((group, index) => (
            <div
              key={index}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
            >
              <div className="row">
                {/* Previous Button */}
                <button
                  className="btn btn-primary mb-3 mr-1 carousel-control-prev"
                  onClick={prevSlide}
                >
                  <i className="fa fa-arrow-left "></i>
                </button>
                {/* Cards */}
                {group.map((card) => (
                  <div key={card.id} className="col-sm-2 mb-3">
                    <div className="card BootstrapCard">
                      <img className="img-fluid" src={card.img} alt={`movie ${card.id}`} />
                    </div>
                  </div>
                ))}
                {/* Next Button */}
                <button
                  className="btn btn-primary mb-3 carousel-control-next"
                  onClick={nextSlide}
                >
                  <i className="fa fa-arrow-right "></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const cards = [
    { id: 1, img: film1 },
    { id: 2, img: film2 },
    { id: 3, img: film3 },
    { id: 4, img: film4 },
    { id: 5, img: film5 },
    { id: 6, img: film6 },
    { id: 6, img: tamil },
    { id: 7, img: telugu },
  ];

  // Group cards into sets of 6
  const groupedCards = [];
  for (let i = 0; i < cards.length; i += 6) {
    groupedCards.push(cards.slice(i, i + 6));
  }

  return (
    <div className="landing-page-container">
    <Navbar/>
      <div className="landing_banner">
        <div className="container">
          <div className="row">
            <div className=" landing_banner_right_box mt-5">
              <p className="landing_banner_right_box_title">
                MaxusDiscover Movies You'll Love in<br/> Just a Few Clicks.
              </p>
              <p className="landing_banner_right_box_sub_title mt-5">
              The power of AI to find your perfect movie match. Get personalized recommendations based on your watch history and ratings.
              Watch Now              </p>
              <Link to='/user_login'>
                <button className="btn btn-danger landing_banner_register_btn mt-5 fw-bolder">
                  Start Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-sec2">
        <p className="landing-div2 mt-5 mb-5">Now Showing movies</p>
        <Carousel cards={cards} groupedCards={groupedCards} />
      </div>

      <div className="landing-sec3">
        <p className="key_features">KEY FEATURES</p>
        <p className="All_You_Need">All You Need for the Perfect Movie Experience</p>
        <div className="container" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Key features cards */}
          <div className="Sec3_Cards p-4" style={{ flex: '1 1 22%' }}>
            <div className="card-header Sec3_Cards_header">Book Tickets</div>
            <p className="Sec3_Cards_Sec_header">"Secure Your Seat in Seconds"</p>
            <div className="card-body Sec3_card_body"><p>Choose your favorite show, select your seats, and get ready for an incredible movie night—all without standing in line!</p></div>
          </div>
          <div className="Sec3_Cards p-4" style={{ flex: '1 1 22%' }}>
            <div className="card-header Sec3_Cards_header">Order Snacks</div>
            <p className="Sec3_Cards_Sec_header">"Snacks, Always Ready"</p>
            <div className="card-body Sec3_card_body"><p>Pre-order your favorite movie snacks directly from the app. From popcorn to drinks, so you can enjoy the show.</p></div>
          </div>
          <div className="Sec3_Cards p-4"  style={{ flex: '1 1 22%' }}>
            <div className="card-header Sec3_Cards_header">Reserve Parking</div>
            <p className="Sec3_Cards_Sec_header">"Park with Ease, Every Time"</p>
            <div className="card-body Sec3_card_body"><p>Say goodbye to last-minute parking stress! Reserve your parking space in advance and ensure a smooth arrival.</p></div>
          </div>
          <div className="Sec3_Cards p-4" style={{ flex: '1 1 22%' }}>
            <div className="card-header Sec3_Cards_header">Join Queue Slot</div>
            <p className="Sec3_Cards_Sec_header">"Don't Miss Out"</p>
            <div className="card-body Sec3_card_body"><p>If tickets are fully booked, simply reserve a queue slot to hold your place in line. So you never miss a show.</p></div>
          </div>
        </div>
      </div>

      <div className="landing_sec_4">
        <p className="landing_sec_4_head mt-5 mb-5">Coming Soon movies</p>
        <Carousel cards={cards} groupedCards={groupedCards} />
      </div>
      <div className="landing_sec_5">
      <FooterLandingPage />
      </div>
     


    </div>
  );
}

export default LandingPage;
