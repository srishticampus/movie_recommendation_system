import { Routes, Route } from "react-router";
import './App.css'
// import Navbar from "./Components/Navbar/Navbar";
import LandingPage from "./Components/LandingPages/Landingpage";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import Aboutus from "./Components/LandingPages/AboutAs";
import ContactUs from "./Components/LandingPages/Contactus";
import UserLogin from "./Components/User/UserLogin";
import UserRegister from "./Components/User/UserRegister";
import UserForgotPassword from "./Components/User/UserForgotPassword";
import UserResetPassword from "./Components/User/UserResetPassword";
import UserHome from "./Components/User/UserHome";
function App() {
  return (
    <>
     <Routes>
      <Route path="/" element={< LandingPage />} />
      <Route path="/aboutUs" element={< Aboutus />} />
      <Route path="/contact" element={< ContactUs />} />
      <Route path="/user-login" element={< UserLogin />} />
      <Route path="/user-register" element={<UserRegister/>}/>
      <Route path="/user_forgot_password" element={<UserForgotPassword/>}/>
      <Route path="/user_reset_password" element={<UserResetPassword/>}/>
      <Route path="/user-home" element={<UserHome/>}/>

</Routes>
    </>
  )
}

export default App
