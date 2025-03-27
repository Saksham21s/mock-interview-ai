import { useNavigate } from "react-router-dom";
import Testimonial  from "./Testimonial";
import Footer from "../components/Footer";
import hero from "../assets/hero.svg";
import feedback from "../assets/feedback.webp";
import customised from "../assets/for-you.webp";
import analysis from "../assets/analysis.webp";

const CustomButton = ({ className, children, ...props }) => {
  return (
    <button className={`custom-btn ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="content-container">
          <div className="text-content">
            <h1 className="main-heading">
              Ace Your Next Job Interview with <span>AI Insights</span>
            </h1>
            <p className="sub-heading">
              Unlock real-time AI-driven feedback tailored to your job profile.
            </p>
            <div className="button-group">
              <CustomButton className="cta-button" onClick={() => navigate('/interview')}>
                Get Started
              </CustomButton>
              <a href="https://jobscraft.vercel.app/" target="_blank" rel="noopener noreferrer">
                <CustomButton className="secondary-button">
                  Build Resume
                </CustomButton>
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src={hero} alt="AI Interview Mock Illustration" className="hero-svg" />
          </div>
        </div>
      </section>

      {/* Features  Section */}
      <section className="features-section">
        <h2 className="section-heading">Why Choose Jobscraft AI Interview?</h2>
        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-card-image">
              <img src={feedback} alt="Accurate Feedback" />
            </div>
            <div className="feature-card-content">
              <h3>Accurate Feedback</h3>
              <p>Get precise evaluation and actionable feedback to improve your interview answers.</p>
              <a href="#" className="link">Explore</a>
            </div>
            <h2 className="feature-card-title">Accurate Feedback</h2>
          </div>

          <div className="feature-card">
            <div className="feature-card-image">
              <img src={customised} alt="Customized Feedback" />
            </div>
            <div className="feature-card-content">
              <h3>Analyze Resume</h3>
              <p>AI adapts to your resume and job profile to give tailored recommendations.</p>
              <a href="#" className="link">Explore</a>
            </div>
            <h2 className="feature-card-title">Analyze Resume</h2>
          </div>

          <div className="feature-card">
            <div className="feature-card-image">
              <img src={analysis} alt="Real-Time Analysis" />
            </div>
            <div className="feature-card-content">
              <h3>Real-Time Analysis</h3>
              <p>Immediate analysis of your mock interview to help you practice and perfect.</p>
              <a href="#" className="link">Explore</a>
            </div>
            <h2 className="feature-card-title">Real-Time Analysis</h2>
          </div>

        </div>
      </section>


      {/* Testimonials Section */}
      <Testimonial/>

      {/* Footer */}
      <Footer />
    </div>
  );
}
