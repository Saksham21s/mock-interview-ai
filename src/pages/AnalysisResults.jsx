import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetAnalysis } from '../redux/ValidatorSlice';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Link } from 'react-router-dom';
import '../styles/resumeValidator.scss';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AnalysisResults = () => {
  const dispatch = useDispatch();
  const { analysisResults } = useSelector(state => state.resume);
  const { matchPercentage, keywords, missingKeywords, suggestions, score, jobRole, experienceLevel } = analysisResults;

  const handleNewAnalysis = () => {
    dispatch(resetAnalysis());
  };

  const doughnutData = {
    labels: ['Match', 'Missing'],
    datasets: [
      {
        data: [matchPercentage, 100 - matchPercentage],
        backgroundColor: ['#00b894', '#d63031'],
        borderWidth: 0,
      },
    ],
  };

  const keywordsData = {
    labels: ['Present', 'Missing'],
    datasets: [
      {
        data: [keywords.length - missingKeywords.length, missingKeywords.length],
        backgroundColor: ['#00b894', '#d63031'],
      },
    ],
  };

  return (
    <div className="analysis-results">
      <div className="results-header">
        <h1>Analysis Complete</h1>
        <p className="subtitle">{jobRole} • {experienceLevel}</p>
      </div>
      
      <div className="score-summary">
        <div className="score-circle" style={{ '--score-percentage': score }}>
          <div className="score-value">{score}</div>
          <div className="score-label">ATS Score</div>
        </div>
        <div className="score-description">
          <p>
            {score >= 80 ? 'Excellent! ' : score >= 60 ? 'Good job! ' : 'Needs improvement. '}
             Your resume is {score >= 80 ? 'well optimized' : score >= 60 ? 'mostly optimized ' : 'not optimized enough'} 
            for {jobRole} positions.
          </p>
        </div>
      </div>
      
      <div className="results-grid">
        <div className="chart-container">
          <h3>Keyword Match Rate</h3>
          <div className="doughnut-chart">
            <Doughnut 
              data={doughnutData}
              options={{
                cutout: '70%',
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
            <div className="chart-center-text">{matchPercentage}%</div>
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Keyword Analysis</h3>
          <div className="bar-chart">
            <Bar 
              data={keywordsData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
          {missingKeywords.length > 0 && (
            <p className="missing-keywords">
              Missing: <strong>{missingKeywords.join(', ')}</strong>
            </p>
          )}
        </div>
      </div>
      
      <div className="suggestions-section">
        <h2>Optimization Tips</h2>
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              <div className="suggestion-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <div className="suggestion-text">{suggestion}</div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="action-buttons">
        <button onClick={handleNewAnalysis} className="analyze-again-btn">
          Analyze Another Resume
        </button>
        <a href='https://jobscraft.vercel.app/'  target="_blank" rel="noopener noreferrer" className="resume-builder-link">
          Build Better Resume
        </a>
      </div>
    </div>
  );
};

export default AnalysisResults;