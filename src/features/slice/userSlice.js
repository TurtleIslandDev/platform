import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  role: null,
  toBeEdited: null,
};

const userSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
    },

    setUserAuth: (state, action) => {
      state.role = action.payload.data.role;
      state.token = action.payload.data.access_token;
    },

    setUser: (state, action) => {
      state.role = action.payload.data?.role
        ? action.payload.data.role
        : action.payload.data;
    },
    setTobeEdited: (state, action) => {
      state.toBeEdited = action.payload.data;
    },
  },

  // extraReducers: (builder) => {

  // },
});

export const { logout, setUser, setUserAuth, setTobeEdited } =
  userSlice.actions;
export default userSlice.reducer;
