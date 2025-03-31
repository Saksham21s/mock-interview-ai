import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Interview from "./pages/Interviewform";
import ResumeValidation from "./pages/ResumeValidation";
import InterviewSession from "./pages/InterviewSession";
import Reports from "./pages/Reports";
import PageNotFound from "./components/PageNotFound";
import MoveToTopButton from "./components/MoveToTopButton"; 

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname === "/" || location.pathname === "/interview";
  const showMoveToTop = location.pathname !== "/interview-session"; // Hide button only on this page

  return (
    <div>
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/resume-validation" element={<ResumeValidation />} />
        <Route path="/interview-session" element={<InterviewSession />} />
        <Route path="/report" element={<Reports />} />
        <Route path="*" element={<PageNotFound />} /> {/* 404 Route */}
      </Routes>

      {/* Show Move to Top button on all pages except /interview-session */}
      {showMoveToTop && <MoveToTopButton />}
    </div>
  );
}

export default App;
