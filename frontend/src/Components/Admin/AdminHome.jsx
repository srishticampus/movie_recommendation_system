import { toast } from "react-toastify";
import "../LandingPages/Landingpage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FooterLandingPage from "../LandingPages/FooterLandingPage";
import AdminNavbar from "./AdminNavbar";
import "./AdminHome.css";
import Card from "react-bootstrap/Card";
import Star from "../../assets/Star.png";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function AdminHome() {
  const [value1, setValue1] = useState(1000); // Initial value for circle 1
  const [value2, setValue2] = useState(1000); // Initial value for circle 2
  const [value3, setValue3] = useState(1000); // Initial value for circle 3

  const maxValue = 2000; // Maximum value
  const circleSize = 200; // The new size for the circle (width and height)
  const radius = circleSize / 2; // Radius is half the size
  const circumference = 2 * Math.PI * radius; // Calculate the dynamic circumference

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-5 p-5">
        <p className="admin-dashboard-movie-head">Analytics</p>
        <div className="card p-4">
          <div className="row circle-row">
            {/* Circle 1 */}
            <div
              className="circle-container"
              // onWheel={(e) => handleScroll(e, setValue1)} // Listen for the scroll event
            >
              <div className="progress-ring-wrapper">
                <svg
                  className="progress-ring"
                  width={circleSize}
                  height={circleSize}
                >
                  <circle
                    className="background"
                    cx={radius}
                    cy={radius}
                    r={radius}
                    stroke="#ddd"
                  />
                  <circle
                    className="foreground"
                    cx={radius}
                    cy={radius}
                    r={radius}
                    stroke="#4CAF50"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - (value1 / maxValue) * circumference
                    }
                  />
                </svg>
              </div>
              <div className="circle-value">{Math.round(value1)}</div>
              <div className="circle-label">Total Number of Movies</div>
            </div>

            {/* Circle 2 */}
            <div
              className="circle-container"
              // onWheel={(e) => handleScroll(e, setValue2)} // Listen for the scroll event
            >
              <div className="progress-ring-wrapper">
                <svg
                  className="progress-ring"
                  width={circleSize}
                  height={circleSize}
                >
                  <circle
                    className="background"
                    cx={radius}
                    cy={radius}
                    r={radius}
                    stroke="#ddd"
                  />
                  <circle
                    className="foreground"
                    cx={radius}
                    cy={radius}
                    r={radius}
                    stroke="#4CAF50"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - (value2 / maxValue) * circumference
                    }
                  />
                </svg>
              </div>
              <div className="circle-value">{Math.round(value2)}</div>
              <div className="circle-label">Total Number of Users</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5 pt-5">
        <div className="row mt-5">
          <div className="col">
            <h4>Top Trending Movies</h4>
          </div>
        </div>
        <div>
          <Card className="separatemoviecard">
            <Card.Img variant="top" src={Star} />
            <Card.Body>
              <Card.Title>Demonte 2</Card.Title>
              <div className="row">
                <div className="col-7">Horror, Comedy </div>
                <div className="col-5">
                  {" "}
                  <img
                    src={Star}
                    alt="Star"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <small>7.7/10</small>
                </div>
              </div>

              <div className="mt-2 text-secondary">
                <small>2hr 26min</small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="container mt-5 pt-5">
        <div className="row mt-5">
          <div className="col">
            <h4>Newly Added Movies</h4>
          </div>
        </div>
        <div>
          <Card className="separatemoviecard">
            <Card.Img variant="top" src={Star} />
            <Card.Body>
              <Card.Title>Demonte 2</Card.Title>
              <div className="row">
                <div className="col-7">Horror, Comedy </div>
                <div className="col-5">
                  {" "}
                  <img
                    src={Star}
                    alt="Star"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <small>7.7/10</small>
                </div>
              </div>

              <div className="mt-2 text-secondary">
                <small>2hr 26min</small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="landing_sec_5">
        <FooterLandingPage />
      </div>{" "}
    </div>
  );
}

export default AdminHome;
