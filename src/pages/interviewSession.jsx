import React, { useState, useEffect, useRef } from 'react';
import { FaClock, FaCode, FaLaptopCode, FaUserTie, FaCheck, FaArrowRight, FaExpand, FaCompress, FaChartLine , FaStar, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setResponses, 
  setTimer, 
  setCurrentRound, 
  setCurrentQuestionIndex, 
  setUserResponse, 
  setOutput,
  setSelectedLanguage
} from '../redux/interviewSlice';
import Modal from '../components/ModelOverlay';
import CodeEditor from './CodeEditor';
import { questionsData } from './questions';
import '../styles/Interview.css';

const InterviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    responses,
    timer,
    currentRound,
    currentQuestionIndex,
    userResponse,
    output,
    selectedLanguage
  } = useSelector(state => state.interview);
  
  const [currentJobRole] = useState('Frontend Developer');
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEndInterviewModal, setShowEndInterviewModal] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [editorCode, setEditorCode] = useState('');
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const [currentQuestions, setCurrentQuestions] = useState(
    getRandomQuestions(questionsData[currentJobRole]['Technical'], 5)
  );

  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleRunCode = () => {
    try {
      let result;
      if (selectedLanguage === 'javascript') {
        result = eval(editorCode);
      } else if (selectedLanguage === 'python') {
        const pyodide = window.pyodide;
        if (pyodide) {
          result = pyodide.runPython(editorCode);
        } else {
          throw new Error('Python environment not loaded');
        }
      }
      dispatch(setOutput(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)));
    } catch (error) {
      dispatch(setOutput(`Error: ${error.message}`));
    }
  };

  const handleLanguageChange = (language) => {
    dispatch(setSelectedLanguage(language));
    setEditorCode(currentQuestion?.defaultCode || '');
  };

  const handleCodeChange = (code) => {
    setEditorCode(code || '');
  };

  const isDevToolsOpen = () => {
    const devToolsHeight = window.outerHeight - window.innerHeight;
    return devToolsHeight > 100;
  };

  const checkDevTools = () => {
    if (isDevToolsOpen() && document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error('Error exiting fullscreen:', err);
      });
    }
  };

  useEffect(() => {
    document.addEventListener('copy', event => event.preventDefault());
    document.addEventListener('paste', event => event.preventDefault());
    const devToolsInterval = setInterval(checkDevTools, 1000);
    
    return () => {
      document.removeEventListener('copy', event => event.preventDefault());
      document.removeEventListener('paste', event => event.preventDefault());
      clearInterval(devToolsInterval);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        containerRef.current.style.overflowY = 'auto';
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        containerRef.current.style.overflowY = 'hidden';
      });
    }
  };

  useEffect(() => {
    if (!isFullscreen && !document.fullscreenElement) {
      setIsModalOpen(true);
    }
  }, [isFullscreen]);

  const handleModalPrimaryAction = () => {
    setIsModalOpen(false);
    toggleFullscreen();
    setIsRunning(true);
  };

  const handleModalSecondaryAction = () => {
    setIsModalOpen(false);
    navigate('/interview');
  };

  useEffect(() => {
    if (isRunning && timer > 0) {
      timerRef.current = setTimeout(() => dispatch(setTimer(timer - 1)), 1000);
    } else if (timer === 0) endInterview();
    return () => clearTimeout(timerRef.current);
  }, [timer, isRunning]);

  useEffect(() => {
    if (currentRound === 'Technical') {
      setCurrentQuestions(getRandomQuestions(questionsData[currentJobRole]['Technical'], 5));
    } else if (currentRound === 'Coding') {
      setCurrentQuestions(questionsData[currentJobRole]['Coding']);
    } else {
      setCurrentQuestions(questionsData[currentJobRole]['Behavioral']);
    }
    dispatch(setCurrentQuestionIndex(0));
    dispatch(setUserResponse(''));
    dispatch(setOutput(''));
    setEditorCode('');
  }, [currentRound]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitQuestion = () => {
    const updatedResponses = [...responses, {
      questionId: currentQuestion.id,
      round: currentRound,
      questionText: currentQuestion.text,
      response: currentRound === 'Coding' ? editorCode : userResponse,
      timestamp: new Date().toISOString(),
      language: currentRound === 'Coding' ? selectedLanguage : null,
      output: currentRound === 'Coding' ? output : null
    }];

    dispatch(setResponses(updatedResponses));
    sessionStorage.setItem('interviewResponses', JSON.stringify(updatedResponses));

    if (currentQuestionIndex < currentQuestions.length - 1) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
      dispatch(setUserResponse(''));
      dispatch(setOutput(''));
      setEditorCode('');
    } else {
      const rounds = ['Technical', 'Coding', 'Behavioral'];
      const currentRoundIndex = rounds.indexOf(currentRound);
      if (currentRoundIndex < rounds.length - 1) {
        dispatch(setCurrentRound(rounds[currentRoundIndex + 1]));
      } else {
        endInterview();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const previousQuestion = currentQuestions[currentQuestionIndex - 1];
      const previousResponse = responses.find(response => response.questionId === previousQuestion.id)?.response || '';
      dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1));
      dispatch(setUserResponse(previousResponse));
      dispatch(setOutput(''));
      setEditorCode(previousResponse);
    }
  };

  const confirmEndInterview = () => setShowEndInterviewModal(true);
  const cancelEndInterview = () => setShowEndInterviewModal(false);

  const endInterview = () => {
    setShowEndInterviewModal(false);
    setIsRunning(false);
    setInterviewCompleted(true);
    clearTimeout(timerRef.current);
  };

  const getRoundIcon = (round) => {
    switch (round) {
      case 'Technical': return <FaLaptopCode />;
      case 'Coding': return <FaCode />;
      case 'Behavioral': return <FaUserTie />;
      default: return null;
    }
  };

  const calculateScore = () => {
    const totalQuestions = responses.length;
    const correctAnswers = responses.filter(r => r.round === 'Coding' && r.output && !r.output.includes('Error')).length;
    return Math.min(100, Math.floor((correctAnswers / totalQuestions) * 100) + 70);
  };

  if (interviewCompleted) {
    const score = calculateScore();
    return (
      <div className="interview-completed" ref={containerRef}>
        <button className="home-button" onClick={() => navigate("/")}>
          Move to Home
        </button>
        <div className="interview-completed__card">
          <div className="interview-completed__header">
            <h2>Interview Completed!</h2>
            <div className="score-circle">
              <div className="score-value">{score}</div>
              <div className="score-label">Overall Score</div>
            </div>
          </div>
          
          <div className="interview-completed__summary">
            <h3><FaChartLine /> Performance Summary</h3>
            <div className="interview-completed__metrics">
              <div className="metric">
                <span className="metric__value">{responses.length}</span>
                <span className="metric__label">Questions Answered</span>
              </div>
              <div className="metric">
                <span className="metric__value">{formatTime(30 * 60 - timer)}</span>
                <span className="metric__label">Time Taken</span>
              </div>
              <div className="metric">
                <span className="metric__value">{Math.floor(responses.length / ((30 * 60 - timer) / 60))}</span>
                <span className="metric__label">QPM</span>
              </div>
            </div>
            
            <div className="performance-breakdown">
              <div className="performance-category">
                <h4><FaStar /> Technical Round</h4>
                <div className="performance-bar">
                  <div className="performance-fill" style={{ width: `${Math.min(100, score + 10)}%` }}></div>
                </div>
              </div>
              <div className="performance-category">
                <h4><FaCode /> Coding Round</h4>
                <div className="performance-bar">
                  <div className="performance-fill" style={{ width: `${score}%` }}></div>
                </div>
              </div>
              <div className="performance-category">
                <h4><FaUserTie /> Behavioral Round</h4>
                <div className="performance-bar">
                  <div className="performance-fill" style={{ width: `${Math.min(100, score + 15)}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="interview-completed__feedback">
              <div className="feedback-section">
                <h4><FaLightbulb /> Key Strengths:</h4>
                <ul>
                  <li>Strong understanding of core concepts</li>
                  <li>Effective problem-solving approach</li>
                  <li>Clear communication of ideas</li>
                </ul>
              </div>
              <div className="feedback-section">
                <h4><FaLightbulb /> Improvement Areas:</h4>
                <ul>
                  <li>Could provide more detailed examples</li>
                  <li>Work on time management</li>
                  <li>Practice edge case consideration</li>
                </ul>
              </div>
            </div>
            
            <div className="action-buttons">
              <button className="primary-button">
                View Detailed Report <FaArrowRight />
              </button>
              <button className="secondary-button">
                Review Answers
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-page" ref={containerRef}>
      <div className="interview-container">
        <button className="fullscreen-toggle" onClick={toggleFullscreen}>
          {isFullscreen ? <FaCompress /> : <FaExpand />}
          {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </button>

        <div className="rounds-nav">
          {['Technical', 'Coding', 'Behavioral'].map((round) => (
            <div key={round} className={`rounds-nav__item ${currentRound === round ? 'active' : ''}`}>
              <div className="rounds-nav__icon">{getRoundIcon(round)}</div>
              <div className="rounds-nav__label">{round}</div>
              {currentRound === round && <div className="rounds-nav__indicator"></div>}
            </div>
          ))}
        </div>

        <div className="interview-main">
          <div className="question-area">
            <div className="question-header">
              <span className="question-header__round">{currentRound} Round</span>
              <span className="question-header__count">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </span>
            </div>
            <div className="question-text">{currentQuestion.text}</div>

            {currentRound === 'Coding' ? (
              <CodeEditor
                code={editorCode}
                onCodeChange={handleCodeChange}
                onRun={handleRunCode}
                language={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                output={output}
              />
            ) : currentQuestion?.type === 'output' ? (
              <div className="output-question-container">
                <div className="code-snippet-container">
                  <div className="code-snippet-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <pre className="code-snippet">{currentQuestion.code}</pre>
                </div>
                <div className="mcq-options">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="mcq-option">
                      <input
                        type="radio"
                        name="output"
                        value={option}
                        checked={userResponse === option}
                        onChange={(e) => dispatch(setUserResponse(e.target.value))}
                        className="mcq-option-input"
                      />
                      <span className="mcq-option-label">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-response-container">
                <textarea
                  className="response-input"
                  value={userResponse}
                  onChange={(e) => dispatch(setUserResponse(e.target.value))}
                  placeholder="Type your response here..."
                  rows={8}
                />
                <div className="word-count">
                  {userResponse.split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            )}

            <div className="response-actions">
              {currentQuestionIndex > 0 && (
                <button 
                  className="response-previous"
                  onClick={handlePreviousQuestion}
                  disabled={!isRunning}
                >
                  Previous
                </button>
              )}
              <button
                className={`response-submit ${(!userResponse.trim() && currentRound !== 'Coding') ? 'disabled' : ''}`}
                onClick={handleSubmitQuestion}
                disabled={(!userResponse.trim() && currentRound !== 'Coding') || !isRunning}
              >
                {currentQuestionIndex === currentQuestions.length - 1 && 
                 currentRound === 'Behavioral' ? 'Finish Interview' : 'Submit Answer'} 
                <FaCheck />
              </button>
            </div>
          </div>

          <div className="timer-sidebar">
            <div className="timer-display">
              <FaClock className="timer-icon" />
              <span className="timer-text">{formatTime(timer)}</span>
              <span className="timer-label">Remaining</span>
              {timer <= 300 && (
                <div className="time-warning">
                  {timer <= 60 ? 'Less than 1 minute left!' : 'Less than 5 minutes left!'}
                </div>
              )}
            </div>
            <div className="interview-info">
              <h4>Interview For:</h4>
              <p className="job-role">{currentJobRole}</p>
              <div className="progress-tracker">
                {['Technical', 'Coding', 'Behavioral'].map((round, index) => (
                  <div 
                    key={round}
                    className={`progress-step ${
                      (currentRound === round || 
                      (index < ['Technical', 'Coding', 'Behavioral'].indexOf(currentRound))) 
                      ? 'active' : ''
                    }`}
                  >
                    <div className="step-number">{index + 1}</div>
                    <span>{round}</span>
                    {currentRound === round && <div className="active-pulse"></div>}
                  </div>
                ))}
              </div>
              <div className="round-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{
                      width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`
                    }}
                  ></div>
                </div>
                <span>
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </span>
              </div>
            </div>
            <button 
              className="end-interview"
              onClick={confirmEndInterview}
              disabled={!isRunning}
            >
              End Interview
            </button>
            <div className="interview-tips">
              <h4>Quick Tips:</h4>
              <ul>
                <li>Answer clearly and confidently</li>
                <li>Think before you answer</li>
                <li>Ask for clarification if needed</li>
                {currentRound === 'Coding' && (
                  <li>Test your code with edge cases</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Fullscreen Mode"
        message="Enter Fullscreen to start the interview"
        primaryAction={{
          label: "Enter",
          onClick: handleModalPrimaryAction
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: handleModalSecondaryAction
        }}
      />

      <Modal
        isOpen={showEndInterviewModal}
        onClose={cancelEndInterview}
        title="Confirm Interview Completion"
        message="Are you sure you want to end the interview? Your progress will be saved and you can review your performance."
        primaryAction={{
          label: "Yes, End Interview",
          onClick: endInterview,
          variant: "danger"
        }}
        secondaryAction={{
          label: "Continue Interview",
          onClick: cancelEndInterview
        }}
      />
    </div>
  );
};

export default InterviewPage;