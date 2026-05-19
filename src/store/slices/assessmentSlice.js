import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  answers: {},
  result: null,
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    setResult: (state, action) => {
      state.result = action.payload;
    },
    resetAssessment: (state) => {
      state.answers = {};
      state.result = null;
    },
  },
});

export const { setAnswer, setResult, resetAssessment } = assessmentSlice.actions;
export default assessmentSlice.reducer;