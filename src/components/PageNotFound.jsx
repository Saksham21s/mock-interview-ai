import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaMoon, FaSun, FaRocket } from "react-icons/fa";
import "../styles/PageNotFound.css";

const NotFound = () => {
  const [theme, setTheme] = useState("dark");
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  // Floating astronaut animation + Pupils follow cursor
  useEffect(() => {
    const astronaut = document.querySelector(".astronaut");
    const eyes = document.querySelectorAll(".eye");
    let x = 0;
    let y = 0;
    let xSpeed = 0.5;
    let ySpeed = 0.3;

    const animateAstronaut = () => {
      x += xSpeed;
      y += ySpeed;

      if (x > window.innerWidth - 100 || x < 0) xSpeed *= -1;
      if (y > window.innerHeight - 100 || y < 0) ySpeed *= -1;

      if (astronaut) {
        astronaut.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`;
      }
      requestAnimationFrame(animateAstronaut);
    };
    animateAstronaut();

    const movePupils = (e) => {
      const { clientX: mouseX, clientY: mouseY } = e;
      eyes.forEach((eye) => {
        const rect = eye.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2; 
        const eyeY = rect.top + rect.height / 2; 

        const angleX = (mouseX - eyeX) / 20; 
        const angleY = (mouseY - eyeY) / 20;

        eye.querySelector(".pupil").style.transform = `translate(${angleX}px, ${angleY}px)`;
      });
    };

    document.addEventListener("mousemove", movePupils);
    return () => document.removeEventListener("mousemove", movePupils); 
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className={`not-found-container ${theme}`}>
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="astronaut">👨‍🚀</div>

      <div className="content">
        <div className="glitch-container">
          <h1 className="glitch" data-text="404">
            404
          </h1>
          <h2>Lost in Space</h2>
          <p className="subtitle">
            The page you're looking for has been abducted by aliens
          </p>
        </div>

        <div className="eyes">
          <div className="eye">
            <div className="pupil"></div>
          </div>
          <div className="eye">
            <div className="pupil"></div>
          </div>
        </div>

        <button
          className="home-button"
          onClick={() => navigate("/")}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isHovering ? (
            <FaRocket className="rocket-icon" />
          ) : (
            <FaHome className="home-icon" />
          )}
          Beam Me Home
        </button>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
};

export default NotFound;
