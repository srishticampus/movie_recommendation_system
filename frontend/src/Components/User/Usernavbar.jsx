import { useEffect, useState } from "react";
import "./UserNavbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Vector (1).png";
import { toast } from "react-toastify";
import { IMG_BASE_URL } from "../../Services/BaseURL";
import { resetPassword, ViewById } from "../../Services/CommonServices";
import arrow from "../../assets/redArrow.png";
import profile from "../../assets/userprofile.png";
import save from "../../assets/Frame.png";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { FaCamera } from "react-icons/fa";
import Offcanvas from "react-bootstrap/Offcanvas";

import "./CustProfile.css";
function UserNavbar() {
  const navigate = useNavigate();
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchInfo, setSearchInfo] = useState("");
  const [searcResults, setSearchResults] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [data, setdata] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({});
  const [profilePreview, setProfilePreview] = useState("");
  const [userdata, setUserdata] = useState({
    username: "",
    userContact: "",
    userNumber: "",
    userPicture: null,
  });
  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  // const userid = localStorage.getItem("user");

  // const fetchUserDetails = async () => {
  //   try {
  //     const res = await (`/view_a_user/${userid}`);
  //     const data = res.data.data;
  //     setUser(data);
  //     setUserdata({
  //       ...data,
  //       userDate: data.userDate
  //         ? new Date(data.userDate).toISOString().split("T")[0]
  //         : "",
  //     });
  //     setProfilePreview(`${IMG_BASE_URL}/${data.userPicture?.filename}`);
  //   } catch (error) {
  //     console.error("Error fetching user details", error);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserdata((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);
  // useEffect(() => {
  //   if (localStorage.getItem("user") == null) {
  //     navigate("/");
  //   }
  // }, [navigate]);
  const fetchData = async () => {
    try {
      const result = await ViewById(
        "viewUserById",
        localStorage.getItem("user")
      );

      if (result.success) {
        console.log(result);
        if (result.user) {
          setdata(result.user);
          setSelectedImage(
            `${IMG_BASE_URL}/${result.user.profilePic.filename}`
          ); // Set initial image
        } else setdata(null);
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
    fetchData(); // Call the async function
    // fetchUserDetails()
  }, []);

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const closeModal = () => {
    setShowProfileModal(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("here");

    setdata({
      ...data,
      [name]: value,
    });
    // }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
      console.log("Selected file:", file);
    }
    setdata({
      ...data,
      profilePic: file,
    });
  };
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!data.name.length > 0) {
      console.log("here");

      newErrors.name = "Name is required";
    } else if (!phoneRegex.test(data.contact)) {
      newErrors.contact = "Enter a valid Contact Number";
    }
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Enter a valid E-mail Id";
    }
    if (!data.contact) {
      newErrors.contact = "Contact is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(errors);

    console.log("api called", validate());

    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      const result = await resetPassword(
        data,
        "editUserById",
        localStorage.getItem("user")
      );

      if (result.success) {
        console.log(result);

        toast.success("Profile Updated successfully !");
        navigate("/user-home");
      } else {
        console.error("Registration error:", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred during Registration");
    }
  };
  // useEffect(() => {
  //   if (localStorage.getItem("user") == null) {
  //     navigate("/");
  //   }
  // }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out Succesfully");
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file, "after changing");

    if (file) {
      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        setErrors((prev) => ({
          ...prev,
          userPicture: "Only JPG, JPEG, PNG, and GIF files are allowed",
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, userPicture: "" }));
      setUserdata((prev) => ({ ...prev, userPicture: file }));
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSearchIconClick = () => {
    setShowSearchBox(!showSearchBox);
    setSearchResults([]);
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
              <Link className="nav-link text-light" to="/user-recommendedmovie">
                Recommended Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/user_add_complaint">
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
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/user_add_complaint">
                <img src={save}></img>
              </Link>
            </li>
            <li className="nav-item">
              <Dropdown className="d-inline bg-dark me-5 btn-outline-dark">
                <Dropdown.Toggle variant="bg-dark text-dark">
                  {" "}
                  <a className="text-light text-decoration-none">
                    <img src={profile}></img>
                  </a>
                </Dropdown.Toggle>
                <Dropdown.Menu className="mt-2">
                  <Dropdown.Item>
                    <Link
                      className="text-decoration-none text-dark"
                      onClick={handleShow}
                    >
                      Profile
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link
                      onClick={handleLogout}
                      className="text-decoration-none text-dark "
                    >
                      Logout
                    </Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>
        <Offcanvas show={show} onHide={handleClose} placement="end"  className="bg-dark">
          <Offcanvas.Header
            className="profileheader"
            closeButton
          ></Offcanvas.Header>
          <div className="bg-dark">
            <div>
              {" "}
              <img
                src={`${IMG_BASE_URL}/${user?.dataPicture?.filename}`}
                className="userprofileimhg rounded-circle"
              ></img>
              <div className="row">
                <div className="col-2 "></div>
                <div className="col-2 "></div>
                <div className="col-2 my-3 text-center">
                  <h4 className="profileusername">{data?.username}</h4>
                </div>
              </div>
              <div className="row">
                <div className="col-6 ms-2">
                  <p>
                    <div className="text-light ms-3">Name : </div>
                    <b className="text-dark">{data?.userMail}</b>
                  </p>
                  </div>

                  <div className="col-6 ms-2">
                    <p>
                      <div className="text-light ms-3">E-mail : </div>
                      <b className="text-dark">{data?.userContact}</b>
                    </p>
                  </div>
                  <div className="text-center text-light">
                    <button onClick={handleModalShow} className="btn btn-danger ">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </Offcanvas>

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
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      } // Trigger click on hidden file input
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="file"
                      id="fileInput"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }} // Hide the input
                      name="userPicture"
                    />
                    {errors.userPicture && (
                      <span className="text-danger">{errors.userPicture}</span>
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
                      type="email"
                      id="inputdata"
                      className="form-control"
                      name="userMail"
                      value={userdata.userMail}
                      onChange={handleInputChange}
                    />
                    {errors.userMail && (
                      <span className="text-danger">{errors.userMail}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="text-light">E-mail</label>
                    <input
                      type="text"
                      className="form-control"
                      name="userAddress"
                      id="inputdata"
                      value={userdata.userAddress}
                      onChange={handleInputChange}
                    />
                    {errors.userAddress && (
                      <span className="text-danger">{errors.userAddress}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="text-light">Phone number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="userContact"
                      id="inputdata"
                      value={userdata.userContact}
                      onChange={handleInputChange}
                    />
                    {errors.userContact && (
                      <span className="text-danger">{errors.userContact}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-4 justify-content-end">
                  <button type="submit" className="btn btn-secondary ms-2 mt-3">
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

        {/* Search & Profile */}
        <div className="d-flex align-items-center">
          {showSearchBox && (
            <form className="d-flex me-3">
              <input
                className="form-control"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => setSearchInfo(e.target.value)}
              />
            </form>
          )}
          <i
            className="ri-search-line text-light me-3"
            onClick={handleSearchIconClick}
            style={{ cursor: "pointer" }}
          ></i>
          <div className="dropdown">
            <i
              className="ri-user-3-line text-light"
              data-bs-toggle="dropdown"
              style={{ cursor: "pointer" }}
            ></i>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
              <li>
                <Link className="dropdown-item" onClick={handleProfileClick}>
                  Profile
                </Link>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {showProfileModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div
            className="modal-dialog mt-5"
            style={{
              marginTop: "1px",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-link text-dark"
                  onClick={closeModal}
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  <img src={arrow} />
                </button>
                <img
                  src={
                    selectedImage ||
                    `${IMG_BASE_URL}/${data.profilePic.filename}`
                  }
                  className="img-fluid cust-pro-image-rounded"
                  alt="User"
                  style={{ marginTop: "-21px" }}
                />
              </div>
              <div className="modal-body text-center">
                <p className="cust-pro-name-color">
                  <strong> {data.name}</strong>
                </p>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="cust-pro-label-color">Phone Number</td>
                      <td className="cust-pro-label">: {data.contact}</td>
                    </tr>
                    <tr>
                      <td className="cust-pro-label-color">Email Id</td>
                      <td className="cust-pro-label">: {data.email}</td>
                    </tr>
                  </tbody>
                </table>
                <button className="bg_red" onClick={openEditModal}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div
            className="modal-dialog custom-modal-dialog"
            style={{
              marginTop: "1px",
              maxWidth: "420px",
              width: "100%",
              maxHeight: "200px",
            }}
          >
            <div className="modal-content">
              <div
                className="modal-header d-flex align-items-center justify-content-between"
                style={{ color: "white" }}
              >
                <button
                  type="button"
                  className="btn btn-link text-white"
                  onClick={closeEditModal}
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    textDecoration: "none",
                    marginTop: "0px",
                  }}
                >
                  <img src={arrow} alt="Back Arrow" />
                </button>
                <h5 className="cust-prof-modal-title">Edit Profile</h5>
              </div>

              {/* Image Section */}
              <div
                className="d-flex flex-column align-items-center py-4"
                style={{ color: "white", marginTop: "0px" }}
              >
                <div className="position-relative">
                  {/* Profile Picture */}
                  <img
                    src={
                      selectedImage ||
                      `${IMG_BASE_URL}/${data.profilePic.filename}`
                    }
                    className="cust-pro-image-rounded"
                    alt="User"
                  />
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    id="profileImageInput"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(e)}
                  />
                  {/* Pen Icon */}
                  <i
                    className="ri-edit-2-fill position-absolute"
                    style={{
                      bottom: "0",
                      right: "-10px",
                      fontSize: "1.5rem",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      padding: "5px",
                      color: "#3070F5",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      document.getElementById("profileImageInput").click()
                    }
                  ></i>
                </div>
              </div>

              {/* Body Section */}
              <div className="modal-body" style={{ marginTop: "0px" }}>
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={data.name}
                      onChange={handleChange}
                      placeholder={data.name}
                    />
                    {errors.name && (
                      <span className="text-danger">{errors.name}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      placeholder={data.email}
                    />
                    {errors.email && (
                      <span className="text-danger">{errors.email}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contact" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contact"
                      name="contact"
                      onChange={handleChange}
                      value={data.contact}
                      placeholder={data.contact}
                    />
                    {errors.contact && (
                      <span className="text-danger">{errors.contact}</span>
                    )}
                  </div>
                </form>
              </div>

              {/* Footer Section 
              <div className="modal-footer">
                <button type="button" className="bg_red" onClick={handleLogin}>
                  Save
                </button>
                <button
                  type="button"
                  className="bg_red_outline"
                  onClick={closeEditModal}
                >
                  Close
                </button>
              </div>*/}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default UserNavbar;
