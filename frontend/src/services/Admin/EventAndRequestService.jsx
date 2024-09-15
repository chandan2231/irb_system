import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const baseURL = "http://localhost:8800/api";

export const getStudyCloseoutRequest = createAsyncThunk("EventAndRequest/getStudyCloseoutRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/admin/eventAndRequest/getStudyCloseoutRequest`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPromptlyReportableEvent = createAsyncThunk("EventAndRequest/getPromptlyReportableEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/admin/eventAndRequest/getPromptlyReportableEvent`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAdverseEvent = createAsyncThunk("EventAndRequest/getAdverseEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/admin/eventAndRequest/getAdverseEvent`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProtocolAmendmentRequest = createAsyncThunk("EventAndRequest/getProtocolAmendmentRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
          method: "POST",
          url: `${baseURL}/admin/eventAndRequest/getProtocolAmendmentRequest`,
          data,
          headers: {withCredentials: true},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);