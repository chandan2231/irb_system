import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getPaymentAmountInfo = createAsyncThunk(
  "Payment/getPaymentAmountInfo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/payment/getPaymentAmountInfo`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPayment = createAsyncThunk(
  "Payment/createPayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/payment/createPayment`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const capturePayment = createAsyncThunk(
  "Payment/capturePayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/payment/capturePayment`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const successPayment = createAsyncThunk(
  "Payment/successPayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/payment/successPayment`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const canclePayment = createAsyncThunk(
  "Payment/canclePayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/payment/canclePayment`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createClinicalSiteSubmission = createAsyncThunk(
  "Payment/createClinicalSiteSubmission",
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
  }
);

export const getClinicalSiteSavedProtocolType = createAsyncThunk(
  "Payment/getClinicalSiteSavedProtocolType",
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
  }
);
export const getPaymentAmount = createAsyncThunk(
  "Payment/getPaymentAmount",
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
  }
);
