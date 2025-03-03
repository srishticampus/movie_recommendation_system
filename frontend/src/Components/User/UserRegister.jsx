import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri"; // Import eye icons
import "./UserLogin.css";
import { registerWithFile } from "../../Services/CommonServices";

function UserRegister() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!data.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(data.email)) newErrors.email = "Invalid email format";

    if (!data.name) newErrors.name = "Name is required";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      const result = await registerWithFile(data, "registerUser");

      if (result.success) {
        toast.success("Registration successful!");
        navigate("/user-login");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred during Registration",error)
    }
  };

  return (
    <div className="loginbanner">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12 loginbanner_right_box">
            <div className="user_reg_container">
              <p className="UserLoginHead">Sign Up!</p>
              <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Your Name"
                  value={data.name}
                  onChange={handleChange}
                  className="form-control user_inp"
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}


                <label>Email ID</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={data.email}
                  onChange={handleChange}
                  className="form-control user_inp"
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}

                {/* Password Field */}
                <label>Password</label>
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
                {errors.password && <div className="text-danger">{errors.password}</div>}

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
                {errors.cpassword && <div className="text-danger">{errors.cpassword}</div>}

                <div className="text-center">
                  <button type="submit" className="button_bglogin mt-2">Sign Up</button>
                  <h6 className="mt-4 text-light">
                    Already have an account?
                    <Link to="/user-login" className="text-light text-decoration-none mb-5"> Login</Link>
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

export default UserRegister;
