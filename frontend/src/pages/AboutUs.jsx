import React from "react";
import "../styles/aboutus.css";

const AboutUs = () => {
    return (
        <>
            {/* Banner Section */}
            <section className="quick-msg-banner">
                <div className="banner-text">
                    <h1>Send us a Quick Message</h1>
                    <p>Discuss more about your requirement by contacting us now</p>
                </div>
                <button className="contact-us-btn">Contact Us</button>
            </section>

            <div className="about-container">

                {/* Gallery Section */}
                <section className="gallery-section">
                    <div className="gallery-card">
                        <div className="img-box">
                            <img src="Infrastructure.png" alt="Infrastructural Set-Up" />
                        </div>
                        <div className="card-titlej">Infrastructural Set-Up</div>
                    </div>

                    <div className="gallery-card">
                        <div className="img-box">
                            <img src="Ourmachinery.png" alt="Our Machinery" />
                        </div>
                        <div className="card-titlej">Our Machinery</div>
                    </div>

                    <div className="gallery-card">
                        <div className="img-box">
                            <img src="/Ourwarehouse.png" alt="Our Warehouse" />
                        </div>
                        <div className="card-titlej">Our Warehouse</div>
                    </div>
                </section>

                {/* Company Introduction */}
                <section className="intro-text-section">
                    <p><strong>RMAX Solutions</strong>, established in 2013, is a leading and trusted <strong>CMMI Level 3 certified and ISO-accredited IT organization</strong>, recognized for delivering high-quality, secure, and reliable technology solutions. The company holds prestigious certifications including ISO 9001:2008 (Quality Management System), ISO/IEC 27001:2013 (Information Security Management System), and ISO 20000-1:2011 (IT Service Management System), which reflect our strong commitment to quality, security, and service excellence.</p>

                    <p>RMAX Solutions has successfully positioned itself as a <strong>key technology partner for multiple Government Departments</strong>, with a proven track record of executing large-scale and mission-critical projects. Our corporate headquarters is located in Jaipur.</p>

                    <p>With a team of <strong>50+ highly skilled professionals</strong>, including experienced engineers, software developers, system architects, and IT consultants, RMAX Solutions specializes in a wide range of IT-enabled services and digital solutions. Our team follows industry best practices, modern development methodologies, and robust security standards to ensure timely and high-quality project delivery.</p>

                    <p>Over the years, RMAX Solutions has built a strong reputation based on client satisfaction, transparency, and long-term partnerships. Throughout our journey, we have maintained an <strong>excellent service record with zero negative feedback</strong>, highlighting our customer-centric approach, strong project governance, and continuous improvement culture.</p>

                    <p>Driven by innovation, reliability, and professionalism, RMAX Solutions continues to empower government and enterprise clients with scalable, secure, and future-ready IT solutions.</p>
                </section>

                {/* Why Choose Us */}
                <section className="why-choose-us">
                    <div className="wcu-header">
                        <h2>Why Choose Us ?</h2>
                        <p>We are committed to offering high-quality products and solutions to our clients at competitive and reasonable prices, ensuring maximum value without compromising on quality. Our strong focus on customer satisfaction, transparency, and long-term relationships has helped us stand out in a competitive market.</p>
                        <p className="key-factors">Key factors that differentiate us include:</p>
                    </div>

                    <div className="feature-rows">
                        <div className="feature-item-abt">
                            <h3>• Wide Industry Experience:</h3>
                            <p>With years of hands-on experience across diverse industries, we possess deep domain knowledge that enables us to understand client requirements and deliver effective, industry-specific solutions.</p>
                        </div>
                        <div className="feature-item-abt">
                            <h3>• Ethical Business Practices:</h3>
                            <p>We strictly follow ethical business standards, ensuring honesty, transparency, and integrity in all our dealings. Our clients trust us for fair pricing, clear communication, and reliable commitments.</p>
                        </div>
                        <div className="feature-item-abt">
                            <h3>• Dynamic and Skilled Workforce:</h3>
                            <p>Our organization is powered by a highly motivated team of professionals who bring technical expertise, innovation, and a problem-solving mindset to every project.</p>
                        </div>
                        <div className="feature-item-abt">
                            <h3>• Customized Solutions:</h3>
                            <p>We believe every client has unique needs. Therefore, we offer tailor-made solutions designed to align perfectly with specific business goals, operational requirements, and budgets.</p>
                        </div>
                        <div className="feature-item-abt">
                            <h3>• Wide Distribution Network:</h3>
                            <p>Our strong and well-established distribution network enables us to serve clients efficiently across multiple locations, ensuring seamless availability and support.</p>
                        </div>
                        <div className="feature-item-abt">
                            <h3>• Free Sampling Policy:</h3>
                            <p>To help clients evaluate quality and suitability, we offer free sampling, allowing them to make informed decisions with complete confidence.</p>
                        </div>
                        <div className="feature-item-abt">
                            <h3>• Prompt and Reliable Delivery:</h3>
                            <p>We ensure timely delivery through streamlined processes and effective logistics management, meeting deadlines without compromising product quality.</p>
                        </div>
                    </div>
                </section>

                {/* Profile Tables */}
                <section className="profile-tables-section">

                    <div className="profile-block">
                        <h2 className="profile-title">Basic Information</h2>
                        <div className="profile-row">
                            <span className="label">Nature of Business :</span>
                            <span className="value">Manufacturer, Supplier of Services, Recipient of Goods or Services, Office / Sale Office</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">Additional Business :</span>
                            <span className="value">Retail Business, Wholesale Business, Factory / Manufacturing, Warehouse / Depot</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">Company CEO :</span>
                            <span className="value">Mukesh Palsaniya</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">Registered Address :</span>
                            <span className="value">Plot No. 159-160, Giriraj Nagar, Gram Balrampura urf Khejron Ka Baas, Sanganer, Jaipur 302029, Rajasthan, India</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">Total Number of Employees :</span>
                            <span className="value">11 to 25 People</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">GST Registration Date :</span>
                            <span className="value">11-11-2021</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">Legal Status of Firm :</span>
                            <span className="value">Proprietorship</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">Annual Turnover :</span>
                            <span className="value">3 Cr.</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">GST Partner Name :</span>
                            <span className="value">Mukesh Palsaniya</span>
                        </div>
                    </div>

                    <div className="profile-block">
                        <h2 className="profile-title">Statutory Profile</h2>
                        <div className="profile-row">
                            <span className="label">Banker :</span>
                            <span className="value">Axis Bank, HDFC Bank</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">GST No. :</span>
                            <span className="value">08CUPPP6429R1ZE</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">UDYAM No. :</span>
                            <span className="value">UDYAM-RJ-17-0566570</span>
                        </div>
                    </div>

                    <div className="profile-block">
                        <h2 className="profile-title">Packaging/Payment and Shipment Details</h2>
                        <div className="profile-row">
                            <span className="label">Payment Mode :</span>
                            <span className="value">Cash, Credit Card, DD, Cheque, Online</span>
                        </div>
                        <div className="profile-row">
                            <span className="label">Shipment Mode :</span>
                            <span className="value">By Road</span>
                        </div>
                    </div>

                </section>
            </div>
        </>
    );
};

export default AboutUs;