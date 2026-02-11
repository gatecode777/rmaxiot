import "../styles/style.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Logo Section */}
        <div className="footer-col logo-section">
          <div className="logo">
            <img src="/footerlogo.png" alt="RMAX Logo" />
          </div>

          <div className="social-links">
            <p>Follow us :</p>
            <div className="icons">
              <a href="#"><i className="fa-solid fa-envelope"></i></a>
              <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>

        {/* Company Section */}
        <div className="footer-col content-col">
          <h3>Company</h3>
          <ul>
            <li><Link to="#">Blog</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="#">Associate Partner</Link></li>
            <li><Link to="#">Talk to Expert</Link></li>
            <li><Link to="#">Solution & Application</Link></li>
          </ul>
        </div>

        {/* Service & Support Section */}
        <div className="footer-col content-col divider">
          <h3>Service & Support</h3>
          <ul>
            <li><Link to="#">Track Order</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            <li><Link to="#">Customer Support</Link></li>
            <li><Link to="#">Request Service Online</Link></li>
            <li><Link to="#">Help & Support System</Link></li>
          </ul>
        </div>

        {/* Product Section 1 */}
        <div className="footer-col content-col divider">
          <h3>Our Product</h3>
          <ul>
            <li><Link to="#">Napkin Incinerator Machine</Link></li>
            <li><Link to="#">Diaper Incinerator Machine</Link></li>
            <li><Link to="#">GEOSAT (Bank Kiosk Device)</Link></li>
            <li><Link to="#">RMX Bag (Ladies bag)</Link></li>
            <li><Link to="#">Bluestar GPS (Aadhar GPS)</Link></li>
          </ul>
        </div>

        {/* Product Section 2 */}
        <div className="footer-col content-col divider second-product-col">
          <ul className="no-heading">
            <li><Link to="#">Self Operated Sanitary Pad Manual Vending Machine</Link></li>
            <li><Link to="#">Push Button Sanitary Pad Automatic Vending Machine</Link></li>
            <li><Link to="#">Coin Operated Sanitary Pad Manual Vending Machine</Link></li>
            <li><Link to="#">Coin Operated Sanitary Pad Automatic Vending Machine</Link></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="bottom-container">
          <div className="bottom-links">
            <Link to="#">Sitemap</Link>
            <Link to="/returns-refunds-policy">Refund Policy</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-condition">Terms & Conditions</Link>
            <Link to="#">Careers</Link>
            <Link to="/contact-us">Contact Us</Link>
          </div>

          <div className="copyright">
            Copyright <i className="fa-regular fa-copyright"></i> 2026 All rights
            reserved by RMAX Solutions Pvt. Ltd.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;