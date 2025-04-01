import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import "../assets//styles/App.css"; 

const MoveToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isHidden = location.pathname === "/interview-session"; 

  useEffect(() => {
    if (isHidden) return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHidden]);

  if (isHidden) return null;

  return (
    <button 
      className={`move-to-top ${isVisible ? "visible" : ""}`} 
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <FaArrowUp className="arrow-icon" />
    </button>
  );
};

export default MoveToTopButton;
