import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import testimonialsReducer from './testimonialsSlice';
import interviewFormReducer from './interviewformSlice';
import interviewReducer from './interviewSlice';
import interviewFeedbackReducer from './ReportsSlice';
import resumeReducer from './ValidatorSlice';

// Configure and export the Redux store
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    testimonials: testimonialsReducer,
    interviewForm: interviewFormReducer,
    interview: interviewReducer,
    Feedback: interviewFeedbackReducer,
    resume: resumeReducer
  },
});
