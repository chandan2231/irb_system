import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const cp = "GHANA_BTC";
const baseURL = "https://ghauthapi.milvik.io";

export const fetchApplicationList = createAsyncThunk("Application/fetchApplicationList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/application/search`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createApplication = createAsyncThunk("Application/createApplication",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/application/create`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeStatus = createAsyncThunk("Application/changeStatus",
  async (payloadData, { rejectWithValue }) => {
    let sendStatus = ''
    if(payloadData.status === true){
      sendStatus = 'disable'
    } else {
      sendStatus = 'enable'
    }
    let data = {id: payloadData.id}
    try {
      const response = await ApiCall({
        method: "PUT",
        url: `${baseURL}/application/${sendStatus}`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchActiveApplicationList = createAsyncThunk("Application/fetchActiveApplicationList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
        url: `${baseURL}/application/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);