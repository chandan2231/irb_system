import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const validateUserToken = createAsyncThunk(
  "Auth/validateUserToken",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
        url: `${baseURL}/auth`,
        headers: {
          "Content-Type": "application/json",
          token: data.token,
        },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
        url: `${baseURL}/auth/password/reset`,
        data,
        headers: {
          "X-Client-ID": "666add7011ae622856e30732",
        },
      });
      console.log("response", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "Auth/changePassword",
  async (dataObject, { rejectWithValue }) => {
    const { passwordObject, token, app_id } = dataObject;
    const data = passwordObject;
    try {
      const response = await ApiCall({
        method: "PUT",
        url: `${baseURL}/auth/password/reset/${token}`,
        data,
        headers: {
          "X-Client-ID": app_id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
