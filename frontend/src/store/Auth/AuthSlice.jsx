import { createSlice } from "@reduxjs/toolkit";
import {
  sendUsername,
  resetPassword,
  validateUser,
  userSignin,
  userSignUp,
  userLogout,
  getEmailVerification,
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
    userTokenValidated: null,
    emailVerified: null,
    userDetail: null,
    mappedPermissions: null,
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
        // add details to state  persistor.purge();
        state.userDetail = action.payload?.data?.user;
        state.mappedPermissions = action.payload?.data?.routes;
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

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordChanged = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.emailVerified = action.payload;
      })
      .addCase(getEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default AuthSlice.reducer;
