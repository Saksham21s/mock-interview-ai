import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaClock, FaCode, FaLaptopCode, FaUserTie, FaCheck, FaArrowRight, FaExpand, FaCompress, FaChartLine, FaStar, FaLightbulb, FaHome } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setResponses,
  setTimer,
  setCurrentRound,
  setCurrentQuestionIndex,
  setUserResponse,
  setOutput,
  setSelectedLanguage,
  setCurrentJobRole,
  resetInterviewState
} from '../redux/interviewSlice';
import Modal from '../components/ModelOverlay';
import CodeEditor from './CodeEditor';
import { questionBank } from './questions';
import '../assets/styles/Interview.css';
import { toast } from 'react-toastify';
import CameraMonitor from './CameraMonitor';

const InterviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobRole: urlJobRole } = useParams();

  const {
    responses,
    timer,
    currentRound,
    currentQuestionIndex,
    userResponse,
    output,
    selectedLanguage,
    currentJobRole
  } = useSelector(state => state.interview);

  // Local state
  const memoizedQuestionsData = useMemo(() => questionBank, []);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showExitWarningModal, setShowExitWarningModal] = useState(false);
  const [showEndInterviewModal, setShowEndInterviewModal] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [editorCode, setEditorCode] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [cheatingWarnings, setCheatingWarnings] = useState([]);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const rounds = ['Technical', 'Coding', 'Behavioral'];
  const [visitedRounds, setVisitedRounds] = useState(new Set(['Technical']));

  // Start interview with camera permission check
  const startInterview = async () => {
    try {
      // Check if camera is accessible
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      
      // If camera works, proceed
      setIsInterviewActive(true);
      toggleFullscreen();
    } catch {
      toast.error("You must enable camera to continue!");
      return;
    }
  };

useEffect(() => {
  return () => {
    endInterview(); 
  };
}, []);

  // Camera monitoring handler
  const handleCheatingDetected = (type) => {
    const warnings = {
      NO_FACE: "No face detected! Please stay in frame.",
      MULTIPLE_FACES: "Multiple faces detected!",
      LOOKING_AWAY: "Looking away too often!",
      CAMERA_BLOCKED: "Camera access denied. Interview may be terminated.",
    };

    setCheatingWarnings(prev => [...prev, warnings[type]]);

    // Auto-end interview after 3 warnings
    if (cheatingWarnings.length >= 2) { // Changed to 2 warnings for stricter monitoring
      endInterview();
      toast.error("Interview terminated due to suspicious activity.");
    }
  };
  // Camera Monitoring using AI ends here //

  const handleRoundClick = (round) => {
    dispatch(setCurrentRound(round));
    setVisitedRounds(new Set([...visitedRounds, round]));
  };

  // Fetch job role from session storage
  useEffect(() => {
    let storedRole = sessionStorage.getItem('currentJobRole');

    if (!storedRole || storedRole.trim() === '') {
      storedRole = urlJobRole || 'Frontend Developer';
    }

    if (storedRole !== currentJobRole) {
      dispatch(setCurrentJobRole(storedRole));
      sessionStorage.setItem('currentJobRole', storedRole);
      dispatch(resetInterviewState());
      setInterviewCompleted(false);
      setIsRunning(false);
    }
  }, [urlJobRole, currentJobRole, dispatch]);

  // Save interview state to session storage
  useEffect(() => {
    if (currentJobRole) {
      const stateToSave = {
        responses,
        timer,
        currentRound,
        currentQuestionIndex,
        userResponse,
        output,
        selectedLanguage,
        currentJobRole,
      };

      sessionStorage.setItem('interviewState', JSON.stringify(stateToSave));
    }
  }, [responses, timer, currentRound, currentQuestionIndex, userResponse, output, selectedLanguage, currentJobRole]);

  // Load questions based on current job role and round
  useEffect(() => {
    if (currentJobRole && memoizedQuestionsData[currentJobRole]) {
      setLoadingQuestions(true);

      const roundData = memoizedQuestionsData[currentJobRole][currentRound];
      let questions = [];

      if (roundData) {
        if (currentRound === 'Technical') {
          questions = [...roundData].sort(() => Math.random() - 0.5).slice(0, 6);
        } else if (currentRound === 'Coding') {
          questions = [...roundData].slice(0, 2);
        } else if (currentRound === 'Behavioral') {
          questions = [...roundData].slice(0, 4);
        }
      }

      setCurrentQuestions(questions);
      setLoadingQuestions(false);

      if (questions.length > 0) {
        const firstQuestionDefaultCode = questions[0]?.defaultCode || '';
        setEditorCode(firstQuestionDefaultCode);
        dispatch(setUserResponse(''));
        dispatch(setOutput(''));
      }
    } else {
      console.warn("No questions found for role:", currentJobRole);
    }
  }, [currentJobRole, currentRound, memoizedQuestionsData, dispatch]);

  // Load and restore interview state from session storage
  useEffect(() => {
    const savedState = sessionStorage.getItem('interviewState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);

      if (
        JSON.stringify(parsedState.responses) !== JSON.stringify(responses) ||
        parsedState.timer !== timer ||
        parsedState.currentRound !== currentRound ||
        parsedState.currentQuestionIndex !== currentQuestionIndex ||
        parsedState.userResponse !== userResponse ||
        parsedState.output !== output ||
        parsedState.selectedLanguage !== selectedLanguage
      ) {
        dispatch(setResponses(parsedState.responses || []));
        dispatch(setTimer(parsedState.timer || 30 * 60));
        dispatch(setCurrentRound(parsedState.currentRound || 'Technical'));
        dispatch(setCurrentQuestionIndex(parsedState.currentQuestionIndex || 0));
        dispatch(setUserResponse(parsedState.userResponse || ''));
        dispatch(setOutput(parsedState.output || ''));
        dispatch(setSelectedLanguage(parsedState.selectedLanguage || 'javascript'));
        setEditorCode(parsedState.userResponse || '');
      }
    }
  }, [responses, timer, currentRound, currentQuestionIndex, userResponse, output, selectedLanguage, dispatch]);

  // Timer effect
  useEffect(() => {
    if (isRunning && timer > 0) {
      timerRef.current = setTimeout(() => {
        dispatch(setTimer(timer - 1));
      }, 1000);
    } else if (timer === 0) {
      endInterview();
    }
    return () => clearTimeout(timerRef.current);
  }, [timer, isRunning, dispatch]);

  // Fullscreen effects
  useEffect(() => {
    if (!document.fullscreenElement) {
      setIsModalOpen(true);
    }

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (!isCurrentlyFullscreen && isRunning && !interviewCompleted) {
        setShowExitWarningModal(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isRunning, interviewCompleted]);

  // Disable right click
  useEffect(() => {
    const disableContextMenu = (event) => event.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);
    return () => document.removeEventListener("contextmenu", disableContextMenu);
  }, []);

  // Updated toggle function & disabling scroll when not full screen 
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.()
        .then(() => {
          setIsRunning(true);
          setShowWelcomeModal(false);
          document.documentElement.style.overflowY = 'auto';
          containerRef.current.style.overflowY = 'auto';
        })
        .catch(err => console.error('Fullscreen error:', err));
    } else {
      document.exitFullscreen()
        .then(() => {
          document.documentElement.style.overflowY = 'hidden';
          containerRef.current.style.overflowY = 'hidden';
        });
    }
  };

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

  const handleSubmitQuestion = () => {
    if (!currentQuestion) return;

    const newResponse = {
      questionId: currentQuestion.id || '',
      round: currentRound,
      questionText: currentQuestion.text || '',
      questioncode: currentQuestion.code || '',
      response: currentRound === 'Coding' ? editorCode : userResponse,
      timestamp: new Date().toISOString(),
      language: currentRound === 'Coding' ? selectedLanguage : null,
      output: currentRound === 'Coding' ? output : null
    };

    const updatedResponses = [...responses, newResponse];
    dispatch(setResponses(updatedResponses));

    // Save to sessionStorage
    sessionStorage.setItem('responses', JSON.stringify(updatedResponses));
    const stateToSave = {
      responses: updatedResponses,
      timer,
      currentRound,
      currentQuestionIndex,
      userResponse: '',
      output: '',
      selectedLanguage,
      currentJobRole,
    };
    sessionStorage.setItem('interviewState', JSON.stringify(stateToSave));

    if (currentQuestionIndex < currentQuestions.length - 1) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
      dispatch(setUserResponse(''));
      dispatch(setOutput(''));
      if (currentRound === 'Coding') {
        setEditorCode(currentQuestions[currentQuestionIndex + 1]?.defaultCode || '');
      }
    } else {
      const nextRound = getNextRound(currentRound);
      if (nextRound) {
        dispatch(setCurrentRound(nextRound));
        dispatch(setCurrentQuestionIndex(0));
        setVisitedRounds(new Set([...visitedRounds, nextRound]));
      } else {
        endInterview();
      }
    }
  };

  const getNextRound = (current) => {
    const rounds = ['Technical', 'Coding', 'Behavioral'];
    const currentIndex = rounds.indexOf(current);
    return currentIndex < rounds.length - 1 ? rounds[currentIndex + 1] : null;
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const prevResponse = responses.find(r =>
        r.questionId === currentQuestions[prevIndex].id
      )?.response || '';

      dispatch(setCurrentQuestionIndex(prevIndex));
      dispatch(setUserResponse(prevResponse));
      dispatch(setOutput(''));
      setEditorCode(prevResponse);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceFeedback = () => {
    const roundsAttempted = new Set(responses.map(r => r.round)).size;

    if (roundsAttempted === 3) return { text: 'Excellent! You completed all rounds!', class: 'excellent' };
    if (roundsAttempted === 2) return { text: 'Good job! Keep pushing to complete all rounds!', class: 'good' };
    if (roundsAttempted === 1) return { text: 'Average! Try to attempt more rounds.', class: 'average' };
    return { text: 'No rounds attempted. Give it a shot!', class: 'no-attempt' };
  };

  const calculateProgress = () => {
    const totalRounds = 3;
    const currentRoundIndex = rounds.indexOf(currentRound);
    const roundProgress = (currentQuestionIndex + 1) / currentQuestions.length;
    return ((currentRoundIndex + roundProgress) / totalRounds) * 100;
  };

  const endInterview = () => {
    setIsInterviewActive(false); 
  setIsRunning(false);
  setInterviewCompleted(true);
  clearTimeout(timerRef.current);

    const interviewResults = {
      score: getPerformanceFeedback(),
      responses,
      timeTaken: formatTime(30 * 60 - timer),
      jobRole: currentJobRole,
      date: new Date().toISOString(),
      questionCounts: {
        technical: currentQuestions.filter(q => q.round === 'Technical').length,
        coding: currentQuestions.filter(q => q.round === 'Coding').length,
        behavioral: currentQuestions.filter(q => q.round === 'Behavioral').length
      },
      cheatingWarnings
    };

    try {
      sessionStorage.setItem('interviewResults', JSON.stringify(interviewResults));
      sessionStorage.setItem('responses', JSON.stringify(responses));
    } catch (error) {
      console.error('Failed to save interview results:', error);
    }
  };

  const currentQuestion = currentQuestions[currentQuestionIndex] || {};

  if (interviewCompleted) {
    const score = getPerformanceFeedback();
    return (
      <div className="interview-completed" ref={containerRef}>
        <div className="interview-completed__card">
          <div className="interview-completed__header">
            <h2>Interview Completed!</h2>
            <div className="score-circle">
              <div className={`score-value ${score.class}`}>{score.text}</div>
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
                <span className="metric__value" style={{ fontSize: '1.3rem' }}>{currentJobRole}</span>
                <span className="metric__label">Job Role</span>
              </div>
            </div>

            <div className="performance-breakdown">
              <div className="performance-category">
                <h4><FaStar /> Technical Round</h4>
                <div className="performance-bar">
                  <div className="performance-fill" style={{ width: `${Math.min(100, responses.filter(r => r.round === 'Technical').length * 20)}%` }}></div>
                </div>
              </div>
              <div className="performance-category">
                <h4><FaCode /> Coding Round</h4>
                <div className="performance-bar">
                  <div className="performance-fill" style={{ width: `${Math.min(100, responses.filter(r => r.round === 'Coding').length * 50)}%` }}></div>
                </div>
              </div>
              <div className="performance-category">
                <h4><FaUserTie /> Behavioral Round</h4>
                <div className="performance-bar">
                  <div className="performance-fill" style={{ width: `${Math.min(100, responses.filter(r => r.round === 'Behavioral').length * 25)}%` }}></div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="primary-button"
                onClick={() => {
                  endInterview();
                  setTimeout(() => navigate('/report', { replace: true }), 100);
                }}
              >
                View Detailed Report <FaArrowRight />
              </button>
              <button
                className="secondary-button"
                onClick={() => navigate('/resume-validator')}
              >
                Validate Resume
              </button>
            </div>
          </div>
        </div>
        <button className="home-button-interview-completed" onClick={() => {
          navigate("/");
          setTimeout(() => {
            sessionStorage.clear();
          }, 100);
        }}>
          <FaHome /> Return to Home
        </button>
      </div>
    );
  }

  if (loadingQuestions) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h2>Preparing {currentJobRole} Interview</h2>
          <div className="loading-spinner"></div>
          <p>Loading {currentRound.toLowerCase()} questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-page" ref={containerRef}>
      <div className="overall-progress">
        <div
          className="progress-fill"
          style={{ width: `${calculateProgress()}%` }}
          data-label={`${Math.round(calculateProgress())}% Complete`}
        ></div>
      </div>

      <div className="interview-container">
        <button className="fullscreen-toggle" onClick={toggleFullscreen}>
          {isFullscreen ? <FaCompress /> : <FaExpand />}
          {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </button>

        <div className="rounds-nav">
          {rounds.map((round, index) => {
            const isActive = currentRound === round;
            const isVisited = visitedRounds.has(round);
            const isNext = isVisited || (index > 0 && visitedRounds.has(rounds[index - 1]));

            return (
              <div
                key={round}
                className={`rounds-nav__item ${isActive ? 'active' : ''} ${!isNext ? 'disabled' : ''}`}
                onClick={() => isNext && handleRoundClick(round)}
              >
                <div className="rounds-nav__icon">
                  {round === 'Technical' ? <FaLaptopCode /> :
                    round === 'Coding' ? <FaCode /> : <FaUserTie />}
                </div>
                <div className="rounds-nav__label">{round}</div>
                {isActive && <div className="rounds-nav__indicator"></div>}
              </div>
            );
          })}
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
                onCodeChange={(code) => setEditorCode(code)}
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
                  {currentQuestion.options?.map((option, index) => (
                    <label key={index} className="mcq-option">
                      <input
                        type="radio"
                        name="output"
                        value={option}
                        checked={userResponse === option}
                        onChange={(e) => dispatch(setUserResponse(e.target.value))}
                      />
                      <span className="mcq-option-label">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-response-container">
                <textarea
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
                >
                  Previous
                </button>
              )}
              <button
                className="response-submit"
                onClick={handleSubmitQuestion}
                disabled={!userResponse.trim() && currentRound !== 'Coding'}
              >
                {currentQuestionIndex === currentQuestions.length - 1 && currentRound === 'Behavioral'
                  ? 'Finish Interview'
                  : 'Submit Answer'}
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

            <div className="camera-monitor-container">
            <CameraMonitor 
              onCheatingDetected={handleCheatingDetected} 
              isInterviewActive={isInterviewActive && !interviewCompleted}
            />
            {cheatingWarnings.length > 0 && (
              <div className="cheating-alerts">
                <h4>⚠️ Warnings:</h4>
                {cheatingWarnings.map((msg, i) => (
                  <p key={i}>{msg}</p>
                ))}
              </div>
            )}
          </div>

            <div className="interview-info">
              <h4>Interview For:</h4>
              <p className="job-role">{currentJobRole}</p>

              <div className="progress-tracker">
                {rounds.map((round, index) => (
                  <div
                    key={round}
                    className={`progress-step ${currentRound === round ||
                      index < rounds.indexOf(currentRound)
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
              onClick={() => setShowEndInterviewModal(true)}
            >
              End Interview
            </button>

            <div className="interview-tips">
              <h4>Quick Tips:</h4>
              <ul className="diamond-list">
                <li>Answer clearly and confidently</li>
                <li>Exiting Full screen mode will end the interview</li>
                <li>Ask for clarification if needed</li>
                {currentRound === 'Coding' && <li>Test your code with edge cases</li>}
                {currentRound === 'Behavioral' && <li>Use the STAR method for answers</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showWelcomeModal}
        onClose={() => navigate('/')}
        title="📸 Camera Required"
        message={
          <div className="welcome-message">
            <p><strong>This interview requires camera monitoring.</strong></p>
            <ul>
              <li>✅ Camera must stay ON throughout</li>
              <li>❌ No switching tabs/minimizing</li>
              <li>⚠️ 3 warnings will end the interview</li>
            </ul>
          </div>
        }
        primaryAction={{
          label: "I Accept - Start Interview",
          onClick: startInterview,
          icon: <FaArrowRight />
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => navigate('/'),
          variant: "secondary"
        }}
      />

      <Modal
        isOpen={showExitWarningModal}
        onClose={() => {
          setShowExitWarningModal(false);
          navigate('/interview');
          sessionStorage.clear();
        }}
        title="Interview Paused"
        message={
          <div className="exit-warning-message">
            <p>You've exited fullscreen mode. Your interview has been paused.</p>
          </div>
        }
        primaryAction={{
          label: "Resume Interview",
          onClick: () => {
            toggleFullscreen();
            setShowExitWarningModal(false);
          },
          icon: <FaExpand />
        }}
        secondaryAction={{
          label: "End Interview",
          onClick: () => {
            endInterview();
            navigate('/interview');
            sessionStorage.clear();
          },
          variant: "danger"
        }}
      />

      <Modal
        isOpen={showEndInterviewModal}
        onClose={() => setShowEndInterviewModal(false)}
        title="End Interview?"
        message="Are you sure you want to end the interview?"
        primaryAction={{
          label: "Yes, End Now",
          onClick: endInterview,
          variant: "danger"
        }}
        secondaryAction={{
          label: "Continue Interview",
          onClick: () => setShowEndInterviewModal(false)
        }}
      />
    </div>
  );
};

export default InterviewPage;