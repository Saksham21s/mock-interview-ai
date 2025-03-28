import interview from "../assets/interview.svg";
import { FaFileUpload } from "react-icons/fa";
import React, { useState, useRef } from "react";
import { FaUserGraduate, FaBriefcase, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../redux/interviewformSlice";
import '../styles/Interview.css';
import arrow from "../assets/arrow.png";

const jobData = {
  "Frontend Developer": ["JavaScript", "React", "HTML/CSS", "TypeScript", "Git", "Redux"],
  "Backend Developer": ["Node.js", "Python", "SQL", "MongoDB", "Docker", "Kubernetes"],
  "Full Stack Developer": ["JavaScript", "Node.js", "React", "SQL", "AWS", "GraphQL"],
  "Data Scientist": ["Python", "Machine Learning", "SQL", "Data Visualization", "Pandas", "Numpy"],
  "UX/UI Designer": ["Figma", "Adobe XD", "User Research", "Wireframing", "CSS", "Prototyping"],
};

const experienceLevels = {
  "Entry Level": ["Internship-level experience", "Basic tool knowledge", "Soft skills"],
  "Mid Level": ["Industry experience", "Problem-solving", "Leadership potential"],
  "Senior Level": ["Advanced problem-solving", "Team management", "Strategic thinking"],
};

const InterviewForm = () => {
  const reduxFormData = useSelector((state) => state.interview || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: reduxFormData.name || "",
    jobRole: reduxFormData.jobRole || "",
    experience: reduxFormData.experience || "",
    skills: reduxFormData.skills || [],
    resume: reduxFormData.resume || null,
  });
  
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        skills: checked
          ? [...prevData.skills, value]
          : prevData.skills.filter((skill) => skill !== value),
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleDivClick = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = ".pdf, .doc, .docx";
    inputElement.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setUploadedFile(file);
        setFormData((prevData) => ({ ...prevData, resume: file }));
      }
    };
    inputElement.click();
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setFormData((prevData) => ({ ...prevData, resume: file }));
    }
  };

  const fileInputRef = useRef(null);

  const handleReset = () => {
    setFormData({ name: "", jobRole: "", experience: "", skills: [], resume: null });
    setUploadedFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const resumeFile = formData.resume;
    if (resumeFile instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("uploadedResume", reader.result);
        dispatch(
          updateFormData({
            ...formData,
            resume: resumeFile.name,
            uploadedFile: reader.result,
          })
        );
        navigate("/interview-session");
      };
      reader.readAsDataURL(resumeFile);
    } else {
      dispatch(updateFormData(formData));
      navigate("/interview-session");
    }
  };
  

  const selectedSkills = jobData[formData.jobRole] || [];
  const additionalSkills = experienceLevels[formData.experience] || [];

  const formSectionRef = useRef(null);

  const handleScrollToForm = () => {
    formSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <section className="interview-hero">
        <div className="interview-hero__container">
          <div className="interview-hero__content">
            <h1>Ace Your Dream <span>Job Interview</span></h1>
            <p>AI-powered mock interviews tailored to your career goals.</p>
            <div className="interview-hero__cta-container">
              <button
                onClick={handleScrollToForm}
                className="interview-hero__cta-primary"
                style={{border:"none"}}
              >
                Start Mock Interview <FaArrowRight />
              </button>
              <Link to="/resume-validator" className="interview-hero__cta-secondary">Validate Your Resume</Link>
            </div>
          </div>
          <div className="interview-hero__illustration">
            <img src={interview} alt="Interview Illustration" />
          </div>
        </div>
      </section>

      <section className="interview-features">
        <div className="interview-features__container">
          <h2>How It Works</h2>
          <div className="interview-features__grid">
            {[
              { icon: FaUserGraduate, title: "Personalized Setup", desc: "Tell us about your job and skills." },
              { icon: FaBriefcase, title: "AI Simulation", desc: "Experience realistic interview scenarios." },
              { icon: FaArrowRight, title: "Instant Feedback", desc: "Get detailed analysis on your answers." },
            ].map((feature, index) => (
              <div key={index} className="interview-feature-card">
                <div className="interview-feature-card__icon-container">
                  <feature.icon className="interview-feature-card__icon" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="interview-form-section" ref={formSectionRef}>
        <div className="interview-form__wrapper">
          <div className="interview-form__text-section">
            <h2 className="interview-form__text-title"> <span>Ready to Nail Your</span> Interview?</h2>
            <p className="interview-form__text-description">Enter your details to get personalized AI-powered interview questions.</p>
            <img src={arrow} alt="arrow-image" className="arrow-image" />
          </div>

          <form onSubmit={handleSubmit} className="interview-form">
            <h2 className="interview-form__title">Fill in Your Information</h2>
            <div className="interview-form__row">
              <div className="interview-form__group">
                <label htmlFor="name" className="interview-form__label">Full Name</label>
                <div className="interview-form__input-container">
                  <FaUserGraduate className="interview-form__input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="interview-form__input"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div className="interview-form__group">
                <label htmlFor="jobRole" className="interview-form__label">Target Job Role</label>
                <div className="interview-form__input-container">
                  <FaBriefcase className="interview-form__input-icon" />
                  <select
                    id="jobRole"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    className="interview-form__select"
                    required
                  >
                    <option value="">Select your target job role</option>
                    {Object.keys(jobData).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="interview-form__group">
              <label className="interview-form__label">Experience Level</label>
              <div className="interview-form__radio-group">
                {Object.keys(experienceLevels).map((level) => (
                  <label key={level} className="interview-form__radio-label">
                    <input
                      type="radio"
                      name="experience"
                      value={level}
                      checked={formData.experience === level}
                      onChange={handleChange}
                      className="interview-form__radio-input"
                      required
                    />
                    <span>{level}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="interview-form__group">
              <label className="interview-form__label">Skills (Choose up to 6)</label>
              <div className="interview-form__skills-grid">
                {[...selectedSkills, ...additionalSkills].map((skill) => (
                  <label key={skill} className="interview-form__checkbox-label">
                    <input
                      type="checkbox"
                      value={skill}
                      checked={formData.skills.includes(skill)}
                      onChange={handleChange}
                      disabled={formData.skills.length >= 5 && !formData.skills.includes(skill)}
                      className="interview-form__checkbox-input"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="interview-form__group">
              <label className="interview-form__label">Upload Resume (Optional)</label>
              <div
                className="interview-form__file-input"
                onClick={handleDivClick}
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                ref={fileInputRef}
              >
                <FaFileUpload className="interview-form__file-icon" />
                {uploadedFile ? (
                  <span className="interview-form__file-text-success">{uploadedFile.name} uploaded successfully!</span>
                ) : (
                  <span className="interview-form__file-text">Drag & Drop or Click to Upload</span>
                )}
              </div>
            </div>

            <div className="interview-form__actions">
              <button type="submit" className="interview-form__submit-button">Submit</button>
              <button type="button" onClick={handleReset} className="interview-form__reset-button">Reset</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
export default InterviewForm;
