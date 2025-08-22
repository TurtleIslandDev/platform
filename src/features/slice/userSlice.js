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
      state.username = null;
      // state.ipAddress = null; # even if the user is logged out, the ip address is still needed for the whitelisting
    },

    setUserAuth: (state, action) => {
      state.role = action.payload.data.role;
      state.token = action.payload.data.access_token;
      state.username = action.payload.data.username;      
    },

    setUser: (state, action) => {
      state.role = action.payload.data?.role
        ? action.payload.data.role
        : action.payload.data;
    },
    setTobeEdited: (state, action) => {
      state.toBeEdited = action.payload.data;
    },

    setIpAddress: (state, action) => {
      state.ipAddress = action.payload;
    },
  },

  // extraReducers: (builder) => {

  // },
});

export const { logout, setUser, setUserAuth, setTobeEdited, setIpAddress } =
  userSlice.actions;
export default userSlice.reducer;
