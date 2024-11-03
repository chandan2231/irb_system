import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";
const baseURL = "http://localhost:8800/api";

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
  },
);

export const createInformedConsent = createAsyncThunk(
  "ProtocolType/createInformedConsent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveInformedInfo`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
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
  },
);
export const createStudyInformation = createAsyncThunk(
  "ProtocolType/createStudyInformation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveStydyInfo`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createProtocolProcedures = createAsyncThunk(
  "ProtocolType/createProtocolProcedures",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveProtocolProceduresInfo`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createClinicalSiteSubmission = createAsyncThunk(
  "ProtocolType/createClinicalSiteSubmission",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveClinicalSiteSubmission`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getClinicalSiteSavedProtocolType = createAsyncThunk(
  "ProtocolType/getClinicalSiteSavedProtocolType",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/getClinicalSiteSavedProtocolType`,
        data,
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
