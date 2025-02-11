import { Routes, Route } from "react-router";
import './App.css'
import Navbar from "./Components/Navbar/Navbar";

function App() {
  

  return (
    <>
     <Routes>
      <Route path="/" element={< Navbar />} />
    </Routes>
    </>
  )
}

export default App
