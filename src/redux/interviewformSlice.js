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

      // Update Redux state with the new form data
      state.name = name ?? '';
      state.jobRole = jobRole ?? '';
      state.experience = experience ?? '';
      state.skills = skills ?? [];
      state.resume = resume ?? null;

      // Save updated Redux state to session storage and sync jobRole explicitly
      const updatedState = {
        name: state.name,
        jobRole: state.jobRole,
        experience: state.experience,
        skills: state.skills,
        resume: state.resume,
      };
      sessionStorage.setItem('interviewFormData', JSON.stringify(updatedState));
      sessionStorage.setItem('currentJobRole', state.jobRole); // Explicit sync of jobRole

      console.log("Redux updated jobRole:", state.jobRole);  // Debugging log
      console.log("Session Storage after update:", sessionStorage.getItem('currentJobRole'));
    },
  },
});

export const { updateFormData } = interviewFormSlice.actions;
export default interviewFormSlice.reducer;
