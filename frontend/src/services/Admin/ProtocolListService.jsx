import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";
const baseURL = import.meta.env.VITE_API_BSAE_URL;

export const fetchApprovedProtocolList = createAsyncThunk(
  "ProtocolList/fetchApprovedProtocolList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
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
        method: "GET",
        url: `${baseURL}/admin/under-review/protocol/list`,
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
        method: "GET",
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
