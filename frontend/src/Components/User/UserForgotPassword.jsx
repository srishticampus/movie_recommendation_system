import { useState } from "react";
import {   useNavigate } from "react-router";
import { toast } from "react-toastify";
import "./UserLogin.css";

function UserForgotPassword(){
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(data.email)) newErrors.email = "Enter a valid email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    // try {
    //   const result = await login(data, "loginUser");
    //   if (result.success) {
    //     localStorage.setItem("user", result.user._id);
    //     toast.success("Login successful!");
    //     navigate("/user-home");
    //   } else {
    //     toast.error(result.message);
    //   }
    // } catch (error) {
    //   toast.error("An unexpected error occurred during Login",error)
    // }
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
              <p className="UserLoginHead">Forget Password?</p>
              <form onSubmit={onSubmit}>
              <label>Enter your E-mail below to receive your password reset instruction</label>
                <label>Email ID</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="form-control user_inp"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="text-danger">{errors.email}</span>}
                <div className="text-center">
                  <button type="submit" className="button_bglogin mt-2">Next   </button>
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

export default UserForgotPassword
