import { useEffect, useState } from "react";
import "./UserNavbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Vector (1).png";
import { toast } from "react-toastify";
import { IMG_BASE_URL } from "../../Services/BaseURL";
import { resetPassword, ViewById } from "../../Services/CommonServices";
import arrow from '../../assets/redArrow.png';
import './CustProfile.css'
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

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);
  useEffect(() => {
    if (localStorage.getItem("user") == null) {
      navigate("/");
    }
  }, [navigate]);
  const fetchData = async () => {
    try {
        const result = await ViewById('viewUserById',localStorage.getItem('user'));

        if (result.success) {
            console.log(result);
            if (result.user){
                setdata(result.user);
            setSelectedImage(`${IMG_BASE_URL}/${result.user.profilePic.filename}`); // Set initial image
            }
            else
                setdata(null)
        } else {
            console.error('Data error:', result);
            toast.error(result.message);
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred during Data View');
    }
};
  useEffect(() => {
    
    
    fetchData(); // Call the async function
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
      profilePic
      : file,
    });
  };
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!data.name.length>0) {
        console.log("here");

        newErrors.name = 'Name is required';
    }
   
    else  if (!phoneRegex.test(data.contact)) {
      newErrors.contact = 'Enter a valid Contact Number';

  }
  if (!data.email) {
      

      newErrors.email = 'Email is required';
  }
  else  if (!emailRegex.test(data.email)) {
      newErrors.email = 'Enter a valid E-mail Id';

  }
    if (!data.contact) {
        newErrors.contact = 'Contact is required';
    }
    
  

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
const handleLogin = async (e) => {
    e.preventDefault()
    console.log(errors);

    console.log("api called", validate());

    if (!validate()) {
        toast.error('Please fix the errors in the form.');
        return;
    }

    try {
        const result = await resetPassword(data, 'editUserById',localStorage.getItem('user'));

        if (result.success) {
            console.log(result);

            toast.success('Profile Updated successfully !');
            navigate('/user-home');


        } else {
            console.error('Registration error:', result);
            toast.error(result.message);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred during Registration');
    }
}; 
  useEffect(() => {
    if (localStorage.getItem("user") == null) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out Succesfully')
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  const handleSearchIconClick = () => {
    setShowSearchBox(!showSearchBox);
    setSearchResults([])
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
        <span className="text-danger">Maxus</span>Cinemas
      </span>
    </Link>

    {/* Menu Options */}
    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
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
          <Link className="nav-link text-light" to="/user-now-showing">
            Book Ticket
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/user_add_complaint">
            My Bookings
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/user_add_complaint">
            Feedback
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-light" to="/user-contact">
            Contact
          </Link>
        </li>
      </ul>
    </div>

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
            <Link className="dropdown-item"  onClick={handleProfileClick}>
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
  <div className="modal fade show d-block" tabIndex="-1" >
    <div className="modal-dialog" style={{ marginTop: "1px" ,maxWidth: "400px", width: "100%", marginTop: "10px"}}>
      <div className="modal-content">
        <div className="modal-header d-flex justify-content-between align-items-center">
          <button 
            type="button" 
            className="btn btn-link text-dark" 
            onClick={closeModal}
            style={{ fontSize: "1.5rem", fontWeight: "bold", textDecoration: "none" }}
          
          >
           <img src={arrow}/>
          </button>
          <img 
 src={selectedImage || `${IMG_BASE_URL}/${data.profilePic.filename}`}            className="img-fluid cust-pro-image-rounded" 
            alt="User"  style={{ marginTop: "-21px" }}
            
          />
        </div>
        <div className="modal-body text-center">
          <p className="cust-pro-name-color"><strong> {data.name}</strong></p>
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
          <button
    className="bg_red"   onClick={openEditModal}>Edit</button>
        </div>
       
      </div>
    </div>
  </div>
)}
{showEditModal && (
  <div className="modal fade show d-block" tabIndex="-1">
    <div 
      className="modal-dialog custom-modal-dialog" 
      style={{ marginTop: "1px", maxWidth: "420px", width: "100%" ,maxHeight:'200px' }}
    >
      <div className="modal-content">
     
        <div className="modal-header d-flex align-items-center justify-content-between" style={{  color: "white" }}>
          <button 
            type="button" 
            className="btn btn-link text-white" 
            onClick={closeEditModal}
            style={{ fontSize: "1.5rem", fontWeight: "bold", textDecoration: "none",marginTop:'0px' }}
          >
            <img src={arrow} alt="Back Arrow" />
          </button>
          <h5 className="cust-prof-modal-title" >Edit Profile</h5>
        </div>

        {/* Image Section */}
        <div 
  className="d-flex flex-column align-items-center py-4" 
  style={{ color: "white",marginTop:'0px' }}
>
  <div className="position-relative">
    {/* Profile Picture */}
    <img 
       src={selectedImage || `${IMG_BASE_URL}/${data.profilePic.filename}`}      className="cust-pro-image-rounded" 
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
        cursor: "pointer"
      }}
      onClick={() => document.getElementById("profileImageInput").click()}
      ></i>
  </div>
</div>


        {/* Body Section */}
        <div className="modal-body" style={{marginTop:'0px'}}>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
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
              <label htmlFor="email" className="form-label">Email</label>
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
              <label htmlFor="contact" className="form-label">Phone Number</label>
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

        {/* Footer Section */}
        <div className="modal-footer">
          <button type="button" className="bg_red" onClick={handleLogin}>Save</button>
          <button 
            type="button" 
            className="bg_red_outline" 
            onClick={closeEditModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
</nav>

  );
}

export default UserNavbar;
