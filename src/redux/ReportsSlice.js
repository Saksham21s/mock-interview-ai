import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { questionBank } from '../pages/questions';

// Initial state
const initialState = {
  data: null,
  loading: false,
  error: null,
  lastAnalyzed: null
};

// Enhanced scoring system
function getScoreText(score) {
  if (score >= 90) return "Excellent!";
  if (score >= 75) return "Very Good!";
  if (score >= 60) return "Good job!";
  if (score >= 45) return "Fair attempt";
  return "Needs improvement";
}

function getScoreClass(score) {
  if (score >= 90) return "excellent";
  if (score >= 75) return "very-good";
  if (score >= 60) return "good";
  if (score >= 45) return "fair";
  return "poor";
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Enhanced similarity algorithm
function calculateEnhancedSimilarity(response, correctAnswer) {
  if (!response || !correctAnswer) return 0;
  
  // Normalize text
  const normalize = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const normResponse = normalize(response);
  const normCorrect = normalize(correctAnswer);
  
  // Exact match
  if (normResponse === normCorrect) return 1.0;
  
  // Keyword matching
  const responseWords = new Set(normResponse.split(/\s+/));
  const correctWords = new Set(normCorrect.split(/\s+/));
  
  // Calculate keyword overlap
  const intersection = new Set(
    [...responseWords].filter(word => correctWords.has(word))
  );
  
  // Calculate coverage score (how much of correct answer is covered)
  const keywordScore = intersection.size / correctWords.size;
  
  // Calculate response completeness (how much of response is relevant)
  const relevanceScore = intersection.size / Math.max(1, responseWords.size);
  
  // Length similarity (penalize very short answers)
  const lengthScore = 1 - (Math.abs(normResponse.length - normCorrect.length) / 
                         Math.max(normCorrect.length, 1));
  
  // Combined score with weights
  return (keywordScore * 0.5) + (relevanceScore * 0.3) + (lengthScore * 0.2);
}

// Context-aware feedback generation
function generateFeedback(score, response, correctAnswer) {
  if (score > 0.85) {
    return "Excellent answer! You've demonstrated complete understanding of the concept.";
  }
  if (score > 0.7) {
    return "Very good answer! You've covered most key points.";
  }
  if (score > 0.55) {
    const missing = getMissingKeywords(response, correctAnswer);
    return `Good attempt. Could improve by mentioning: ${missing.join(', ')}`;
  }
  if (score > 0.4) {
    return "Partial answer. Review the concept and try to cover more key points.";
  }
  return "Incorrect answer. Please review this concept thoroughly.";
}

// Helper to identify missing keywords
function getMissingKeywords(response, correctAnswer) {
  const normalize = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const respWords = new Set(normalize(response).split(/\s+/));
  const correctWords = normalize(correctAnswer).split(/\s+/).filter(w => w.length > 3);
  
  return correctWords.filter(word => !respWords.has(word)).slice(0, 3);
}

// Find question in questionBank
function findQuestion(jobRole, questionId) {
  if (!questionBank[jobRole]) return null;
  
  for (const category of ['Technical', 'Coding', 'Behavioral']) {
    if (questionBank[jobRole][category]) {
      const found = questionBank[jobRole][category].find(q => q.id === questionId);
      if (found) return found;
    }
  }
  return null;
}

// Selectors
export const selectFeedbackState = (state) => state.feedback || initialState;
export const selectFeedbackData = createSelector([selectFeedbackState], (feedback) => feedback.data);
export const selectFeedbackLoading = createSelector([selectFeedbackState], (feedback) => feedback.loading);
export const selectFeedbackError = createSelector([selectFeedbackState], (feedback) => feedback.error);

// Analyze data without API calls
const analyzeExistingData = (interviewData) => {
  const analysisResults = interviewData.responses.map(response => {
    const question = findQuestion(interviewData.jobRole, response.questionId) || {
      correctAnswer: "Varies based on approach",
      explanation: "Open-ended question"
    };
    
    const enhancedScore = calculateEnhancedSimilarity(
      response.response,
      question.correctAnswer
    );
    
    return {
      ...response,
      expectedAnswer: question.correctAnswer,
      explanation: question.explanation,
      similarityScore: enhancedScore,
      feedback: generateFeedback(enhancedScore, response.response, question.correctAnswer),
      isCorrect: enhancedScore > 0.65
    };
  });

  return {
    originalData: interviewData,
    analysis: analysisResults,
    summary: generateSummary(analysisResults, interviewData)
  };
};

function generateSummary(analysis, sessionData) {
  const validAnalysis = analysis || [];
  const correctCount = validAnalysis.filter(q => q.isCorrect).length;
  const totalQuestions = validAnalysis.length || 1;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  // Calculate scores by category
  const categoryStats = {};
  validAnalysis.forEach(item => {
    const category = item.category || 'General';
    if (!categoryStats[category]) {
      categoryStats[category] = { correct: 0, total: 0, totalScore: 0 };
    }
    categoryStats[category].total++;
    categoryStats[category].totalScore += item.similarityScore * 100;
    if (item.isCorrect) categoryStats[category].correct++;
  });

  // Convert to percentage
  for (const cat in categoryStats) {
    categoryStats[cat].percentage = Math.round(
      (categoryStats[cat].correct / categoryStats[cat].total) * 100
    );
    categoryStats[cat].averageScore = Math.round(
      categoryStats[cat].totalScore / categoryStats[cat].total
    );
  }

  return {
    accuracy,
    categoryStats,
    timeTaken: sessionData?.timeTaken || 'N/A',
    jobRole: sessionData?.jobRole || 'Unknown',
    score: sessionData?.score || { 
      text: getScoreText(accuracy), 
      class: getScoreClass(accuracy) 
    }
  };
}

export const analyzeFeedback = createAsyncThunk(
  'feedback/analyze',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Try to get data from multiple sources
      const state = getState();
      let interviewData;

      // 1. Check location state (passed from navigation)
      if (window.location.state?.interviewData) {
        interviewData = window.location.state.interviewData;
      }
      // 2. Check sessionStorage
      else if (sessionStorage.getItem('interviewResults')) {
        interviewData = JSON.parse(sessionStorage.getItem('interviewResults'));
      }
      // 3. Fallback to Redux store
      else if (state.interview?.responses?.length > 0) {
        interviewData = {
          responses: state.interview.responses,
          jobRole: state.interview.currentJobRole,
          timeTaken: formatTime(30 * 60 - state.interview.timer),
          cheatingWarnings: []
        };
      }
      else {
        throw new Error('No interview data found');
      }

      // Validate data
      if (!interviewData?.responses || !Array.isArray(interviewData.responses)) {
        throw new Error('Invalid interview data format');
      }

      // Process with local analysis
      return analyzeExistingData(interviewData);

    } catch (error) {
      console.error("Error in analyzeFeedback:", error);
      return rejectWithValue(error.message || 'Analysis failed');
    }
  }
);

// Slice definition
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    resetFeedback: () => initialState,
    clearFeedbackError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastAnalyzed = new Date().toISOString();
      })
      .addCase(analyzeFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = state.data || null;
      });
  }
});

export const { resetFeedback, clearFeedbackError } = feedbackSlice.actions;
export default feedbackSlice.reducer;