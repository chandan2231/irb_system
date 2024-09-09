import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const baseURL = "http://localhost:8800/api";

export const createStudyCloseoutRequest = createAsyncThunk("EventAndRequest/createStudyCloseoutRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/eventAndRequest/createStudyCloseoutRequest`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPromptlyReportableEvent = createAsyncThunk("EventAndRequest/createPromptlyReportableEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/eventAndRequest/createPromptlyReportableEvent`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAdverseEvent = createAsyncThunk("EventAndRequest/createAdverseEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/eventAndRequest/createAdverseEvent`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProtocolAmendmentRequest = createAsyncThunk("EventAndRequest/createProtocolAmendmentRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/eventAndRequest/createProtocolAmendmentRequest`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);