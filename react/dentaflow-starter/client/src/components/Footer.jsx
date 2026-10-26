
import { Link } from "react-router-dom";
import '../css/Footer.css';
import logo from "../assets/dentaflow_logo.png";
export default function Footer() {
  return (
    <footer className="dentaflow-footer">
      <div className="footer-container">
        <div className="footer-content">

          <div className="footer-brand">
            <div className="footer-brand-header">
              <img
                src={logo}
                alt="DentaFlow Logo"
                className="footer-logo"
                
              />
              <h2>DentaFlow</h2>
            </div>

            <p>
              Modern dental care that fits your schedule.
              Book, manage, and track your appointments
              with ease.
            </p>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li><Link to="/services">General Checkup</Link></li>
              <li><Link to="/services">Teeth Whitening</Link></li>
              <li><Link to="/services">Orthodontics</Link></li>
              <li><Link to="/services">Implants</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/about">Our Team</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>
            <ul>
              <li>
                <a href="mailto:hello@dentaflow.com">
                  hello@dentaflow.com
                </a>
              </li>
              <li>
                <a href="tel:1231234567">
                  +(123) 123-4567
                </a>
              </li>
              <li><p>Mon – Sat, 8AM – 6PM</p></li>
              <li><p>Brgy. Sta Cruz, Manila</p></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} DentaFlow.
            All rights reserved.
          </p>

          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
