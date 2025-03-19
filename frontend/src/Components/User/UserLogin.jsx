import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri"; // Import eye icons
import "./UserLogin.css";
import { login } from "../../Services/apiService";
import Navbar from "../Navbar/Navbar";

function UserLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" }); //hook
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!passwordRegex.test(data.password)) {
      newErrors.password =
        "Password must be at least 6 characters long and include at least one letter, one number, and one special character.";
    }

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
    if (result.success == true) {
      navigate("/user-home");
    }
  };
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginbanner">
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 loginbanner_right_box">
            <div className="user_reg_container">
              <p className="UserLoginHead">LogIn!</p>
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
                {errors.email && (
                  <div className="text-danger">{errors.email}</div>
                )}

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
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}

                <div className="d-flex justify-content-end mt-2">
                  <h6>
                    <Link
                      to="/user_forgot_password"
                      className="text-light text-decoration-none"
                    >
                      Forgot Password?
                    </Link>
                  </h6>
                </div>
                <div className="text-center">
                  <button type="submit" className="button_bglogin mt-2">
                    Sign In
                  </button>
                  <h6 className="mt-4 text-light">
                    Don’t have an account?
                    <Link
                      to="/user-register"
                      className="text-light text-decoration-none"
                    >
                      {" "}
                      Sign Up Now
                    </Link>
                  </h6>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 loginbanner_left_box"></div>
          <div className="col-lg-4 col-md-6 col-sm-12 loginbanner_left_box">
            <h1>WELCOME to MAXMUS</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
