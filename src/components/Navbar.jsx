import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/App.scss";
import logo from "../assets/logo.webp";
import { Sun, Moon } from "react-feather";

if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}

function NavBar() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="MoveSwift Logo" className="logo" />
          <span className="logo-text">JOBSCRAFT</span>
        </Link>
      </div>

      <div className="toggle-container">
        <label className="toggle-label">
          <input
            type="checkbox"
            className="toggle-checkbox"
            checked={darkMode}
            onChange={() => setDarkMode((prev) => !prev)}
          />
          <div className="toggle-slot">
            <div className="sun-icon-wrapper">
              <Sun className="sun-icon" />
            </div>
            <div className="toggle-button"></div>
            <div className="moon-icon-wrapper">
              <Moon className="moon-icon" />
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default NavBar;
