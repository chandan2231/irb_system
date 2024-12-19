import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";
const baseURL = import.meta.env.VITE_API_BSAE_URL;

export const getStudyCloseoutRequest = createAsyncThunk(
  "EventAndRequest/getStudyCloseoutRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/eventAndRequest/getStudyCloseoutRequest`,
        data,
        headers: { withCredentials: true },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPromptlyReportableEvent = createAsyncThunk(
  "EventAndRequest/getPromptlyReportableEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/eventAndRequest/getPromptlyReportableEvent`,
        data,
        headers: { withCredentials: true },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAdverseEvent = createAsyncThunk(
  "EventAndRequest/getAdverseEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/eventAndRequest/getAdverseEvent`,
        data,
        headers: { withCredentials: true },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProtocolAmendmentRequest = createAsyncThunk(
  "EventAndRequest/getProtocolAmendmentRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/eventAndRequest/getProtocolAmendmentRequest`,
        data,
        headers: { withCredentials: true },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchStudyCloseoutRequestDetailsById = createAsyncThunk(
  "EventAndRequest/fetchStudyCloseoutRequestDetailsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/studyCloseoutDetailsById`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPromptlyReportableEventById = createAsyncThunk(
  "EventAndRequest/fetchPromptlyReportableEventById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/promptlyReportableEventById`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAdverseEventById = createAsyncThunk(
  "EventAndRequest/fetchAdverseEventById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/adverseEventById`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProtocolAmendmentRequestById = createAsyncThunk(
  "EventAndRequest/fetchProtocolAmendmentRequestById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/protocolAmendmentRequestById`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
