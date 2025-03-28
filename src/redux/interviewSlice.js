import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentJobRole: 'Frontend Developer',
  currentRound: 'Technical',
  currentQuestionIndex: 0,
  userResponse: '',
  timer: 30 * 60, // 30 minutes in seconds
  isRunning: false,
  interviewCompleted: false,
  responses: [],
  output: '',
  selectedLanguage: 'javascript',
  currentQuestions: [],
  aiFeedback: null,
  performanceMetrics: null,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCurrentRound: (state, action) => {
      state.currentRound = action.payload;
      state.currentQuestionIndex = 0;
      state.userResponse = '';
      state.output = '';
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setUserResponse: (state, action) => {
      state.userResponse = action.payload;
    },
    setTimer: (state, action) => {
      state.timer = action.payload;
    },
    setIsRunning: (state, action) => {
      state.isRunning = action.payload;
    },
    setInterviewCompleted: (state, action) => {
      state.interviewCompleted = action.payload;
    },
    setResponses: (state, action) => {
      state.responses = action.payload;
    },
    setOutput: (state, action) => {
      state.output = action.payload;
    },
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setCurrentQuestions: (state, action) => {
      state.currentQuestions = action.payload;
    },
    setAIFeedback: (state, action) => {
      state.aiFeedback = action.payload;
    },
    setPerformanceMetrics: (state, action) => {
      state.performanceMetrics = action.payload;
    },
    resetInterview: (state) => {
      Object.assign(state, {
        ...initialState,
        currentJobRole: state.currentJobRole, // Persist the job role
      });
    },
    submitAnswer: (state) => {
      const currentQuestion = state.currentQuestions[state.currentQuestionIndex] || {};
      const newResponse = {
        questionId: currentQuestion.id || '',
        round: state.currentRound,
        questionText: currentQuestion.text || '',
        response: state.userResponse,
        timestamp: new Date().toISOString(),
        language: state.selectedLanguage,
        output: state.output,
      };

      state.responses.push(newResponse);
      state.userResponse = '';
      state.output = '';

      if (state.currentQuestionIndex < state.currentQuestions.length - 1) {
        state.currentQuestionIndex += 1;
      } else {
        const rounds = ['Technical', 'Coding', 'Behavioral'];
        const nextRoundIndex = rounds.indexOf(state.currentRound) + 1;

        if (nextRoundIndex < rounds.length) {
          state.currentRound = rounds[nextRoundIndex];
          state.currentQuestionIndex = 0;
        } else {
          state.interviewCompleted = true;
          state.isRunning = false;
        }
      }
    },
    generatePerformanceMetrics: (state) => {
      const totalQuestions = state.responses.length || 1; // Avoid division by 0
      const technicalQuestions = state.responses.filter(r => r.round === 'Technical');
      const codingQuestions = state.responses.filter(r => r.round === 'Coding');
      const behavioralQuestions = state.responses.filter(r => r.round === 'Behavioral');

      const calculateScore = (filteredQuestions, baseScore, lengthThreshold) => {
        return Math.min(
          100,
          Math.floor((filteredQuestions.filter(q => q.response.length > lengthThreshold).length / filteredQuestions.length) * 100 + baseScore)
        );
      };

      const technicalScore = calculateScore(technicalQuestions, 70, 50);
      const codingScore = calculateScore(codingQuestions, 60, 0); // Consider non-error outputs
      const behavioralScore = calculateScore(behavioralQuestions, 75, 100);

      const overallScore = Math.floor((technicalScore + codingScore + behavioralScore) / 3);

      state.performanceMetrics = {
        scores: { overall: overallScore, technical: technicalScore, coding: codingScore, behavioral: behavioralScore },
        strengths: ['Good problem decomposition', 'Clear communication', 'Solid technical foundation'],
        improvements: ['Could use more examples', 'Handle edge cases better', 'More detailed explanations'],
        timePerQuestion: Math.floor((30 * 60 - state.timer) / totalQuestions),
        questionBreakdown: {
          technical: technicalQuestions.length,
          coding: codingQuestions.length,
          behavioral: behavioralQuestions.length,
        },
      };
    },
    generateAIFeedback: (state) => {
      if (!state.performanceMetrics) return;

      const { scores } = state.performanceMetrics;
      const getFeedback = (score, category) => ({
        rating: Math.floor(score / 20),
        feedback: `Your ${category} skills scored ${score}/100. ${
          score > 80 ? 'Excellent' : 'Good'
        } performance, but more practical examples could strengthen your knowledge.`,
      });

      state.aiFeedback = {
        technical: getFeedback(scores.technical, 'technical'),
        coding: getFeedback(scores.coding, 'coding'),
        behavioral: getFeedback(scores.behavioral, 'behavioral'),
      };
    },
  },
});

export const {
  setCurrentRound,
  setCurrentQuestionIndex,
  setUserResponse,
  setTimer,
  setIsRunning,
  setInterviewCompleted,
  setResponses,
  setOutput,
  setSelectedLanguage,
  setCurrentQuestions,
  setAIFeedback,
  setPerformanceMetrics,
  resetInterview,
  submitAnswer,
  generatePerformanceMetrics,
  generateAIFeedback,
} = interviewSlice.actions;

export default interviewSlice.reducer;
