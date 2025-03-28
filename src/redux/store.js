import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import testimonialsReducer from './testimonialsSlice';
import interviewFormReducer from './interviewformSlice';
import interviewSessionReducer from './interviewsessionSlice'; 
import interviewReducer from './interviewSlice';

// Configure and export the Redux store
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    testimonials: testimonialsReducer,
    interviewForm: interviewFormReducer,
    interviewSession: interviewSessionReducer,
    interview: interviewReducer,
  },
});
