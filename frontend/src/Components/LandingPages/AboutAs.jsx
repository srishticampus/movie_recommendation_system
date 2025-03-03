
import Aboutus_Section2 from '../../assets/Aboutus_Section2.png';
import FooterLandingPage from "./FooterLandingPage"
import Navbar from '../Navbar/Navbar';
import "./Aboutus.css"

function Aboutus() {
  return (
    <>
    <Navbar/>
    <div className='Aboutus_bg'>
      <div className='Aboutus_Section_one '>
        <p className="Section_one_head1">1</p>
       < div className='Section_one_div2'>
       <p className='Section_one_div2'>About Us</p>
       <p className='Section_one_head2'>Welcome to Movietox  – Your Smart <br /> Solution for Movie Night!</p>
        </div> 
        <p className='Section_one_para mt-5'>At Movietox , we believe that a night at the movies should be fun, easy, and hassle-free. Founded by a team of movie lovers and tech<br /> enthusiasts, we set out to transform the way people experience cinema by bringing convenience and joy back to every step of the process.<br /> Our app offers a seamless, all-in-one solution to make your movie night as smooth as possible, from booking tickets to ordering snacks and<br /> securing parking.</p>
      </div>
      <div className='AboutUs_Section_two'>
        <div className='container sectwo_container'>
          <img src={Aboutus_Section2} />
          <div>
            <p className='Section_two_righthead1'>OUR MISSION</p>
            <p className='Section_two_righthead2'>Our mission is simple!</p>
            <p className='Section_two_rightpara'>To enhance every part of your movie-going experience. By combining <br /> technology with a passion for cinema, we’ve built an app that caters to your <br /> needs-giving you more time to relax and enjoy the magic on the big screen.</p>
          </div>
        </div>
      </div>
      <div className='Aboutus_Section_three'>
        <div className='container'>
          <p className='Section_three_head1'>Why Choose Movietox  ?</p>
          <p className='Section_three_para1'>We know how frustrating it can be to deal with long lines, sold-out tickets, and parking hassles on your night out. Our goal is to make sure you spend less time waiting and more time enjoying your favorite movies. We’ve packed our app with innovative features to keep things simple and convenient, making sure you have a memorable experience every time.</p>
          <p className='Section_three_head2'>WHAT WE OFFER</p>
          <p className='Section_three_head3'>With Movietox , you can:</p>
          <ul className='Section_three_list'>
            <li>Easily book tickets for your favorite shows</li>
            <li>Order snacks ahead of time and skip the lines</li>
            <li>Reserve a parking spot to avoid last-minute parking stress</li>
            <li>Join a queue slot if tickets are sold out, ensuring you never miss out</li>
          </ul>
          <p className='Section_three_head4'>Join Us in Revolutionizing Movie Nights</p>
          <p className='Section_three_para2'>We’re more than an app-we’re a community of movie lovers dedicated to changing the way people watch and enjoy films. Download Movietox  today and discover how effortless a movie night can truly be!</p>
        </div>

      </div>
      <div className='Aboutus_Section_four'>
        <FooterLandingPage />
      </div>
    
      </div></>
  )
}

export default Aboutus