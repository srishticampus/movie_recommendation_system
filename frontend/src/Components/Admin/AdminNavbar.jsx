import { useState } from "react";
import "../User/UserNavbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Vector (1).png";
import { logout } from "../../Services/apiService";
import { Modal, Button } from "react-bootstrap";
import "../User/CustProfile.css";

function AdminNavbar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout(); // Call the logout function from apiService
    navigate("/admin-login"); // Redirect to admin login page
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link className="navbar-brand" to="/admin-home">
            <img
              src={logo}
              alt="logo"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            <span className="ms-2 text-light">
              <span className="text-danger">Movietox</span>
            </span>
          </Link>

          {/* Menu Options */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/admin-home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/admin-viewmovies">Movies</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/admin-viewusers">Users</Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link text-light" to="/user_add_complaint">Reset Password</Link>
              </li> */}
              {/* <li className="nav-item">
                <Link className="nav-link text-light" to="/admin-contact">Contact</Link>
              </li> */}
            </ul>
          </div>

          {/* Logout Button */}
          <button className="btn btn-danger rounded-pill px-3" onClick={() => setShowLogoutModal(true)}>
            Logout
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdminNavbar;
