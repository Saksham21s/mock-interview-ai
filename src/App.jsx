import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import Interview from './pages/Interviewform';
import ResumeValidation from './pages/ResumeValidation';
import InterviewSession from "./pages/interviewSession";
import Reports from "./pages/Reports";
import PageNotFound from "./components/PageNotFound";

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
        <Route path="/report" element={<Reports />} />
        <Route path="*" element={<PageNotFound />} /> {/* 404 Route */}
      </Routes>
    </div>
  );
}

export default App;
