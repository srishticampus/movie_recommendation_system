import { useEffect, useState } from "react";
import "./UserNavbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Vector (1).png";
import { toast } from "react-toastify";
import arrow from "../../assets/redArrow.png";
import profile from "../../assets/userprofile.png";
import save from "../../assets/Frame.png";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { FaCamera } from "react-icons/fa";
import Offcanvas from "react-bootstrap/Offcanvas";
import { getUserProfile, updateUserProfile } from "../../Services/apiService"; // Import the functions
import "./CustProfile.css";

function UserNavbar() {
  const navigate = useNavigate();
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchInfo, setSearchInfo] = useState("");
  const [searcResults, setSearchResults] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [data, setData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    profile_pic: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [errors, setErrors] = useState({});
  const [profilePreview, setProfilePreview] = useState("");
  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response.success) {
          setData({
            full_name: response.data.full_name,
            email: response.data.email,
            phone_number: response.data.phone_number,
            profile_pic: response.data.profile_pic,
          });
          setProfilePreview(response.data.profile_pic || ""); // Set profile picture preview
        } else {
          toast.error("Failed to fetch profile data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching profile data.");
      }
    };

    fetchUserProfile();
  }, []);

  // Handle input changes in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
      setData((prev) => ({ ...prev, profilePic: file }));
    }
  };

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;

    if (!data.full_name) {
      newErrors.full_name = "Name is required";
    }
    if (!data.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!phoneRegex.test(data.phone_number)) {
      newErrors.phone_number = "Enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("phone_number", data.phone_number);
      if (data.profilePic) {
        formData.append("profile_pic", data.profilePic); // Append the file
      }

      // Call the updateUserProfile function with the FormData object
      const response = await updateUserProfile(formData);
      if (response.success) {
        toast.success("Profile updated successfully!");
        setShowEditModal(false);
        // Refresh profile data after update
        const profileResponse = await getUserProfile();
        if (profileResponse.success) {
          setData({
            full_name: profileResponse.data.full_name,
            email: profileResponse.data.email,
            phone_number: profileResponse.data.phone_number,
            profile_pic: profileResponse.data.profile_pic,
          });
          setProfilePreview(profileResponse.data.profile_pic || "");
        }
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast.success("Logged out successfully");
    navigate("/");
  };

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
              <Link className="nav-link text-light" to="/user-home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/user-about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/user-view-all-movie">
                Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/user-recommendedmovie">
                Recommended Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/user-view-watched-movie">
                Watched Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/user-contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Profile and Logout */}
        <div className="d-flex align-items-center">
          <Dropdown className="d-inline bg-dark me-5 btn-outline-dark">
            <Dropdown.Toggle variant="bg-dark text-dark">
              <a className="text-light text-decoration-none">
                <img src={profile} alt="Profile" />
              </a>
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-2">
              <Dropdown.Item onClick={handleShow}>Profile</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Profile Modal */}
      <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-dark">
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <div className="bg-dark">
          <div>
            <img
              className="userprofileimhg rounded-circle"
              src={profilePreview}
              alt="Profile"
              style={{ width: "150px", height: "150px" }}
            />
            <div className="row">
              <div className="col-2"></div>
              <div className="col-2"></div>
              <div className="col-2 my-3 text-center">
                <h4 className="profileusername">{data.full_name}</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-6 ms-2">
                <p>
                  <div className="text-light ms-3">Name: </div>
                  <b className="text-white">{data.full_name}</b>
                </p>
              </div>
              <div className="col-6 ms-2">
                <p>
                  <div className="text-light ms-3">E-mail: </div>
                  <b className="text-white">{data.email}</b>
                </p>
              </div>
              <div className="col-6 ms-2">
                <p>
                  <div className="text-light ms-3">Phone: </div>
                  <b className="text-white">{data.phone_number}</b>
                </p>
              </div>
              <div className="text-center text-light">
                <button onClick={handleModalShow} className="btn btn-danger">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas>

      {/* Edit Profile Modal */}
      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalbg">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-4"></div>
              <div className="col-3 w-25">
                <img
                  className="editprofileimhg rounded-circle"
                  src={profilePreview}
                  alt="Profile Preview"
                  style={{ width: "150px", height: "150px" }}
                />
                <div className="camera-icon">
                  <FaCamera
                    onClick={() => document.getElementById("fileInput").click()}
                    style={{ cursor: "pointer", fontSize: "24px", marginTop: "10px" }}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="file"
                    id="fileInput"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    name="profile_pic"
                  />
                  {errors.profile_pic && (
                    <span className="text-danger">{errors.profile_pic}</span>
                  )}
                </div>
              </div>
              <div className="col-3"></div>
            </div>
            <div className="row">
              <div className="">
                <div className="mb-3">
                  <label className="text-light">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="full_name"
                    value={data.full_name || ""}
                    onChange={handleInputChange}
                  />
                  {errors.full_name && (
                    <span className="text-danger">{errors.full_name}</span>
                  )}
                </div>
                <div className="mb-3">
                  <label className="text-light">Phone number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone_number"
                    value={data.phone_number || ""}
                    onChange={handleInputChange}
                  />
                  {errors.phone_number && (
                    <span className="text-danger">{errors.phone_number}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-4 justify-content-end">
                <button type="button" className="btn btn-secondary ms-2 mt-3" onClick={handleModalClose}>
                  Cancel
                </button>
              </div>
              <div className="col-5">
                <button type="submit" className="btn btn-danger ms-2 mt-3">
                  Update
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </nav>
  );
}

export default UserNavbar;