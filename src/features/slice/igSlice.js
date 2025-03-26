import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leadInfo: null,
  step: 1,
  totalSteps: null,
};

const igSlice = createSlice({
  name: "interaction guide",
  initialState,
  reducers: {
    setLeadInfo: (state, action) => {
      state.leadInfo = action.payload.leadInfo;
    },

    setStep: (state, action) => {
      state.step = action.payload.step;
    },
    setTotalSteps: (state, action) => {
      state.totalSteps = action.payload.totalSteps;
    },
  },
});

export const { setStep, setLeadInfo, setTotalSteps } = igSlice.actions;
export default igSlice.reducer;
