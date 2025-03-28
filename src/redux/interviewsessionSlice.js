import { createSlice } from "@reduxjs/toolkit";

const questionsByRole = {
  frontend: [
    { id: 1, question: "Explain the virtual DOM in React.", type: "Technical" },
    { id: 2, question: "What is the difference between props and state in React?", type: "Technical" },
    { id: 3, question: "Write a function to debounce user input in a search bar.", type: "Coding" },
    { id: 4, question: "Implement a To-Do list using React and localStorage.", type: "Coding" },
    { id: 5, question: "Tell me about a time you handled a difficult project.", type: "Behavioral" },
    { id: 6, question: "How do you handle feedback from teammates?", type: "Behavioral" },
  ],
  backend: [
    { id: 1, question: "What are RESTful APIs?", type: "Technical" },
    { id: 2, question: "Explain middleware in Express.js.", type: "Technical" },
    { id: 3, question: "Write a function to hash passwords using bcrypt.", type: "Coding" },
    { id: 4, question: "Implement user authentication in Node.js.", type: "Coding" },
    { id: 5, question: "How do you manage conflicts in a team project?", type: "Behavioral" },
    { id: 6, question: "Describe a challenging project and how you tackled it.", type: "Behavioral" },
  ],
};

const interviewSlice = createSlice({
  name: "interviewSession",
  initialState: {
    jobRole: "", // Job role from the previous form
    questions: [], // Questions for the selected role
    currentRound: "Technical", // Fixed round order: Technical -> Coding -> Behavioral
    currentQuestionIndex: 0,
    userResponses: [], // Stores each question and user response
  },
  reducers: {
    setJobRole: (state, action) => {
      state.jobRole = action.payload;
      state.questions = questionsByRole[action.payload]; // Load questions based on the role
    },
    saveResponse: (state, action) => {
      const { questionId, answer } = action.payload;

      // Save question and response
      state.userResponses.push({
        questionId,
        question: state.questions.find((q) => q.id === questionId)?.question,
        answer,
      });

      // Move to next question or handle round change
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
      } else {
        // Move to next round
        state.currentRound =
          state.currentRound === "Technical"
            ? "Coding"
            : state.currentRound === "Coding"
            ? "Behavioral"
            : "Completed";

        state.currentQuestionIndex = 0; // Reset for next round
      }
    },
    nextQuestion: (state) => {
      // Move to next question manually when needed
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
      } else {
        // Move to next round
        state.currentRound =
          state.currentRound === "Technical"
            ? "Coding"
            : state.currentRound === "Coding"
            ? "Behavioral"
            : "Completed";

        state.currentQuestionIndex = 0; // Reset for next round
      }
    },
    resetInterview: (state) => {
      state.currentRound = "Technical";
      state.currentQuestionIndex = 0;
      state.userResponses = [];
    },
  },
});

export const { setJobRole, saveResponse, resetInterview, nextQuestion } = interviewSlice.actions;
export default interviewSlice.reducer;
