import { useState, useEffect } from "react";
import { getContactMessages } from "../../Services/apiService";
import { toast } from "react-toastify";
import "../LandingPages/Contactus.css";
import Phone from '../../assets/Phone.png';
import Mail from '../../assets/Mail.png';
import location from '../../assets/location.png';
import FooterLandingPage from "../LandingPages/FooterLandingPage";
import "../LandingPages/Landingpage.css";
import AdminNavbar from "./AdminNavbar";

function AdminContact() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getContactMessages();
        if (response.success) {
          setMessages(response.data);
        } else {
          setError("Failed to fetch messages");
          toast.error("Failed to load contact messages");
        }
      } catch (err) {
        setError("An error occurred while fetching messages");
        toast.error("An error occurred while loading messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <>
      <AdminNavbar/>
      <div className="Contact_Us_Background">
        <div className='Section_one'>
          <p className='sec_one_headingone'>Contact Messages</p>
          <p className='sec_one_headingtwo'>User Inquiries and Feedback</p>
          <p className='sec_one_para'>View all messages submitted by users through the contact form. <br />Respond to inquiries and track user feedback.</p>
        </div>

        <div className="Contactus_Section_two">
          <div className='container'>
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center">
                {error}
              </div>
            ) : messages.length === 0 ? (
              <div className="alert alert-info text-center">
                No contact messages found.
              </div>
            ) : (
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header bg-dark text-white">
                      <h5 className="mb-0">All Messages</h5>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Message</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {messages.map((message) => (
                              <tr key={message.id}>
                                <td>{message.name}</td>
                                <td>
                                  <a href={`mailto:${message.email}`}>
                                    {message.email}
                                  </a>
                                </td>
                                <td className="text-truncate" style={{maxWidth: '200px'}}>
                                  {message.description}
                                </td>
                                <td>
                                  {new Date(message.created_at).toLocaleDateString()}
                                  <br />
                                  <small className="text-muted">
                                    {new Date(message.created_at).toLocaleTimeString()}
                                  </small>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* <div className="row mt-4">
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
            </div> */}
          </div>
        </div>

        <div className='Section-three'>
          <FooterLandingPage />
        </div>
      </div>
    </>
  );
}

export default AdminContact;