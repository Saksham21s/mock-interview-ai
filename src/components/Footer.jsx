import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram, 
  FaEnvelope, FaPhoneAlt, FaArrowRight 
} from "react-icons/fa";
import "../assets/styles/App.css";

const Footer = () => {
  const isDarkMode = useSelector((state) => state.theme.darkMode); 

  const socialLinks = [
    { icon: <FaFacebook />, name: "Facebook", url: "#" },
    { icon: <FaTwitter />, name: "Twitter", url: "#" },
    { icon: <FaLinkedin />, name: "LinkedIn", url: "#" },
    { icon: <FaInstagram />, name: "Instagram", url: "#" },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Interview", path: "/interview" },
    { name: "Resume Check", path: "/resume-validator" },
    { name: "Build Resume", path: "https://jobscraft.vercel.app/", external: true },
  ];

  return (
    <footer className={`footer ${isDarkMode ? "dark" : "light"}`}>
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-column brand-column">
          <h3 className="logo">JOBSCRAFT</h3>
          <p className="tagline">AI-powered career acceleration</p>
          
          <div className="contact-info">
            <div className="contact-row">
              <div className="contact-item">
                <FaEnvelope className="icon" />
                <span>contact@jobscraft.com</span>
              </div>
              <div className="contact-item">
                <FaPhoneAlt className="icon" />
                <span>+91 8787050004</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-column links-column">
          <h4>Quick Links</h4>
          <div className="footer-links-grid">
            {quickLinks.map((link, index) => (
              <div key={index} className="link-item">
                {link.external ? (
                  <a href={link.path} target="_blank" rel="noopener noreferrer">
                    <FaArrowRight className="link-icon" />
                    {link.name}
                  </a>
                ) : (
                  <Link to={link.path}>
                    <FaArrowRight className="link-icon" />
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Column */}
        <div className="footer-column social-column">
          <h4>Connect With Us</h4>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="footer-bottom">
        <div className="newsletter">
          <p>Subscribe for updates</p>
          <div className="newsletter-input">
            <input type="email" placeholder="Your email" />
            <button aria-label="Subscribe">
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
