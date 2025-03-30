import { createSlice } from '@reduxjs/toolkit';

// Load saved job role from session storage
const savedRole = sessionStorage.getItem("currentJobRole") || '';

const initialState = {
  currentJobRole: savedRole,
  currentRound: 'Technical',
  currentQuestionIndex: 0,
  userResponse: '',
  timer: 30 * 60, 
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
    setCurrentJobRole: (state, action) => {
      state.currentJobRole = action.payload;
      sessionStorage.setItem("currentJobRole", action.payload);
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
    submitAnswer: (state) => {
      const currentQuestion = state.currentQuestions[state.currentQuestionIndex];

      if (!currentQuestion) return;

      const newResponse = {
        questionId: currentQuestion.id || '',
        round: state.currentRound,
        questionText: currentQuestion.text || '',
        questioncode: currentQuestion.code || '',
        response: state.userResponse,
        timestamp: new Date().toISOString(),
        language: state.selectedLanguage,
        output: state.output,
        isCorrect: false // Will be updated during analysis
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
    resetInterviewState: (state) => {
      const savedRole = sessionStorage.getItem("currentJobRole") || state.currentJobRole;
      return { ...initialState, currentJobRole: savedRole };
    },
    generatePerformanceMetrics: (state) => {
      const totalQuestions = state.responses.length || 1;

      const technicalQuestions = state.responses.filter((r) => r.round === 'Technical');
      const codingQuestions = state.responses.filter((r) => r.round === 'Coding');
      const behavioralQuestions = state.responses.filter((r) => r.round === 'Behavioral');

      const calculateScore = (filteredQuestions, baseScore, lengthThreshold) =>
        filteredQuestions.length > 0
          ? Math.min(
              100,
              Math.floor(
                (filteredQuestions.filter((q) => q.response.length > lengthThreshold).length /
                  filteredQuestions.length) *
                  100 +
                  baseScore
              )
            )
          : 0;

      const technicalScore = calculateScore(technicalQuestions, 70, 50);
      const codingScore = calculateScore(codingQuestions, 60, 0);
      const behavioralScore = calculateScore(behavioralQuestions, 75, 100);

      const overallScore = state.responses.length
        ? Math.round(
            (state.responses.filter(res => res.isCorrect).length / state.responses.length) * 100
          )
        : 0;

      state.performanceMetrics = {
        scores: {
          overall: overallScore,
          technical: technicalScore,
          coding: codingScore,
          behavioral: behavioralScore,
        },
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
      if (!state.performanceMetrics?.scores) return;

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
    calculateOverallScore: (state) => {
      if (!state.responses.length) return 0;
      return Math.round(
        (state.responses.filter(res => res.isCorrect).length / state.responses.length) * 100
      );
    }
  }
});

// Selectors
export const selectInterviewState = (state) => state.interview;
export const selectInterviewCompleted = (state) => state.interview.interviewCompleted;
export const selectInterviewResponses = (state) => state.interview.responses;
export const selectPerformanceMetrics = (state) => state.interview.performanceMetrics;
export const selectCurrentJobRole = (state) => state.interview.currentJobRole;
export const selectCurrentRound = (state) => state.interview.currentRound;
export const selectCurrentQuestions = (state) => state.interview.currentQuestions;
export const selectCurrentQuestionIndex = (state) => state.interview.currentQuestionIndex;
export const selectUserResponse = (state) => state.interview.userResponse;
export const selectTimer = (state) => state.interview.timer;
export const selectIsRunning = (state) => state.interview.isRunning;
export const selectOutput = (state) => state.interview.output;
export const selectSelectedLanguage = (state) => state.interview.selectedLanguage;
export const selectAIFeedback = (state) => state.interview.aiFeedback;

// Action exports
export const {
  setCurrentRound,
  setCurrentQuestionIndex,
  setUserResponse,
  setTimer,
  setIsRunning,
  setInterviewCompleted,
  setResponses,
  setCurrentJobRole,
  setOutput,
  setSelectedLanguage,
  setCurrentQuestions,
  setAIFeedback,
  setPerformanceMetrics,
  resetInterviewState,
  submitAnswer,
  generatePerformanceMetrics,
  generateAIFeedback,
  calculateOverallScore,
} = interviewSlice.actions;

export default interviewSlice.reducer;