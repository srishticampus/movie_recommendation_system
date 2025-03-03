import "./Landingfooter.css";
import logo from '../../assets/Vector (1).png';
import facebook_logo from '../../assets/facebook_logo.png'
import insta_logo from '../../assets/insta_logo.png';
import pinterest_logo from '../../assets/pinterest_logo.png';
import twitter_logo from '../../assets/twitter_logo.png';


function FooterLandingPage() {
    return (
        <div>
              <hr style={{ borderColor: 'white', borderWidth: '2px' }} />
            <div className="container">
                <div className="row">
                    <div className="col-sm-3">
                        <img className='streambox_img' src={logo} alt='streambox' />
                        <p><span className='logo_red'>Movietox </span><span className='cinemas_white'></span></p>
                        <div className='logos mt-5'>
                            <img className='Footer_logo_space' src={facebook_logo} alt="facebook"/>
                            <img className='Footer_logo_space' src={insta_logo} alt="insta"/>
                            <img className='Footer_logo_space' src={pinterest_logo} alt="pinterest"/>
                            <img className='Footer_logo_space' src={twitter_logo} alt="pinterest"/>
                            
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <h5 className='Footer_heading'>Quick Links</h5>
                        <ul className='Footer_list1'>
                            <li>Home</li>
                            <li>About</li>
                            <li>Book Movies</li>
                            <li>Contact</li>
                        </ul>

                    </div>

                    <div className="col-sm-3">
                        <h5 className='Footer_heading'>Terms & Policies</h5>
                        <ul className='Footer_list2'>
                            <li>Terms of Conditions</li>
                            <li>F&Q</li>
                            <li>Privacy Policy</li>
                            
                        </ul>

                    </div>
                    <div className="col-sm-3">
                        <h5 className='Footer_heading'>Get in touch</h5>
                        <ul className='Footer_list2'>
                            <li>0471-2525444</li>
                            <li>maxuscinemas@gmail.com</li>  
                        </ul>

                    </div>
                </div>
                <div className="container">
                <hr className="footer-hr" />
                </div>
                <p className='copyright'>Copy right &copy; 2024, All rights received</p>
            </div>

        </div>
    )
}

export default FooterLandingPage
