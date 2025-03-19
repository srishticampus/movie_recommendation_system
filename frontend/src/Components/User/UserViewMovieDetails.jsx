import { CardGroup, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import a from "../../assets/Aboutus_Background.png";
import "../Admin/Moviedetails.css";
import star from "../../assets/Star.png"
import { FaRegBookmark } from "react-icons/fa6";
import { IoMdPlay } from "react-icons/io";
import UserNavbar from "./Usernavbar";

function UserViewMovieDetails() {
  return (
    <div>
    <UserNavbar/>
    <div className='customermovieviewdetailssect1'>
        <img src={a} alt="demontebgimg" id='customermovieviewdetailssect1bgimg'/>
        <div className='customermovieviewdetailssect1details'>
            <Row>
                <Col sm={2} className='customermovieviewdetailssect1detailscol1'>
                <img src={a} alt='demonteposter' id='customermovieviewdetailssect1posterimg'/>
                </Col>
                <Col className='customermovieviewdetailssect1detailscol2'>
                
    
                    <div id="customermovieviewdetailsdemontename">Demonte Colony 2 &nbsp;
                    <button id="customermovieviewdetailsdemonterating"><img src={star} alt='star'/><span id="customermovieviewdetailsdemonteratingvalue">&nbsp;7.7</span><span id="customermovieviewdetailsdemonteratingtotal">/10</span></button>
                    </div>
                    <div>
                        <button className="customermovieviewdetailsdemontemovietype">2D, 3D</button>&nbsp;
                        <button className="customermovieviewdetailsdemontemovietype">Tamil, Telugu</button>
                    
                    <div id="customermovieviewdetailsdemontemoviegenre">Horror, Comedy</div>
                    <div id="customermovieviewdetailsdemontemovietime">2hr 26min</div>
                    <div>
                    <button id="customermovieviewdetailsdemontewatchnowbtn"><IoMdPlay />&nbsp;Watch Now</button>&nbsp;
                    <button id="customermovieviewdetailsdemontemarkbtn">&nbsp;Mark as Watched</button>&nbsp;
                    <button id="customermovieviewdetailsdemontebookmark"><FaRegBookmark /></button>
                    </div>
                </div>
                </Col>
            </Row>
        </div>
        
</div>
      <div className="customermoviedescsect">
        <div className="customermoviedescsectheading">Movie Description</div>
        <br />
        <div className="customermoviedescsectcontent">
          A horror-thriller film about a group of friends who return to a cursed
          location to uncover the truth behind the malevolent spirits that
          reside there
        </div>
        <br />
        <br />

        <div className="customermoviedescsectheading">Cast</div>
        <div className="customermoviedescsectcastcardsect">
          <CardGroup className="customermoviedescsectcastcardgroup">
            <Card className="customermoviedescsectcastsinglecard">
              <Card.Img src={a} className="customermoviedescimg" />
              <Card.Body>
                <Card.Title className="customermoviecardtitle">
                  Priya Bhavani
                </Card.Title>
                <Card.Text className="customermoviecardtext">Actress</Card.Text>
              </Card.Body>
            </Card>
            <Card className="customermoviedescsectcastsinglecard">
              <Card.Img src={a} className="customermoviedescimg" />
              <Card.Body>
                <Card.Title className="customermoviecardtitle">
                  Arulnithi
                </Card.Title>
                <Card.Text className="customermoviecardtext">Actor</Card.Text>
              </Card.Body>
            </Card>
            <Card className="customermoviedescsectcastsinglecard">
              <Card.Img src={a} className="customermoviedescimg" />
              <Card.Body>
                <Card.Title className="customermoviecardtitle">
                  Meenakshi
                </Card.Title>
                <Card.Text className="customermoviecardtext">Actress</Card.Text>
              </Card.Body>
            </Card>
          </CardGroup>
        </div>

        <div>
          <Row>
            <Col className="customermoviedescsectratingdisplaycol" sm={10}>
              <div className="customermoviedescsectheading">
                Ratings & Review
              </div>
              <br />
              <div className="customermoviedescsectratingcardsect">
                <CardGroup className="customermoviedescsectratingcardgroup">
                  <Row className="customermoviedescsectratingcardgrouprow">
                    <Card className="customermoviedescsectratingsinglecard">
                      <div className="customermovieratingcardheader">
                        <img src={a} alt="ratinguser"style={{width:"25px", height:"25px"}} />
                        &nbsp;John Merfin
                      </div>
                      <div className="customermovieratingcardbody">
                        <div className="customermoviedescsectratingcardtext">
                          A horror-thriller film about a group of friends who
                          return to a cursed location to uncover the truth
                          behind the malevolent spirits that reside there
                        </div>
                        <br />
                      </div>
                      <div className="customermoviedescsectratingcardfooter">
                        Feb, 2024
                      </div>
                    </Card>
                  </Row>
                  <Row className="customermoviedescsectratingcardgrouprow">
                    <Card className="customermoviedescsectratingsinglecard">
                      <div className="customermovieratingcardheader">
                        <img src={a} alt="ratinguser" style={{width:"25px", height:"25px"}}/>
                        &nbsp;John Merfin
                      </div>
                      <div className="customermovieratingcardbody">
                        <div className="customermoviedescsectratingcardtext">
                          A horror-thriller film about a group of friends who
                          return to a cursed location to uncover the truth
                          behind the malevolent spirits that reside there
                        </div>
                        <br />
                      </div>
                      <div className="customermoviedescsectratingcardfooter">
                        Feb, 2024
                      </div>
                    </Card>
                  </Row>

                  <Row className="customermoviedescsectratingcardgrouprow">
                    <Card className="customermoviedescsectratingsinglecard">
                      <div className="customermovieratingcardheader">
                        <img src={a} alt="ratinguser" style={{width:"25px", height:"25px"}} />
                        &nbsp;John Merfin
                      </div>
                      <div className="customermovieratingcardbody">
                        <div className="customermoviedescsectratingcardtext">
                          A horror-thriller film about a group of friends who
                          return to a cursed location to uncover the truth
                          behind the malevolent spirits that reside there
                        </div>
                        <br />
                      </div>
                      <div className="customermoviedescsectratingcardfooter">
                        Feb, 2024
                      </div>
                    </Card>
                  </Row>
                </CardGroup>
              </div>
            </Col>

            <Col className="customermoviedescsectaverageratingdisplaycol">
              <center>
                <button id="customermoviedescsectratingbtn">Rate Now</button>
                <div className="customermoviedescsectratingbtntitle">
                  Ratings
                </div>
                <div id="customermoviedescsectcurrentrating">
                  7.7
                  <span id="customermoviedescsectratingtotal">/10</span>
                </div>
                <div className="customermoviedescsectratingcount">
                  123 Rating and 45 Reviews
                </div>
              </center>
            </Col>
          </Row>
        </div>

        <div>
          <div className="customermoviedescsectheading">You May Also Like</div>
          <div className="customermoviedescsectrecommendcardsect">
              <Card className="customermoviedescsectrecommendsinglecard">
                <Card.Img
                  src={a}
                  className="customermoviedescrecommendmovieimg"
                />
                <Card.Body>
                  <Card.Title className="customermovierecommendcardtitle">
                    Poovan
                  </Card.Title>
                  <Card.Text className="customermovierecommendcardtext">
                    Comedy,Drama
                    <br />
                    2hr 18min
                  </Card.Text>
                </Card.Body>
              </Card>
             
          </div>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default UserViewMovieDetails;
