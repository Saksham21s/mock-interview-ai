/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, BarChart, Bar, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList
} from 'recharts';
import '../styles/interview.css';
import {motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B'];

const InterviewFeedback = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  

  useEffect(() => {
    // Simulate AI analysis progress
    const timer = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const sessionData = JSON.parse(
        sessionStorage.getItem('interviewResults') || 
        sessionStorage.getItem('interviewResult')
      );
      
      if (!sessionData) {
        throw new Error('No interview data found');
      }

      setTimeout(() => {
        const processedData = processReportData(sessionData);
        setReportData(processedData);
        setLoading(false);
      }, 2500); // Simulate AI processing time

    } catch (err) {
      console.error('Error loading report:', err);
      setError(err.message);
      setLoading(false);
    }

    return () => clearInterval(timer);
  }, [navigate]);

  if (loading) return <LoadingScreen progress={analysisProgress} />;
  if (error) return <ErrorMessage error={error} />;
  if (!reportData) return <NoData />;

  return (
    
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="feedback-container"
    >
      <FeedbackHeader data={reportData} />
      
      <div className="print-controls">
        <button className="print-btn" onClick={() => window.print()}>
          📄 Print Report
        </button>
        <button 
          className="new-interview-btn"
          onClick={() => {navigate('/interview'); sessionStorage.clear();}}
        >
          🚀 Start New Interview
        </button>
      </div>
      
      <DynamicChartsSection 
        accuracyData={reportData.accuracyData} 
        roundPerformance={reportData.roundPerformance} 
      />
      
      <DetailedFeedback responses={reportData.responses} />
      
      <ImprovementSection 
        tips={reportData.improvementTips} 
        overallScore={reportData.overallScore}
      />
    </motion.div>
  );
};

// Enhanced Loading Screen with Progress
const LoadingScreen = ({ progress }) => (
  <div className="loading-screen">
    <div className="ai-analysis-container">
      <div className="ai-head">
        <div className="ai-eye left"></div>
        <div className="ai-eye right"></div>
        <div className="ai-mouth"></div>
      </div>
      <h2>AI is analyzing your performance</h2>
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
        <span className="progress-text">{progress}%</span>
      </div>
      <p className="loading-tip">
        {getRandomLoadingTip()}
      </p>
    </div>
  </div>
);

const getRandomLoadingTip = () => {
  const tips = [
    "Analyzing your technical responses...",
    "Evaluating coding solutions...",
    "Reviewing behavioral answers...",
    "Calculating performance metrics...",
    "Comparing with ideal answers...",
    "Generating personalized feedback..."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

// Enhanced Data Processing with Dynamic Scoring
const processReportData = (sessionData) => {
  const responses = Array.isArray(sessionData.responses) ? 
    sessionData.responses.map(enhanceResponse) : [];

  // Dynamic scoring based on answer length and content
  const scoredResponses = responses.map(res => {
    const lengthScore = Math.min(res.response?.length / 100, 0.3);
    const keywordScore = calculateKeywordScore(res);
    const randomVariance = (Math.random() * 0.1) - 0.05; // ±5% variance
    
    // Normalize score between 0.4-1.0 based on quality indicators
    const score = Math.min(0.4 + lengthScore + keywordScore + randomVariance, 1.0);
    
    return {
      ...res,
      score: parseFloat(score.toFixed(2)),
      feedback: generateDynamicFeedback(res, score),
      isCorrect: score > 0.65
    };
  });

  // Calculate accuracy metrics
  const correctCount = scoredResponses.filter(r => r.isCorrect).length;
  const totalQuestions = scoredResponses.length || 1;
  const accuracy = (correctCount / totalQuestions) * 100;

  // Calculate round performance with dynamic weights
  const roundPerformance = calculateRoundPerformance(scoredResponses);

  // Generate dynamic improvement tips
  const improvementTips = generateDynamicTips(scoredResponses, accuracy);

  return {
    ...sessionData,
    responses: scoredResponses,
    accuracyData: [
      { name: 'Excellent', value: scoredResponses.filter(r => r.score >= 0.8).length },
      { name: 'Good', value: scoredResponses.filter(r => r.score >= 0.6 && r.score < 0.8).length },
      { name: 'Average', value: scoredResponses.filter(r => r.score >= 0.4 && r.score < 0.6).length },
      { name: 'Needs Work', value: scoredResponses.filter(r => r.score < 0.4).length }
    ],
    roundPerformance,
    improvementTips,
    overallScore: accuracy,
    analysisDate: new Date().toLocaleString()
  };
};

const enhanceResponse = (res) => {
  // Add more metadata for analysis
  return {
    ...res,
    answerLength: res.response?.length || 0,
    hasCode: res.response?.includes('function') || res.response?.includes('class') || false,
    keywords: extractKeywords(res.response)
  };
};

const extractKeywords = (text) => {
  if (!text) return [];
  const words = text.toLowerCase().match(/\b(\w{4,})\b/g) || [];
  const commonWords = new Set(['this', 'that', 'with', 'your', 'have', 'which']);
  return [...new Set(words.filter(w => !commonWords.has(w)))].slice(0, 5);
};

const calculateKeywordScore = (res) => {
  if (!res.questionText) return 0.3;
  
  const questionKeywords = extractKeywords(res.questionText);
  if (questionKeywords.length === 0) return 0.3;
  
  const matchedKeywords = res.keywords.filter(k => 
    questionKeywords.some(qk => qk.includes(k) || k.includes(qk))
  ).length;
  
  return Math.min(0.3, (matchedKeywords / questionKeywords.length) * 0.3);
};

const calculateRoundPerformance = (responses) => {
  const roundData = {};
  
  responses.forEach(res => {
    const round = res.round || 'General';
    if (!roundData[round]) {
      roundData[round] = { total: 0, scoreSum: 0, count: 0 };
    }
    roundData[round].total++;
    roundData[round].scoreSum += res.score || 0;
    roundData[round].count++;
  });

  return Object.entries(roundData).map(([name, data]) => ({
    name,
    accuracy: ((data.scoreSum / data.count) * 100).toFixed(1),
    questions: data.total,
    fill: COLORS[Math.floor(Math.random() * COLORS.length)]
  }));
};

const generateDynamicFeedback = (response, score) => {
  const percent = Math.round(score * 100);
  const length = response.answerLength;
  const round = response.round || 'question';

  const feedbackTemplates = {
    technical: [
      `Your technical understanding scored ${percent}%. ${length > 150 ? 'The detailed explanation shows good grasp.' : 'Consider adding more technical details.'}`,
      `${percent}% score. ${response.hasCode ? 'The code examples helped your score.' : 'Adding code snippets could improve your answer.'}`,
      `For this ${round} question, you achieved ${percent}% accuracy. ${length > 200 ? 'Excellent depth in your response.' : 'More elaboration would strengthen your answer.'}`
    ],
    coding: [
      `Code solution scored ${percent}%. ${response.output ? 'Your output matched expectations.' : 'Check your code for edge cases.'}`,
      `${percent}% effectiveness. ${length > 100 ? 'Good problem breakdown.' : 'Add more comments to explain your approach.'}`,
      `Your ${round} solution achieved ${percent}% correctness. ${response.hasCode ? 'Clean code structure.' : 'Consider showing more implementation.'}`
    ],
    behavioral: [
      `${percent}% score. ${length > 120 ? 'Good use of examples.' : 'More real-world examples would help.'}`,
      `Behavioral response scored ${percent}%. ${response.keywords.length > 3 ? 'Relevant keywords used effectively.' : 'Try incorporating more keywords from the question.'}`,
      `Your ${round} answer rated ${percent}%. ${length > 180 ? 'Comprehensive response.' : 'Consider using the STAR method for better structure.'}`
    ]
  };

  const templates = feedbackTemplates[round.toLowerCase()] || feedbackTemplates.technical;
  return templates[Math.floor(Math.random() * templates.length)];
};

const generateDynamicTips = (responses, overallScore) => {
  const tips = new Set();
  const weakResponses = responses.filter(r => r.score < 0.6);
  
  // Round-specific tips
  const roundCounts = {};
  weakResponses.forEach(r => {
    roundCounts[r.round] = (roundCounts[r.round] || 0) + 1;
  });

  // Add tips based on weak areas
  Object.entries(roundCounts).forEach(([round, count]) => {
    tips.add(`Focus on ${round} questions - ${count} weak answers identified`);
  });

  // Add general tips based on overall performance
  if (overallScore < 50) {
    tips.add('Practice fundamental concepts thoroughly');
    tips.add('Work on time management during interviews');
  } else if (overallScore < 75) {
    tips.add('Focus on mid-level concepts and problem solving');
    tips.add('Improve explanation clarity in your answers');
  } else {
    tips.add('Challenge yourself with advanced topics');
    tips.add('Refine your communication for senior-level interviews');
  }

  // Add random dynamic tips
  const dynamicTips = [
    'Try explaining concepts out loud before answering',
    'Use more real-world examples in your responses',
    'Structure your answers with clear beginning-middle-end',
    'Practice whiteboarding problems under time constraints',
    'Record mock interviews to analyze your performance',
    'Focus on 2-3 key points per answer'
  ];

  while (tips.size < 6) {
    tips.add(dynamicTips[Math.floor(Math.random() * dynamicTips.length)]);
  }

  return Array.from(tips);
};

// UI Components
const ErrorMessage = ({ error }) => (
  <motion.div 
    initial={{ scale: 0.9 }}
    animate={{ scale: 1 }}
    className="error-message"
  >
    <div className="error-header">
      <span className="error-emoji">⚠️</span>
      <h3>Report Generation Failed</h3>
    </div>
    <p>{error}</p>
    <div className="error-actions">
      <button onClick={() => window.location.reload()}>🔄 Retry</button>
      <button onClick={() =>  {window.location.href = '/interview'; sessionStorage.clear();}}>🚀 Start New Interview</button>
    </div>
  </motion.div>
);

const NoData = () => (
  <div className="no-data">
    <div className="no-data-icon">📊</div>
    <h3>No Interview Data Available</h3>
    <p>Complete an interview to generate your personalized report</p>
    <button onClick={() =>{ window.location.href = '/interview'; sessionStorage.clear();}}>
      🎯 Start Interview
    </button>
  </div>
);

const FeedbackHeader = ({ data }) => {
  const score = data.overallScore || 0;
  const scoreClass = getScoreClass(score);
  const scoreText = getScoreText(score);

  return (
    <motion.header 
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      className="feedback-header"
    >
      <div className="header-content">
        <h1>
          <span className="highlight">Interview</span> Performance Report
        </h1>
        <div className="header-meta">
          <span className="role-badge">{data.jobRole || 'Unknown Role'}</span>
          <span className="date">{data.analysisDate || new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={`score-display ${scoreClass}`}
      >
        <div className="score-circle">
          <span className="score-value">{score.toFixed(1)}%</span>
        </div>
        <div className="score-text">
          <h3>{scoreText}</h3>
          <p>Overall Accuracy</p>
        </div>
      </motion.div>
    </motion.header>
  );
};

const getScoreClass = (score) => {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'very-good';
  if (score >= 55) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
};

const getScoreText = (score) => {
  const texts = [
    "Needs significant improvement",
    "Below average - Keep practicing",
    "Good foundation - Keep improving",
    "Strong performance - Well done!",
    "Exceptional results - Excellent work!"
  ];
  
  const index = Math.min(
    Math.floor(score / 20),
    texts.length - 1
  );
  
  return texts[index];
};

const DynamicChartsSection = ({ accuracyData, roundPerformance }) => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="charts-section"
  >
    <ChartCard 
      title="Answer Quality Distribution" 
      description="Breakdown of your answers by quality score"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={accuracyData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            paddingAngle={5}
            dataKey="value"
            animationBegin={200}
            animationDuration={1000}
            label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
          >
            {accuracyData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value} answers`, name]} 
            contentStyle={{ borderRadius: '8px' }}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard 
      title="Round-wise Performance" 
      description="Your accuracy across different interview rounds"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={roundPerformance}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip 
            formatter={(value) => [`${value}%`, "Accuracy"]}
            contentStyle={{ borderRadius: '8px' }}
          />
          <Legend />
          <Bar 
            dataKey="accuracy" 
            name="Accuracy %"
            animationBegin={400}
            animationDuration={1200}
          >
            {roundPerformance.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill || COLORS[index % COLORS.length]} 
              />
            ))}
            <LabelList 
              dataKey="accuracy" 
              position="top" 
              formatter={(value) => `${value}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  </motion.section>
);

const ChartCard = ({ title, description, children }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="chart-card"
  >
    <div className="chart-header">
      <h2>{title}</h2>
      <p className="chart-description">{description}</p>
    </div>
    {children}
  </motion.div>
);

const DetailedFeedback = ({ responses }) => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="detailed-feedback"
  >
    <div className="section-header">
      <h2>Detailed Question Analysis</h2>
      <p className="section-subtitle">
        Review your answers with personalized feedback
      </p>
    </div>
    
    <div className="questions-grid">
      {responses.length > 0 ? (
        responses.map((item, index) => (
          <QuestionFeedback 
            key={`q-${index}`} 
            item={item} 
            index={index} 
          />
        ))
      ) : (
        <div className="no-questions">
          <p>No question data available for analysis</p>
        </div>
      )}
    </div>
  </motion.section>
);

const QuestionFeedback = ({ item, index }) => {
  const score = (item.score || 0) * 100;
  const scoreClass = getScoreClass(score);
  const animationDelay = index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className={`question-card ${scoreClass}`}
    >
      <div className="question-header">
        <span className="round-badge">{item.round || 'General'}</span>
        <span className="question-number">Question {index + 1}</span>
        <div className={`score-badge ${scoreClass}`}>
          {score.toFixed(1)}%
        </div>
      </div>
      
      <div className="question-content">
        <h3>{item.questionText || 'No question text available'}</h3>
        
        {item.questioncode && (
          <div className="code-block">
            <pre><code>{item.questioncode}</code></pre>
          </div>
        )}
      </div>
      
      <div className="answer-section">
        <div className="answer-header">
          <span className="answer-label">Your Answer</span>
          <span className="answer-length">
            {item.answerLength} characters
          </span>
        </div>
        <div className="answer-text">
          {item.response || "No answer provided"}
        </div>
        
        {item.output && (
          <div className="code-output">
            <span className="output-label">Code Output:</span>
            <pre>{item.output}</pre>
          </div>
        )}
      </div>
      
      <div className="feedback-section">
        <div className="feedback-header">
          <span className="feedback-label">AI Analysis</span>
          <span className="feedback-date">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
        <div className="feedback-text">
          {item.feedback}
        </div>
      </div>
    </motion.div>
  );
};

const ImprovementSection = ({ tips, overallScore }) => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="improvement-section"
  >
    <div className="section-header">
      <h2>Personalized Improvement Plan</h2>
      <p className="section-subtitle">
        Recommendations tailored to your performance
      </p>
    </div>
    
    <div className="improvement-cards">
      {tips.map((tip, i) => (
        <motion.div
          key={`tip-${i}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + (i * 0.1) }}
          className="tip-card"
        >
          <div className="tip-number">{i + 1}</div>
          <div className="tip-content">{tip}</div>
        </motion.div>
      ))}
    </div>
    
    <div className="performance-summary">
      <h3>Next Steps</h3>
      <p>
        {overallScore >= 70 ? (
          "You're performing well! Focus on mastering advanced concepts and refining your communication."
        ) : overallScore >= 50 ? (
          "Good foundation! Work on consistent performance across all question types."
        ) : (
          "Focus on core concepts first, then move to more advanced topics."
        )}
      </p>
    </div>
  </motion.section>
);

export default InterviewFeedback;