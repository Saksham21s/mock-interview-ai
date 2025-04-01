import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFileName, setJobRole, setExperienceLevel, startAnalysis, analysisSuccess, analysisFailure } from '../redux/ValidatorSlice';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import AnalysisResults from './AnalysisResults';
import { Link } from 'react-router-dom';
import '../assets/styles/resumeValidator.scss';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const ResumeValidator = () => {
  const dispatch = useDispatch();
  const { fileName, jobRole, experienceLevel, isLoading, analysisResults, error } = useSelector(state => state.resume);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const jobRoles = [
    'Software Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'UI/UX Designer',
    'Product Manager'
  ];

  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Executive'
  ];

  const getKeywordsForRole = (role) => {
    const roleKeywords = {
      'Software Developer': [
        { keyword: 'Java', weight: 0.9, synonyms: ['J2EE', 'Spring', 'Hibernate'] },
        { keyword: 'Python', weight: 0.9, synonyms: ['Django', 'Flask', 'FastAPI'] },
        { keyword: 'C++', weight: 0.9, synonyms: ['STL', 'Competitive Programming'] },
        { keyword: 'Algorithms', weight: 0.9, synonyms: ['Problem Solving', 'Data Structures'] },
        { keyword: 'OOP', weight: 0.8, synonyms: ['Object-Oriented Programming', 'Design Patterns'] },
        { keyword: 'SQL', weight: 0.8, synonyms: ['MySQL', 'PostgreSQL', 'SQLite', 'MongoDB'] },
        { keyword: 'Version Control', weight: 0.8, synonyms: ['Git', 'GitHub', 'GitLab', 'Bitbucket'] },
        { keyword: 'Testing', weight: 0.7, synonyms: ['Unit Testing', 'Jest', 'Mocha', 'Selenium'] }
      ],
      'Frontend Developer': [
        { keyword: 'HTML', weight: 0.9, synonyms: ['HTML5'] },
        { keyword: 'CSS', weight: 0.9, synonyms: ['SCSS', 'SASS', 'TailwindCSS', 'Bootstrap', 'Material UI'] },
        { keyword: 'JavaScript', weight: 0.9, synonyms: ['ES6', 'TypeScript', 'Vanilla JS'] },
        { keyword: 'React', weight: 0.9, synonyms: ['Next.js', 'Redux', 'Context API'] },
        { keyword: 'UI/UX', weight: 0.8, synonyms: ['Responsive Design', 'Figma', 'Adobe XD'] },
        { keyword: 'Web Performance', weight: 0.7, synonyms: ['Lighthouse', 'Core Web Vitals', 'Lazy Loading'] }
      ],
      'Backend Developer': [
        { keyword: 'Node.js', weight: 0.9, synonyms: ['Express.js', 'NestJS', 'Koa.js'] },
        { keyword: 'Databases', weight: 0.9, synonyms: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'DynamoDB'] },
        { keyword: 'API Development', weight: 0.9, synonyms: ['REST', 'GraphQL', 'gRPC', 'Swagger', 'Postman'] },
        { keyword: 'Authentication', weight: 0.8, synonyms: ['JWT', 'OAuth', 'Firebase Auth', 'SSO'] },
        { keyword: 'Microservices', weight: 0.8, synonyms: ['Docker', 'Kubernetes', 'RabbitMQ', 'Kafka'] },
        { keyword: 'Cloud Services', weight: 0.7, synonyms: ['AWS', 'Azure', 'Google Cloud', 'Serverless'] }
      ],
      'Full Stack Developer': [
        { keyword: 'JavaScript', weight: 0.9, synonyms: ['TypeScript', 'ES6', 'Node.js'] },
        { keyword: 'React', weight: 0.9, synonyms: ['Next.js', 'Vue.js', 'Angular'] },
        { keyword: 'Node.js', weight: 0.9, synonyms: ['Express.js', 'NestJS', 'Koa.js'] },
        { keyword: 'Databases', weight: 0.8, synonyms: ['MongoDB', 'SQL', 'Redis', 'Firebase'] },
        { keyword: 'DevOps', weight: 0.7, synonyms: ['CI/CD', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'] },
        { keyword: 'Version Control', weight: 0.8, synonyms: ['Git', 'GitHub', 'GitLab', 'Bitbucket'] }
      ],
      'Data Scientist': [
        { keyword: 'Python', weight: 0.9, synonyms: ['Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn'] },
        { keyword: 'Machine Learning', weight: 0.9, synonyms: ['Deep Learning', 'TensorFlow', 'PyTorch', 'Keras'] },
        { keyword: 'Data Analysis', weight: 0.8, synonyms: ['EDA', 'Feature Engineering'] },
        { keyword: 'Big Data', weight: 0.8, synonyms: ['Hadoop', 'Spark', 'Dask', 'Snowflake'] },
        { keyword: 'SQL', weight: 0.7, synonyms: ['PostgreSQL', 'NoSQL', 'Google BigQuery'] },
        { keyword: 'AI Models', weight: 0.8, synonyms: ['LSTM', 'CNN', 'NLP', 'Transformers'] }
      ],
      'DevOps Engineer': [
        { keyword: 'CI/CD', weight: 0.9, synonyms: ['Jenkins', 'GitHub Actions', 'CircleCI', 'TravisCI'] },
        { keyword: 'Docker', weight: 0.9, synonyms: ['Kubernetes', 'Containerization', 'Helm'] },
        { keyword: 'Cloud Computing', weight: 0.9, synonyms: ['AWS', 'Azure', 'Google Cloud', 'Serverless', 'Terraform'] },
        { keyword: 'Infrastructure as Code', weight: 0.8, synonyms: ['Terraform', 'Ansible', 'Pulumi', 'CloudFormation'] },
        { keyword: 'Monitoring', weight: 0.8, synonyms: ['Prometheus', 'Grafana', 'Datadog', 'New Relic'] },
        { keyword: 'Networking', weight: 0.7, synonyms: ['Load Balancing', 'Nginx', 'API Gateway', 'Cloudflare'] }
      ]
    };
    
    return roleKeywords[role] || [];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const selectedFile = files[0];
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      dispatch(setFileName(selectedFile.name));
      dispatch(analysisFailure(null));
    } else {
      dispatch(analysisFailure('Please upload a PDF or DOCX file only.'));
    }
  };

  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          if (file.type === "application/pdf") {
            const pdf = await pdfjsLib.getDocument(event.target.result).promise;
            let text = "";
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => item.str).join(" ") + " ";
            }
            resolve(text);
          } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
            resolve(result.value);
          } else {
            reject("Unsupported file format");
          }
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const analyzeResume = async () => {
    if (!file || !jobRole || !experienceLevel) {
      dispatch(analysisFailure('Please fill all fields before analyzing.'));
      return;
    }

    dispatch(startAnalysis());

    try {
      const keywords = getKeywordsForRole(jobRole);
      const resumeText = await extractTextFromFile(file);
      const { matchPercentage, missingKeywords, matchedKeywords } = analyzeResumeContent(resumeText, keywords);

      const results = {
        matchPercentage,
        keywords: keywords.map(k => k.keyword),
        matchedKeywords,
        missingKeywords,
        suggestions: generateSuggestions(jobRole, experienceLevel, missingKeywords),
        score: calculateScore(matchPercentage, experienceLevel),
        jobRole,
        experienceLevel
      };

      dispatch(analysisSuccess(results));
    } catch (err) {
      console.error("Analysis error:", err);
      dispatch(analysisFailure('Analysis failed. Please try again.'));
    }
  };

  const analyzeResumeContent = (resumeText, keywords) => {
    const lowerResumeText = resumeText.toLowerCase();
    let totalPossibleWeight = 0;
    let matchedWeight = 0;
    const matchedKeywords = [];
    const missingKeywords = [];

    keywords.forEach(keywordObj => {
      totalPossibleWeight += keywordObj.weight;
      
      // Check both main keyword and synonyms
      const allKeywords = [keywordObj.keyword.toLowerCase(), ...(keywordObj.synonyms?.map(s => s.toLowerCase()) || [])];
      const found = allKeywords.some(kw => lowerResumeText.includes(kw));

      if (found) {
        matchedWeight += keywordObj.weight;
        matchedKeywords.push(keywordObj.keyword);
      } else {
        missingKeywords.push(keywordObj.keyword);
      }
    });

    const matchPercentage = Math.round((matchedWeight / totalPossibleWeight) * 100);
    
    return {
      matchPercentage,
      matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 5) // Return top 5 missing
    };
  };

  const generateSuggestions = (jobRole, experienceLevel, missingKeywords) => {
    const suggestions = [];
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Add these keywords: ${missingKeywords.join(', ')}`);
    }

    switch(experienceLevel) {
      case 'Entry Level':
        suggestions.push('Highlight relevant coursework and projects');
        break;
      case 'Mid Level':
        suggestions.push('Quantify achievements with metrics');
        break;
      case 'Senior Level':
        suggestions.push('Showcase leadership experience');
        break;
      case 'Executive':
        suggestions.push('Focus on strategic impact');
        break;
    }

    suggestions.push(
      'Use action verbs like "developed", "implemented"',
      'Keep bullet points concise (1-2 lines)'
    );

    return suggestions.slice(0, 5);
  };

  const calculateScore = (matchPercentage, experienceLevel) => {
    const levelModifier = {
      'Entry Level': 0.9,
      'Mid Level': 1.0,
      'Senior Level': 1.1,
      'Executive': 1.2
    }[experienceLevel] || 1.0;

    return Math.min(100, Math.round(matchPercentage * levelModifier));
  };

  return (
    <div className="resume-validator-container">
      <Link to="/" className="home-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Back to Home
      </Link>

      {analysisResults ? (
        <AnalysisResults />
      ) : (
        <div className="validator-form">
          <h1>Resume Analyzer</h1>
          <p className="subtitle">Get instant feedback on your resume's effectiveness</p>
          
          <div 
            className={`file-upload ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              id="resume-upload" 
              accept=".pdf,.docx" 
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <label htmlFor="resume-upload">
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              {fileName ? (
                <div className="file-info">
                  <p>{fileName}</p>
                  <button type="button" onClick={() => {
                    setFile(null);
                    dispatch(setFileName(null));
                  }} className="change-file">
                    Change File
                  </button>
                </div>
              ) : (
                <>
                  <p>Drag & drop your resume</p>
                  <p className="or">or</p>
                  <button type="button" className="browse-btn" onClick={() => fileInputRef.current.click()}>
                    Select File
                  </button>
                  <p className="file-types">PDF or DOCX only</p>
                </>
              )}
            </label>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="job-role">Job Role</label>
              <select 
                id="job-role" 
                value={jobRole}
                onChange={(e) => dispatch(setJobRole(e.target.value))}
              >
                <option value="">Select role</option>
                {jobRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="experience-level">Experience</label>
              <select 
                id="experience-level" 
                value={experienceLevel}
                onChange={(e) => dispatch(setExperienceLevel(e.target.value))}
              >
                <option value="">Select level</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            onClick={analyzeResume}
            disabled={isLoading || !file || !jobRole || !experienceLevel}
            className={`analyze-btn ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : 'Analyze Now'}
          </button>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              <h3>Keyword Optimization</h3>
              <p>Identify missing keywords for better ATS performance</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3>Personalized Advice</h3>
              <p>Get tailored suggestions for your experience level</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeValidator;