import "../LandingPages/Contactus.css"
import Phone from '../../assets/Phone.png';
import Mail from '../../assets/Mail.png';
import location from '../../assets/location.png';
import FooterLandingPage from "../LandingPages/FooterLandingPage";
import UserNavbar from "./Usernavbar";
import "../LandingPages/Landingpage.css"


function UserContact() {
  return (
    <>
    <UserNavbar/>
      <div className="Contact_Us_Background">
        <div className='Section_one'>
          <p className='sec_one_headingone'>contact us</p>
          <p className='sec_one_headingtwo'>We're Here to Help!</p>
          <p className='sec_one_para'>Whether you have a question, need support, or want to provide feedback, we’re here to ensure you have the best movie experience possible. <br />Reach out to us through any of the options below, and our team will get back to you promptly.</p>
        </div>

        <div className="Contactus_Section_two">
          <div className='container'>
            <div className="row">

              <div className="col-sm-6">
                <div className="card Section-two_left_card">
                  <div className="card-header">
                    <h5 className='Section-two_left_card_header'>Get in Touch</h5>
                  </div>
                  <div className="card-body">
                    <form>

                      <div className="card  mb-4">
                        <input
                          type="text"
                          className="form-control Section-two_left_card_inputfield"
                          id="name"
                          placeholder="Name"
                        />
                      </div>

                      <div className="mb-4">
                        <input
                          type="email"
                          className="form-control Section-two_left_card_inputemail"
                          id="email"
                          placeholder="E-Mail"
                        />
                      </div>

                      <div className="mb-3">
                        <textarea
                          className="form-control Section-two_left_card_inputtextarea"
                          rows="7"
                          placeholder="Description"
                        />
                      </div>
                    </form>
                  </div>
                  <div className="card-footer d-flex justify-content-center">

                    <button className="btn btn-danger submit_button" type="submit">
                      Submit
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 ">
                <div className='row'>
                  <div className='col-sm-12 d-flex justify-content-around'>
                    <div className='card Section-two_right_card_one'>
                      <div className='Section-two_right_card_one_content'>
                        <img src={Phone} className="Phone_Icon" alt="Phone" />
                        <div>
                          <p className='Phone_number'>+91 9855582455, 2545822</p>
                          <p className='Available_Monday'>Available Monday to Friday,<br />9AM-6PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-12 d-flex justify-content-around'>
                    <div className='card Section-two_right_card_two'>
                      <div className='Section-two_right_card_two_content'>
                        <img src={Mail} className='Mail_Icon' alt='mail' />
                        <div>
                          <p className='email'>maxuscinemas@gmail.com</p>
                          <p className='We_will_Respond'>We will respond within 24 <br /> hours on weekdays</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-12 d-flex justify-content-around'>
                    <div className='card Section-two_right_card_three'>
                      <div className='Section-two_right_card_three_content'>
                        <img src={location} className='Location_Icon' alt='location' />
                        <div>
                          <p className='headquarter'>Smart Theatre Headquarters</p>
                          <p className='Cinema_Avenue'>1234 Cinema Avenue, Suite 567</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>

      <div className='Section-three'>
      <FooterLandingPage />
      </div>


      

      </div>
    </>
  )
}






export default UserContact