import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllProtocolList = createAsyncThunk(
  "ProtocolList/fetchAllProtocolList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
        url: `${baseURL}/admin/all-protocol/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchApprovedProtocolList = createAsyncThunk(
  "ProtocolList/fetchApprovedProtocolList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/approved-protocol/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUnderReviewProtocolList = createAsyncThunk(
  "ProtocolList/fetchUnderReviewProtocolList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/under-review/protocol/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRejectedProtocolList = createAsyncThunk(
  "ProtocolList/fetchRejectedProtocolList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/rejected/protocol/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCreatedProtocolList = createAsyncThunk(
  "ProtocolList/fetchCreatedProtocolList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/created/protocol/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProtocolDetailsById = createAsyncThunk(
  "ProtocolList/fetchProtocolDetailsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/protocolDetailsById`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const allowProtocolEdit = createAsyncThunk(
  "ProtocolList/allowProtocolEdit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/protocol/allowEdit`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const allowProtocolWaiveFee = createAsyncThunk(
  "ProtocolList/allowProtocolWaiveFee",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/protocol/waiveFee`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUnderReviewProtocolAllList = createAsyncThunk(
  "ProtocolList/fetchUnderReviewProtocolAllList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
        url: `${baseURL}/admin/under-review/protocol/all/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
