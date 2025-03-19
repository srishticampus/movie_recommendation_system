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
import UserAbout from "./Components/User/UserAbout";
import UserContact from "./Components/User/UserContact";
import UserRecomendedmovie from "./Components/User/UserRecomendedmovie";
import { ToastContainer, Bounce } from "react-toastify";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminViewUsers from "./Components/Admin/AdminViewUsers";
import AdminLandingNavbar from "./Components/Navbar/AdminLandingNavbar";
import AdminLandingPage from "./Components/LandingPages/AdminLandingPage";
import AdminHome from "./Components/Admin/AdminHome";
import Adminviewmovies from "./Components/Admin/Adminviewmovies";
import AdminContact from "./Components/Admin/AdminContact";
import MovieDetailedPage from "./Components/Admin/MovieDetailedPage";
import UseViewAllMovieList from "./Components/User/UseViewAllMovieList";
import UserViewWatchedMovie from "./Components/User/UserViewWatchedMovie";
import SavedMoviesList from "./Components/User/SavedMoviesList";
import UserViewMovieDetails from "./Components/User/UserViewMovieDetails";

function App() {
  return (
    <>
    <ToastContainer position="top-right" transition={Bounce} autoClose={3000} />
     <Routes>
      <Route path="/" element={< LandingPage />} />
      <Route path="/aboutUs" element={< Aboutus />} />
      <Route path="/contact" element={< ContactUs />} />
      <Route path="/user-login" element={< UserLogin />} />
      <Route path="/user-register" element={<UserRegister/>}/>
      <Route path="/user_forgot_password" element={<UserForgotPassword/>}/>
      <Route path="/user_reset_password" element={<UserResetPassword/>}/>
      <Route path="/user-home" element={<UserHome/>}/>
      <Route path="/user-about" element={<UserAbout/>} />
      <Route path="/user-contact" element={<UserContact/>} />
      <Route path="/user-recommendedmovie" element={<UserRecomendedmovie/>} />
      <Route path="/user-view-all-movie" element={<UseViewAllMovieList/>} />
      <Route path="/user-view-watched-movie" element={<UserViewWatchedMovie/>} />
      <Route path="/user-saved-movies" element={<SavedMoviesList/>} />
      <Route path="/user-view-movies-details" element={<UserViewMovieDetails/>} />

      <Route path="/admin-login" element={<AdminLogin/>} />
      <Route path="/admin-viewusers" element={<AdminViewUsers/>} />
      <Route path="/admin-home" element={<AdminHome/>} />
      <Route path="/admin-viewmovies" element={<Adminviewmovies/>} />
      <Route path="/admin-contact" element={<AdminContact/>} />
      <Route path="/admin-view-movie-details" element={<MovieDetailedPage/>} />

</Routes>
    </>
  )
}

export default App
