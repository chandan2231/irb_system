import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserList = createAsyncThunk(
  "User/fetchUserList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/user/search`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "User/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/user/create`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeStatus = createAsyncThunk(
  "User/changeStatus",
  async (payloadData, { rejectWithValue }) => {
    let sendStatus = "";
    if (payloadData.status === true) {
      sendStatus = "disable";
    } else {
      sendStatus = "enable";
    }
    let data = { id: payloadData.id };
    try {
      const response = await ApiCall({
        method: "PUT",
        url: `${baseURL}/user/${sendStatus}`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchActiveUsersList = createAsyncThunk(
  "User/fetchActiveUsersList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
        url: `${baseURL}/user/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadFile = async (file, fileData = {}) => {
  let data = new FormData();
  data.append("file", file);
  if (fileData) {
    for (let key in fileData) {
      data.append(key, fileData[key]);
    }
  }
  try {
    let response = await ApiCall({
      method: "POST",
      url: `${baseURL}/protocol/upload/file`,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data?.id;
  } catch (error) {}
};

export const continueinReviewReport = async (protocolDetails) => {
  try {
    let response = await ApiCall({
      method: "POST",
      url: `${baseURL}/protocol/continuein/generate/pdf`,
      data: protocolDetails,
    });
    return response.data;
  } catch (error) {}
};

export const protocolReport = async (protocolDetails) => {
  try {
    let response = await ApiCall({
      method: "POST",
      url: `${baseURL}/protocol/protocol/generate/pdf`,
      data: protocolDetails,
    });
    return response.data;
  } catch (error) {}
};
