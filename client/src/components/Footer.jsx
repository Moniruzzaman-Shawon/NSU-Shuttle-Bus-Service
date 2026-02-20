import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand">
          <img src="/img/logo.png" alt="NSU Logo" className="footer-logo" />
          <p>NSU Shuttle Bus Service provides safe, reliable transportation for North South University students across Dhaka.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Info</h4>
          <ul>
            <li>Bashundhara, Block B, Plot #15</li>
            <li>Dhaka-1229, Bangladesh</li>
            <li>+880-2-55668200</li>
            <li>registrar@northsouth.edu</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <div className="footer-socials">
            <a href="https://www.facebook.com/NorthSouthUniversity" target="_blank" rel="noreferrer" aria-label="Facebook">FB</a>
            <a href="https://twitter.com/NSUniversity" target="_blank" rel="noreferrer" aria-label="Twitter">TW</a>
            <a href="https://www.linkedin.com/school/north-south-university/" target="_blank" rel="noreferrer" aria-label="LinkedIn">LI</a>
            <a href="https://www.youtube.com/@NorthSouthUniversity" target="_blank" rel="noreferrer" aria-label="YouTube">YT</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NSU Shuttle Bus Service. All rights reserved.</p>
      </div>
    </footer>
  );
}
