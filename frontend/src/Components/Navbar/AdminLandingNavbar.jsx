import './Navbar.css';
import logo from '../../assets/Vector (1).png';
import { Link } from "react-router";
function AdminLandingNavbar() {
  return (
    <div className="landing_nav"> 
    <div className="landing_nav_logo">
      <Link to='/' className="nav-link">
        <img src={logo} alt="logo" />
        <p><span className="logo_red">Movietox</span></p>
      </Link>
    </div>

  </div>
  )
}

export default AdminLandingNavbar