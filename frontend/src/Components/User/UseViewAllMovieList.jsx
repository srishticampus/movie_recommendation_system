import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Star from "../../assets/Star.png";
import UserNavbar from "./Usernavbar";
import Form from 'react-bootstrap/Form';

function UseViewAllMovieList() {
  return (
    <div>
      <UserNavbar />
      <div className="container mt-5 pt-5">
      <div className='row mt-5'>
      <div className='col'>
          <h4>All Movies</h4>
      </div>
      <div className='col '>
          <Form className="searchbar1">
              <Form.Control
                  type="search"
                  placeholder="Search Here... "
                  aria-label="Search"

              /> </Form>
      </div>
  </div>
        <center>
          <span className="headingtwo">Filter</span>
          <select name="finestatus" className="moviedropdowntab">
            <option>Genre</option>
            <option>.</option>
            <option>.</option>
          </select>
          <select name="finestatus" className="moviedropdowntab">
            <option>Year</option>
            <option>.</option>
            <option>.</option>
          </select>
          <select name="finestatus" className="moviedropdowntab">
            <option>Language</option>
            <option>.</option>
            <option>.</option>
          </select>
          <select name="finestatus" className="moviedropdowntab">
            <option>Rating</option>
            <option>.</option>
            <option>.</option>
          </select>
          <Button variant="danger" className="moviesearchtab">
            Search
          </Button>
        </center>
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
    </div>
  );
}

export default UseViewAllMovieList;
