import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import Interview from './pages/Interviewform';
import ResumeValidation from './pages/ResumeValidation';
import InterviewSession from "./pages/interviewSession";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname === '/' || location.pathname === '/interview';

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/resume-validation" element={<ResumeValidation />} />
        <Route path="/interview-session" element={<InterviewSession />} />
      </Routes>
    </div>
  );
}

export default App;