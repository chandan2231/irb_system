import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const cp = "GHANA_BTC";
const baseURL = "https://ghauthapi.milvik.io";

export const fetchPrivilegeList = createAsyncThunk("Privilege/fetchPrivilegeList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/privilege/search`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPrivilege = createAsyncThunk("Privilege/createRole",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/privilege/create`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeStatus = createAsyncThunk("Privilege/changeStatus",
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
        url: `${baseURL}/privilege/${sendStatus}`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchActivePrivilegeList = createAsyncThunk("Privilege/fetchActivePrivilegeList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
        url: `${baseURL}/privilege/list/${data}`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);