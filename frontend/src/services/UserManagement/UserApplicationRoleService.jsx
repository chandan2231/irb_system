import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const cp = "GHANA_BTC";
const baseURL = "https://ghauthapi.milvik.io";

export const fetchUserApplicationRoleList = createAsyncThunk("UserApplicationRole/fetchUserApplicationRoleList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/access/search`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUserApplicationRole = createAsyncThunk("UserApplicationRole/createUserApplicationRole",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/access/create`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeStatus = createAsyncThunk("UserApplicationRole/changeStatus",
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
        url: `${baseURL}/access/${sendStatus}`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);