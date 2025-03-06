import Slider from "react-slick";
import "./UserLandingBanner.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import test from "../../assets/complaintBanner.png";
import test2 from "../../assets/paniTitle.png";
import test3 from "../../assets/kanguva 2.avif";
import logo from "../../assets/Vector.png";
import { Link } from "react-router";
// import { IMG_BASE_URL } from ".";
function UserHomeNowShowing() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1, // Show 1 slide at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    arrows: true,
  };

  return (
    <div className="userLandingBanner">
      <Slider {...settings}>
        {/* Screen 1 */}
        <div className="movieSlide">
          <div className="screen1Content">
          <div className="landing_banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 landing_banner_left_box">
              <img src={logo} className="user-home-top-img" alt="logo" />
              <p><span className='logo_red'>Maxus</span>Cinemas</p>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 landing_banner_right_box mt-5">
              <p className="landing_banner_right_box_title">
                MaxusCinemas - The Smart Way to Enjoy Every Show
              </p>
              <p className="landing_banner_right_box_sub_title mt-5">
                Stay ahead of the game! Explore upcoming films and be the first to secure your spot for the most anticipated releases.
              </p>
              <Link to='/user_login'>
                <button className="btn btn-danger landing_banner_register_btn mt-5 fw-bolder">
                  Start Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
          </div>
        </div>

        {/* Screen 2 */}
        <div className="movieSlide">
      
       <div className="screen2Content">
            <div className="imageContainer"  >
              <img src={test2}  alt="Screen 2 Left" />
              <div className="screen2-text">
              <h4>Pani</h4>
              <h5>Action / Darama / Crime</h5>
              <h5>2hrs 23 mins</h5>
              <div className="screen2-lang">Malayalam</div>
              <br/>
              <div className="screen2-btn">Book Now</div>
              </div>
            </div>
            <h1>Double Feature</h1>
            <p>Watch back-to-back movies with exciting combo offers.</p>
            <button className="button">View Details</button>
          </div>
    </div>
        

        {/* Screen 3 */}
        <div className="movieSlide">
          <div className="screen3Content">
            <img src={test3} alt="Screen 3" className="fullWidthImage" />
           <div className="screen3-text">
            <h3>Releasing On 14 Nov 2024</h3>
          
           </div> 
          </div>
        </div>
      </Slider>
      
    </div>
  );
}

export default UserHomeNowShowing;
