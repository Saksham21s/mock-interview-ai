import { useNavigate } from "react-router-dom";
import Testimonial from "./Testimonial";
import hero from "../assets/hero.svg";
import feedback from "../assets/feedback.webp";
import customised from "../assets/for-you.webp";
import analysis from "../assets/analysis.webp";
import React, { memo } from "react";
import Footer from "../components/Footer";

const FEATURES = [
  {
    title: " Accurate Feedback",
    imgSrc: feedback,
    description: "Get precise evaluation and actionable feedback to improve your interview answers.",
    link: "/interview"
  },
  {
    title: "Analyze Resume",
    imgSrc: customised,
    description: "AI adapts to your resume and job profile to give tailored recommendations.",
    link: "/resume-validator"
  },
  {
    title: "Build Resume",
    imgSrc: analysis,
    description: " Create a resume that is ATS-friendly and tailored to your job profile.",
    link: "https://jobscraft.vercel.app/"
  },
];

// Custom Button Component with memoization to avoid unnecessary re-renders
const CustomButton = memo(({ className, children, ...props }) => (
  <button className={`custom-btn ${className}`} {...props}>
    {children}
  </button>
));

// Memoized FeatureCard Component
const FeatureCard = memo(({ feature }) => (
  <div className="feature-card">
    <div className="feature-card-image">
      <img src={feature.imgSrc} alt={feature.title} />
    </div>
    <div className="feature-card-content">
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
      <a href={feature.link} className="link">Explore</a>
    </div>
    {/* Restoring this title section outside of content div */}
    <h2 className="feature-card-title">{feature.title}</h2>
  </div>
));

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
              <CustomButton className="cta-button" onClick={() => navigate("/interview")}>
                Get Started
              </CustomButton>
              <a href="https://jobscraft.vercel.app/" target="_blank" rel="noopener noreferrer">
                <CustomButton className="secondary-button">Build Resume</CustomButton>
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src={hero} alt="AI Interview Mock Illustration" className="hero-svg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-heading">Why Choose Jobscraft AI Interview?</h2>
        <div className="features-grid">
          {/* Restoring all features correctly with structure */}
          {FEATURES.map((feature, index) => (
            <div key={index}>
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonial />

      <Footer />
    </div>
  );
}
