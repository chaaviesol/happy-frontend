import React from 'react'
import "./Home.css"
import { Link } from 'react-router-dom'
export default function Home() {
    return (
        <>
            <div className='cust_home_main'>
                <nav id='Homenav' className="Homecontainer">
                    <div className="Home_main-nav Homeflex">
                        <div className="logo-section Homeflex">
                            <a href="#home" className="Home_logo Home_tag">
                                <img src="./assets/dd-removebg-preview.png" alt="company-logo"  className='Home_image' />
                            </a>
                            <h3 className='Home_text_head' style={{margin:"10px 00px 00px 00px"}}>Happy Group</h3>
                        </div>
                        <div className="Homenavlinks">
                            <ul className="Homeflex">
                                <li>
                                    <a href="#about" className="Home_links Home_tag">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#ourteam" className="Home_links Home_tag">
                                        Our Team
                                    </a>
                                </li>
                                <li>
                                    <a href="#ourbusiness" className="Home_links Home_tag">
                                        Our Business
                                    </a>
                                </li>
                                <li>
                                    <a href="#gallery" className="Home_links Home_tag">
                                        Gallery
                                    </a>
                                </li>
                                <li>
                                    <Link to="/login">
                                    <a href="#" className="Home_btn Home_tag">
                                        Log in
                                    </a>
                                    </Link>
                                   
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                {/* HERO SECTION */}
                <section>
                    <div className="Homecontainer Homehead">
                        <div className="Homehead20">
                            The Best Brands in Toys, Bicycles, and Baby Products, Your One-Stop
                            Shop!
                        </div>
                    </div>
                </section>
                <section>
                    <div className="Homecontainer Homeflex Homeassets">
                        <div className="Homeleft">
                            <img src="./assets/Frame 10.png" alt  className='Home_image'/>
                        </div>
                        <div className="Home_right Homeflex">
                            <img src="./assets/11522840_4757696-removebg-preview.png" alt className='Home_image' />
                        </div>
                    </div>
                </section>
                <section>
                    <div className="Homecontainer Homeflex discription">
                        <div className="Homeleft-section Homeflex">
                            <div className="item" />
                            <h1 className="dis2 Home_subhead" style={{textAlign:"start"}}>
                                Welcome to our happy world of toys! We, at Happy Agencies, provide a
                                diverse selection of toys that spark creativity, imagination and fun
                                for all ages
                            </h1>
                        </div>
                        <div className="Homeright-section Homeflex1">
                            <button href="#" className="Home_btn2">
                                CONTACT
                            </button>
                        </div>
                    </div>
                </section>
                {/* ABOUT */}
                <div className="Homecontainer" id>
                    <div className="about">
                        <div className="Home_title Homeflex">
                            <h1 className="main-Homeheading Home_subhead">ABOUT US</h1>
                            <div className="Homeposition3" id="about" />
                        </div>
                        <p className="Home_p1 Home_text">
                            At Happy Agencies, we are proud to be a wholesale supplier of toys and
                            baby products, serving over 2000 customers across Kerala, Karnataka, and
                            Tamilnadu. With more than 30 years of experience, we have established
                            ourselves as one of the biggest players in Malabar, with our
                            Homeheadquarters based in Kozhikode. Happy Agencies has been a
                            trailblazer in the retail and wholesale industry since 1990, starting
                            out as a small retailer in Edavannapara, Malappuram District Kerala.
                            After a decade in retail, we ventured into wholesale toys and relocated
                            to Kozhikode to accommodate our growing business. Our customer-focused
                            approach and unwavering commitment to quality have made us the
                            all-Kerala distributor for several top brands. Our expansion into our
                            own premises in Puthiyapalam has allowed us to offer an even broader
                            range of quality products, including baby products, walkers, strollers,
                            and tricycles. In 2021, we launched Happy Bikes, a specialized bike
                            dealership, to continue delivering the best value to our customers.
                        </p>
                        <br />
                        <p className="Home_p2 Home_text">
                            {' '}
                            We believe that our focus on quality and customer satisfaction has been
                            instrumental in establishing our reputation as a trusted supplier of
                            toys and baby products in the region. Our warm relationships with
                            clients have propelled our business to great heights, and we are
                            grateful for their loyalty. We welcome you to partner with us for your
                            toy and baby product needs and thank you for choosing Happy Agencies!
                        </p>
                    </div>
                </div>
                {/* OUR HomeVISION */}
                <div className="Homevision Homecontainer">
                    <div className="img-para Homeflex">
                        <div className="img-4 Homeflex">
                            <div className="Homemodel" />
                            <img
                                src="./assets/portrait-successful-man-having-stubble-posing-with-broad-smile-keeping-arms-folded.jpg"
                                alt className='Home_image'
                            />
                        </div>
                        <div className="Homevision2 Homeflex">
                            <div className="Homevision-Homehead Homeflex">
                                <h1 className='Home_subhead'> Our Vision </h1>
                            </div>  
                            <p className="para20 Home_text text_Home" >
                                At Happy Agencies, we prioritize exceptional customer satisfaction,
                                value, and trust. Our unwavering commitment to these principles is the
                                foundation of our business. We believe that by delivering quality
                                products and personalized attention, we can exceed your expectations
                                and help you build a successful business.
                            </p>
                            <div className="Homevision3">
                                <h3 className="Homevision-text2 Home_text_head" >Mr.Abdul Kareem</h3>
                                <h4 className="Homevision-text3 Home_bottomline">Chairman - Happy Group</h4>
                            </div>
                        </div>
                    </div>
                </div>
                {/* OUR TEAM */}
                <div className="Homecontainer">
                    <div className="Homehead2 Homeflex">
                        <h1 className="main-Homeheading ">OUR TEAM</h1>
                        <div className="Homeposition4" id="ourteam" />
                    </div>
                    <div className="Hometeam Homeflex">
                        <div className="Hometeam-img Homeflex">
                            <img
                                src="./assets/portrait-successful-man-having-stubble-posing-with-broad-smile-keeping-arms-folded.jpg"
                                alt className='Home_image'
                            />
                        </div>
                        <div className="Homeleft-sec Homeflex">
                            <div className="Homehead23 Homeceo1 Homeflex">
                                <h1 className='Home_subhead Home_texts'>Mr.Abdul Rasheed</h1>
                            </div>
                            <div className="Homehead23 ceo Homeflex">
                                <h3 className='Home_text_head  Home_text_ceo'>CEO - Happy Group</h3>
                            </div>
                            <div className="Homepara23 Homeflex">
                                <p className='Home_text'>
                                    {' '}
                                    Happy Agencies began as a humble retailer in Edavannapara,
                                    Malappuram District Kerala in 1990. Today we are a one-stop shop for
                                    our customers for anything ranging from baby products to high-end
                                    cycles. This has been possible because of our unwavering commitment
                                    to bring the best value to our customers. Our warm relationships
                                    with clients have propelled our business to great heights, and we
                                    are grateful for their loyalty.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="Hometeam Homeflex">
                        <div className="Hometeam-img Homeflex">
                            <img
                                src="./assets/portrait-successful-man-having-stubble-posing-with-broad-smile-keeping-arms-folded.jpg"
                                alt className='Home_image'
                            />
                        </div>
                        <div className="Homeleft-sec Homeflex">
                            <div className="Homehead23 HomeHomeceo1 Homeflex">
                                <h1 className='Home_subhead Home_texts'>Mr.VS Aboobacker</h1>
                            </div>
                            <div className="Homehead23 ceo Homeflex">
                                <h3 className='Home_text_head Home_text_ceo'>Chief Advisor - Happy Group</h3>
                            </div>
                            <div className="Homepara23 Homeflex">
                                <p className='Home_text'>
                                    {' '}
                                    I have been in the toy industry for the last 3 decades. From the
                                    times when we had to travel to metro cities to source the stock, to
                                    now when everything is available on the fingertips, I have been an
                                    active participant in the evolution of the industry. I am proud to
                                    associate myself with Happy Agencies. I am sure we will chart
                                    greater heights through our industry and thought leadership.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* OUR Homenext GEN LEADERS */}
                <div className="Homecontainer">
                    <div className="Homehead2 Homeflex">
                        <h1 className="main-Homeheading">OUR NEXT GEN LEADERS</h1>
                    </div>
                    <div className="sections">
                        <div className="Homefirst Homeflex">
                            <div className="img-3 Homeflex">
                                <div className="Homemodel" />
                                <img
                                    src="./assets/portrait-successful-man-having-stubble-posing-with-broad-smile-keeping-arms-folded.jpg"
                                    alt className='Home_image'
                                />
                            </div>
                            <div>
                                <h1 className="Homenext-1 Home_textstyle">Mr.Ibrahim Fazil</h1>
                                <h2 className="Homenext-2 Home_textstyle">Managing Partner</h2>
                                <p className="Homenext-para1 Homenext4 Home_text">
                                    I am excited about the opportunities for growth and expansion in our
                                    business. I am proud of the strong foundation that my predecessors
                                    have built and the values they have instilled in the company. With a
                                    focus on innovation, customer satisfaction, and sustainability, I am
                                    confident that we can continue to build on our legacy and take the
                                    company to new heights.
                                </p>
                            </div>
                        </div>
                        <div className="Homesecond Homeflex">
                            <div className="img-5 Homeflex">
                                <img
                                    src="./assets/portrait-successful-man-having-stubble-posing-with-broad-smile-keeping-arms-folded.jpg"
                                    alt className='Home_image'
                                />
                                <div className="mode2" />
                            </div>
                            <div className="data2">
                                <div className="Homenext-Homehead2 Homeflex">
                                    <h1 className="Homenext-1">Mr.Irshad P</h1>
                                </div>
                                <div className="Homenext-Homehead3 Homeflex">
                                    <h2 className="Homenext-2 Homenext-3">Managing Partner</h2>
                                </div>
                                <div className="Homenext-para1 Homenext-para2">
                                    <p className="Homenext-para1 Homenext3 Home_text">
                                        Our strong foundation and customer-centric approach have been
                                        passed down by the previous generation, and we are proud to
                                        continue building on their legacy. Our main focus would be to
                                        expanding our product portfolio, exploring new markets, and
                                        innovating to meet the changing needs of our customers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* OUR BUSINESS */}
                    <section>
                        <div className="Homecontainer" id>
                            <div className="Homehead2 Homeflex">
                                <h1 className="main-Homeheading">OUR BUSINESS</h1>
                                <div className="Homeposition" id="ourbusiness" />
                            </div>
                        </div>
                        <section>
                            <div className="items Homeflex">
                                <div className="item1 Homeflex">
                                    <div className="icon-img Homeflex">
                                        <img
                                            src="./assets/icons8-toy-100.png"
                                            className="icon Home_image"
                                            alt="icon"
                                            
                                        />
                                    </div>
                                    <h2 className='Home_heading'>Toys</h2>
                                    <div className="para1">
                                        Discover our diverse collection of high-quality toys for all ages!
                                        From classic favourites to the latest trends, our portfolio is
                                        designed to delight and entertain.
                                    </div>
                                    <a href="btn5" className="btn5 Home_tag">
                                        Know More
                                    </a>
                                </div>
                                <div className="item1 Homeflex">
                                    <div className="icon-img Homeflex">
                                        <img
                                            src="./assets/icons8-bike-96.png"
                                            className="icon Home_img"
                                            alt="icon"
                                        />
                                    </div>
                                    <h2 className='Home_heading'>Bikes</h2>
                                    <div className="para1">
                                        Discover our exciting range of bikes and electric vehicles for
                                        kids! Browse our collection today and discover the perfect
                                        bicycles for your customers
                                    </div>
                                    <a href="btn5" className="btn5 Home_tag">
                                        Know More
                                    </a>
                                </div>
                                <div className="item1 Homeflex">
                                    <div className="icon-img Homeflex">
                                        <img
                                            src="./assets/icons8-baby-stroller-100.png"
                                            className="icon Home_img"
                                            alt="icon"
                                        />
                                    </div>
                                    <h2 className='Home_heading'>Baby Products</h2>
                                    <div className="para1">
                                        Welcome to our comprehensive range of baby products! As a leading
                                        wholesaler, we offer a wide selection of strollers, bath toys,
                                        cradles, baby tubs, and more.
                                    </div>
                                    <a href="btn5" className="btn5 Home_tag">
                                        Know More
                                    </a>
                                </div>
                            </div>
                        </section>
                    </section>
                </div>
                {/* GAllERY */}
                <div className="Homecontainer" id>
                    <div className="Homehead2 Homehead5 Homeflex">
                        <h1 className="main-Homeheading">GALLERY</h1>
                        <div className="Homeposition1" id="gallery" />
                    </div>
                </div>
                <div className="Homecontainer">
                    <div className="gallery">
                        <div className="box">
                            <img src="./assets/huy-hung-trinh-zoyBqT7ytLU-unsplash.jpg" className='Home_image' />
                            <span>TOYS</span>
                        </div>
                        <div className="box">
                            <img src="./assets/mikkel-bech-yjAFnkLtKY0-unsplash.jpg" className='Home_image' />
                            <span>BIKES</span>
                        </div>
                        <div className="box">
                            <img src="./assets/jimmy-conover-hitzaT1nBTs-unsplash.jpg" className='Home_image' />
                            <span>BABY PRODUCTS</span>
                        </div>
                    </div>
                </div>
                {/* FOOTER */}
                {/* 
<div class="Homecontainer">
  <div class="rectangle">
    <section class="Homeflex">
                  <div class="Homeleft-img Homeflex">
                    <img src="./12983846_5114855-removebg-preview.png" alt="">
                  </div>

                <div class="form Homeflex">
                       <div class="Homeflex con-Homehead">
                         <h1 class="contact-Homehead"> CONTACT US</h1>
                       </div>
            <form onsubmit="sendEmail(); reset(); return false;"> 
                    
                    
                  <div class="form-section Homeflex">
                    <div class="Homefirst-form Homeflex">
          
                      <input class="form-input" type="text" placeholder="Name" name="name" id="name" required>
                      <input class="form-input" type="email" placeholder="Email" name="email" id="email" required>
          
                      <label class="cate" for="Category">Category</label>
                      <select class="drop " name="category" id="category">
                        <option value="toys">Toys</option>
                        <option value="bikes">Bikes</option>
                        <option value="babyproduct">Baby Products</option>
                      </select>
                      
                      <button class="btn10" type="onsubmit" onclick="" > Send Message</button>
                    
                 </div>
                    <div class="sec-form1 Homeflex">
                      <div class="second-form">
                       
                        <textarea class="text-area" cols="50" rows="5" class="" type="text" name="message" id="message" >
                        </textarea>
                        </div>
                    </div>
            </form>  
    </section>
   </div>
</div>
 */}
                {/* COPY RIGHT SECTION */}
                <div className="Homecontainer copyright Homeflex">
                    <div>
                        <a href="https://www.chaaviesolutions.com/" target="_blank" className='Home_tag'>
                            Powered by Chaavie Solutions
                        </a>
                        <h4 className='Home_bottomline'>© Copyright Happy Group . All Rights Reserved</h4>
                    </div>
                </div>
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                />
                <div className="floating-Homecontainer">
                    <div className="floating-button">+</div>
                    <div className="element-Homecontainer">
                        <a className="float-element tooltip-Homeleft Home_tag" href="callto:+918848875010">
                            <i className="material-icons">phone</i>
                        </a>
                        <a className="float-element whatsapp Home_tag" href="https://wa.me/+918848875010">
                            <img height="24px" src="./assets/whatsapp (1).png" alt className='Home_image' />
                        </a>
                        <a className="float-element Home_tag" href="mailto:happytoyscalicut@gmail.com">
                            <i className="material-icons">email</i>
                        </a>
                        <a
                            className="float-element whatsapp Home_tag"
                            href="https://www.instagram.com/happy_group_calicut/"
                        >
                            <img height="29px" src="./assets/icons8-instagram-96 (1).png" alt  className='Home_image' />
                        </a>
                    </div>
                </div>
                {/* javascript */}
            </div>




        </>
    )
}
