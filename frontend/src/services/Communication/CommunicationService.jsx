import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const saveEnquiry = createAsyncThunk(
  "Communication/saveEnquiry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/communication/saveEnquiry`,
        data,
        // headers: { withCredentials: true },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCommunicationListByProtocolId = createAsyncThunk(
  "Communication/getCommunicationListByProtocolId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/communication/getCommunicationListByProtocolId`,
        data,
        // headers: { withCredentials: true },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const investigatorAndinstuationSave = createAsyncThunk(
  "Communication/investigatorAndinstuationSave",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/continuinReview/investigatorAndinstuationSave`,
        data,
        // headers: { withCredentials: true },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const researchProcessSave = createAsyncThunk(
  "Communication/researchProcessSave",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/continuinReview/researchProcessSave`,
        data,
        // headers: { withCredentials: true },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
