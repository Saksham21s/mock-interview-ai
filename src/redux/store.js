import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import testimonialsReducer from './testimonialsSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    testimonials: testimonialsReducer,
  },
});
