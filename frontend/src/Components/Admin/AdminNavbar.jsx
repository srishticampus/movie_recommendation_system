// import { useEffect, useState } from "react";
import "../User/UserNavbar.css";
import { Link } from "react-router";
import logo from "../../assets/Vector (1).png";
// import { toast } from "react-toastify";
// import arrow from "../../assets/redArrow.png";
// import profile from "../../assets/userprofile.png";
// import save from "../../assets/Frame.png";
// import Dropdown from "react-bootstrap/Dropdown";
// import Modal from "react-bootstrap/Modal";
// import { FaCamera } from "react-icons/fa";
// import Offcanvas from "react-bootstrap/Offcanvas";
import "../User/CustProfile.css";

function AdminNavbar() {
 

  
  // const handleLogout = () => {
  //   localStorage.removeItem("user");
  //   toast.success("Logged out Succesfully");
  //   setTimeout(() => {
  //     navigate("/");
  //   }, 300);
  // };

 

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Logo */}
        <Link className="navbar-brand" to="/user_home">
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
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/admin-home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/admin-viewmovies">
                Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/admin-viewusers">
               Users
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/user_add_complaint">
               Reset Password
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-light" to="/admin-contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
         
        </div>
            </div>
         
      
    </nav>
  );
}

export default AdminNavbar;
