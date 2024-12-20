import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const createInvestigatorAndProtocolInformation = createAsyncThunk(
  "ProtocolType/createInvestigatorAndProtocolInformation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveInvestigatorAndProtocolInformation`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createInformedConsent = createAsyncThunk(
  "ProtocolType/createInformedConsent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveClinicalInformedConsent`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPrincipalInvestigatorSubmission = createAsyncThunk(
  "ProtocolType/createPrincipalInvestigatorSubmission",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/savePrincipalInvestigatorSubmission`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPrincipalInvestigatorSavedProtocolType = createAsyncThunk(
  "ProtocolType/getPrincipalInvestigatorSavedProtocolType",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/getPrincipalInvestigatorSavedProtocolType`,
        data,
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
