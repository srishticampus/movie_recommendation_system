import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri"; // Import eye icons
import "../User/UserLogin.css";
import { login } from "../../Services/apiService";
import logo from '../../assets/Vector (1).png';

function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Enter a valid email";
    }
  
    // if (!passwordRegex.test(data.password)) {
    //   newErrors.password = "Password must be at least 6 characters long and include at least one letter, one number, and one special character.";
    // }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }
      const result = await login(data);
      if(result.success==true){
        navigate("/admin-home")
      }
  }
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginbanner">
   <div><div className="landing_nav"> 
       <div className="landing_nav_logo">
         <Link to='/' className="nav-link">
           <img src={logo} alt="logo" />
           <p><span className="logo_red">Movietox</span></p>
         </Link>
       </div>
       <div className="landing_nav_links">
         <div className="landing_nav_login">
           <Link to='/admin-login' className="nav-link nav-button"><p className="nav-button-p">Login</p></Link>
         </div>
       </div>
     </div></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 loginbanner_right_box">
            <div className="user_reg_container">
              <p className="UserLoginHead">Admin LogIn!</p>
              <form onSubmit={onSubmit}>
                <label>Email ID</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="form-control user_inp"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}

                <label>Password</label>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Your Password"
                    className="form-control user_inp"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                  />
                  <span className="eye-icon" onClick={togglePasswordVisibility}>
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </span>
                </div>
                {errors.password && <div className="text-danger">{errors.password}</div>}

                <div className="d-flex justify-content-end mt-2">
                
                </div>
                <div className="text-center">
                  <button type="submit" className="button_bglogin mt-2">Sign In</button>
                
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 loginbanner_left_box"></div>
          <div className="col-lg-4 col-md-6 col-sm-12 loginbanner_left_box">
            <h1>WELCOME to Movietox</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
