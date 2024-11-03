import { createSlice } from "@reduxjs/toolkit";
import {
  sendUsername,
  changePassword,
  validateUser,
  userSignin,
  userSignUp,
  userLogout,
} from "../../services/Auth/AuthService";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    usernameSent: null,
    passwordChanged: null,
    signinUser: null,
    signupUser: null,
    logoutUser: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.signupUser = action.payload;
      })
      .addCase(userSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(userSignin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userSignin.fulfilled, (state, action) => {
        state.loading = false;
        state.signinUser = action.payload;
      })
      .addCase(userSignin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.loading = false;
        state.logoutUser = action.payload;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(sendUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.usernameSent = action.payload;
      })
      .addCase(sendUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(validateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userValidated = action.payload;
      })
      .addCase(validateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordChanged = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default AuthSlice.reducer;
