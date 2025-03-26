import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import Interview from './pages/Interview';
import ResumeValidation from './pages/ResumeValidation';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/resume-validation" element={<ResumeValidation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
