import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const baseURL = "http://localhost:8800/api";

export const riskAssessmentSave = createAsyncThunk("ContinuinRevew/riskAssessmentSave",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/continuinReview/riskAssessmentSave`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const informedConsentSave = createAsyncThunk("ContinuinRevew/informedConsentSave",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/continuinReview/informedConsentSave`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const investigatorAndinstuationSave = createAsyncThunk("ContinuinRevew/investigatorAndinstuationSave",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/continuinReview/investigatorAndinstuationSave`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const researchProcessSave = createAsyncThunk("ContinuinRevew/researchProcessSave",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/continuinReview/researchProcessSave`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);









