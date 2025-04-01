import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  file: null,
  fileName: '', // Added fileName state
  jobRole: '',
  experienceLevel: '',
  isLoading: false,
  analysisResults: null,
  error: null
};

const validatorSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setFile: (state, action) => {
      state.file = action.payload;
      state.fileName = action.payload ? action.payload.name : ''; // Store file name
      state.error = null;
    },
    setFileName: (state, action) => {
      state.fileName = action.payload;
    },
    setJobRole: (state, action) => {
      state.jobRole = action.payload;
    },
    setExperienceLevel: (state, action) => {
      state.experienceLevel = action.payload;
    },
    startAnalysis: (state) => {
      state.isLoading = true;
      state.analysisResults = null;
      state.error = null;
    },
    analysisSuccess: (state, action) => {
      state.isLoading = false;
      state.analysisResults = action.payload;
    },
    analysisFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetAnalysis: (state) => {
      state.analysisResults = null;
      state.error = null;
    }
  }
});

// Export updated actions
export const {
  setFile,
  setFileName,
  setJobRole,
  setExperienceLevel,
  startAnalysis,
  analysisSuccess,
  analysisFailure,
  resetAnalysis
} = validatorSlice.actions;

export default validatorSlice.reducer;
