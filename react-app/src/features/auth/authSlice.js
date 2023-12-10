import { createSlice } from '@reduxjs/toolkit';

// Creating the authSlice
const authSlice = createSlice({
  name: 'auth', // The name of the slice
  initialState: { token: null }, // Initial state with a token property
  reducers: {
    // Reducer functions
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    logOut: (state, action) => {
      // Reducer for logging out
      state.token = null;
    },
  },
});
// Exporting action creators
export const { setCredentials, logOut } = authSlice.actions;
// Exporting the reducer
export default authSlice.reducer;
// Selector function to retrieve the current token from the state
export const selectCurrentToken = (state) => state.auth.token;
