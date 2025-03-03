import { useState } from "react";
import {   useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../Services/CommonServices";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri"; // Import eye icons
import "./UserLogin.css";

function UserResetPassword(){
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showCPassword, setShowCPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  }

  const validate = () => {
    const newErrors = {};

    const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!data.password) {
        newErrors.password = "Password is required";
      } else if (!passwordRegex.test(data.password)) {
        newErrors.password =
          "Password must contain 1 uppercase, 1 symbol, and 1 number with a minimum of 6 characters.";
      }
  
      if (!data.cpassword) {
        newErrors.cpassword = "Confirm Password is required";
      } else if (data.password !== data.cpassword) {
        newErrors.cpassword = "Password and Confirm Password must be the same!";
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

    try {
      const result = await login(data, "loginUser");
      if (result.success) {
        localStorage.setItem("user", result.user._id);
        toast.success("Login successful!");
        navigate("/user-home");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred during Login",error)
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginbanner">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 loginbanner_right_box">
            <div className="user_reg_container">
              <p className="UserLoginHead">Reset Password</p>
              <form onSubmit={onSubmit}>
              <label>New Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Your Password"
                  value={data.password}
                  onChange={handleChange}
                  className="form-control user_inp"
                />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </span>
              </div>
              {errors.password && <span className="text-danger">{errors.password}</span>}

              {/* Confirm Password Field */}
              <label>Confirm Password</label>
              <div className="password-container">
                <input
                  type={showCPassword ? "text" : "password"}
                  name="cpassword"
                  placeholder="Confirm Password"
                  value={data.cpassword}
                  onChange={handleChange}
                  className="form-control user_inp"
                />
                <span className="eye-icon" onClick={toggleCPasswordVisibility}>
                  {showCPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </span>
              </div>
              {errors.cpassword && <span className="text-danger">{errors.cpassword}</span>}
                <div className="text-center">
                  <button type="submit" className="button_bglogin mt-2">Confirm</button>
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

export default UserResetPassword
