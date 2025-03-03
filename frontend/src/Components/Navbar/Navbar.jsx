import './Navbar.css';
import logo from '../../assets/Vector (1).png';
import { Link } from "react-router";
function Navbar() {
  return (
    <div><div className="landing_nav"> 
    <div className="landing_nav_logo">
      <Link to='/' className="nav-link">
        <img src={logo} alt="logo" />
        <p><span className="logo_red">Movietox</span></p>
      </Link>
    </div>
    <div className="landing_nav_links">
      <div className="landing_nav_login">
        <Link to='/' className="nav-link"><p>Home</p></Link>
      </div>
      
      <div className="landing_nav_login">
        <Link to='/aboutUs' className="nav-link"><p>About</p></Link>
      </div>
      <div className="landing_nav_login">
        <Link to='/contact' className="nav-link"><p>Contact</p></Link>
      </div>
      <div className="landing_nav_login">
        <Link to='/user-login' className="nav-link nav-button"><p className="nav-button-p">Login</p></Link>
      </div>
    </div>
  </div></div>
  )
}

export default Navbar