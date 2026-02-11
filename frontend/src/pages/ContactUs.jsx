import React from "react";
import "../styles/contactus.css";

const ContactUs = () => {
  return (
    <>
      <section className="contact-wrapper">
        <div className="container">
          {/* Left Side: Contact Info */}
          <div className="contact-info">
            <h1 className="main-heading">Get in Touch With Us</h1>
            <p className="sub-text">
              Have questions about our products? Our team is here to help.
            </p>

            <div className="info-item">
              <div className="icon-box">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="details">
                <p>
                  <strong>Company Person :</strong> Mukesh Palsaniya (Founder &
                  CEO)
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box">
                <i className="fa-solid fa-location-arrow"></i>
              </div>
              <div className="details">
                <p>
                  <strong>Address :</strong> Plot No. 159-160, Giriraj Nagar,
                  Gram Balrampura Urf Khejron Ka Baas, Sanganer, Jaipur - 302029,
                  Rajasthan, India
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="details">
                <p>
                  <strong>Contact No. :</strong> +91-8043864750
                </p>
              </div>
            </div>

            <div className="social-share">
              <span>Share as on</span>
              <div className="social-icons">
                <a href="#">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Enquiry Form */}
          <div className="contact-form-card">
            <h2>For Enquiry</h2>
            <form>
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email Address" required />
              <input type="tel" placeholder="Mobile Number" required />
              <textarea
                placeholder="Type your Message"
                rows="5"
                required
              ></textarea>
              <button type="submit" className="submit-btn">
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <footer className="office-hours">
        <p>Office Hours: Mon–Sat | 10 AM – 6 PM</p>
      </footer>
    </>
  );
};

export default ContactUs;