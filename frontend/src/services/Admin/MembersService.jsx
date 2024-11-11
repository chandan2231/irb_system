import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";

const cp = "GHANA_BTC";
const baseURL = "http://localhost:8800/api";

export const fetchMemberList = createAsyncThunk(
  "Members/fetchMemberList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
        url: `${baseURL}/admin/member/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

<<<<<<< HEAD
export const createMember = createAsyncThunk("Members/createMember",
=======
export const createMember = createAsyncThunk(
  "Members/createMember",
>>>>>>> c8e7a5e2cf50f4a1bc17d19bf3d715e4eb3ac400
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/member/create`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const changeStatus = createAsyncThunk(
  "Members/changeStatus",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/member/status/change`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const resetMemberPassword = createAsyncThunk(
  "Members/resetMemberPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/member/reset/password`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchActiveVotingMemberList = createAsyncThunk(
  "Members/fetchActiveVotingMemberList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
        url: `${baseURL}/admin/active/votingmember/list`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProtocolEvent = createAsyncThunk("Members/createProtocolEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/member/createEvent`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMemberEventList = createAsyncThunk("Members/fetchMemberEventList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "GET",
        url: `${baseURL}/admin/member/eventList`,
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
