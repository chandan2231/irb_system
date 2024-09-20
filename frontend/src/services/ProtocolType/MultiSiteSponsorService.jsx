import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";
const baseURL = "http://localhost:8800/api";


export const createProtocolInformation = createAsyncThunk("ProtocolType/createProtocolInformation",
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

export const createContactInformation = createAsyncThunk("ProtocolType/createContactInformation",
    async (data, { rejectWithValue }) => {
      try {
        const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/researchInfo/saveContactInfo`,
          data,
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
);

export const createStudyInformation = createAsyncThunk("ProtocolType/createStudyInformation",
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
    }
);

export const createInformedConsent = createAsyncThunk("ProtocolType/createInformedConsent",
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
  }
);

export const createProtocolProcedures = createAsyncThunk("ProtocolType/createProtocolProcedures",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveMultiSiteProtocolProceduresInfo`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createMultiSiteSubmission = createAsyncThunk("ProtocolType/createMultiSiteSubmission",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/saveMultiSiteSubmission`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getMultiSiteSavedProtocolType = createAsyncThunk("ProtocolType/getMultiSiteSavedProtocolType",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/researchInfo/getMultiSiteSavedProtocolType`,
        data,
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
