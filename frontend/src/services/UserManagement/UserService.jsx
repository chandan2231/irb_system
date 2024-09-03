import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const cp = "GHANA_BTC";
const baseURL = "https://ghauthapi.milvik.io";

export const fetchUserList = createAsyncThunk("User/fetchUserList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/user/search`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUser = createAsyncThunk("User/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/user/create`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeStatus = createAsyncThunk("User/changeStatus",
  async (payloadData, { rejectWithValue }) => {
    let sendStatus = ''
    if (payloadData.status === true) {
      sendStatus = 'disable'
    } else {
      sendStatus = 'enable'
    }
    let data = { id: payloadData.id }
    try {
      const response = await ApiCall({
        method: "PUT",
        url: `${baseURL}/user/${sendStatus}`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchActiveUsersList = createAsyncThunk("User/fetchActiveUsersList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
        url: `${baseURL}/user/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const uploadFile = async (file, fileData={}) => {
  let data = new FormData();
  data.append("file", file);
  if (fileData) {
    for (let key in fileData) {
      data.append(key, fileData[key])
    }
  }
  try {
    let response = await ApiCall({
      method: "POST",
      url: `http://localhost:8800/api/protocol/upload/file`,
      data,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data?.id;
  } catch (error) {

  }
}


export const viewReport = async (protocolDetails) => {

  try {
    let response = await ApiCall({
      method: "POST",
      url: `http://localhost:8800/api/protocol/generate/pdf`,
      data : protocolDetails,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data?.id;
  } catch (error) {

  }
}