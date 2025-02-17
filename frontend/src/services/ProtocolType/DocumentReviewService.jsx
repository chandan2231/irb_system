import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const createProtocolInformation = createAsyncThunk(
  "ProtocolType/createProtocolInformation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveProtocolInfo`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createInvestigatorInformation = createAsyncThunk(
  "ProtocolType/createInvestigatorInformation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveInvestigatorInfo`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDocumentReview = createAsyncThunk(
  "ProtocolType/createDocumentReview",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveDocumentReview`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDocumentSubmission = createAsyncThunk(
  "ProtocolType/createDocumentSubmission",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveDocumentSubmission`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
