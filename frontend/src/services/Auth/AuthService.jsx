import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const userSignin = createAsyncThunk(
  "Auth/userSignin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/auth/login`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const userSignUp = createAsyncThunk(
  "Auth/userSignUp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/auth/register`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const userLogout = createAsyncThunk(
  "Auth/userLogout",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/auth/logout`,
      });
      console.log("response", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendUsername = createAsyncThunk(
  "Auth/sendUsername",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/auth/verify/username/`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.msg);
    }
  }
);

export const validateUser = createAsyncThunk(
  "Auth/validateUser",
  async (data, { rejectWithValue }) => {
    const { token, app_id } = data;
    console.log("data data", data);
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/auth/password/reset/${token}`,
        headers: {
          "X-Client-ID": app_id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.msg);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "Auth/resetPassword",
  async (dataObject, { rejectWithValue }) => {
    const data = dataObject;
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/auth/password/reset/`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.msg);
    }
  }
);

export const getEmailVerification = createAsyncThunk(
  "Auth/getEmailVerification",
  async (dataObject, { rejectWithValue }) => {
    const data = dataObject;
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/auth/email/verify/`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.msg);
    }
  }
);
