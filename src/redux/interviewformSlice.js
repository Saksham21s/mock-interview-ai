import { createSlice } from '@reduxjs/toolkit';

// Retrieve saved data from session storage (if any)
const savedData = JSON.parse(sessionStorage.getItem('interviewFormData')) || {};

const initialState = {
  name: savedData.name || '',
  jobRole: savedData.jobRole || '',
  experience: savedData.experience || '',
  skills: savedData.skills || [],
  resume: savedData.resume || null,
};

const interviewFormSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      const { name, jobRole, experience, skills, resume } = action.payload || {};
      state.name = name ?? '';
      state.jobRole = jobRole ?? '';
      state.experience = experience ?? '';
      state.skills = skills ?? [];
      state.resume = resume ?? null;

      // Save updated data to session storage whenever the form updates
      sessionStorage.setItem('interviewFormData', JSON.stringify(state));
    },
  },
});

export const { updateFormData } = interviewFormSlice.actions;
export default interviewFormSlice.reducer;
