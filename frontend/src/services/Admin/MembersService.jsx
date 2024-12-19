import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiCall from "../../utility/ApiCall";
const baseURL = import.meta.env.VITE_API_BSAE_URL;

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
  }
);

export const createMember = createAsyncThunk(
  "Members/createMember",
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
  }
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
  }
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
  }
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

export const createProtocolEvent = createAsyncThunk(
  "Members/createProtocolEvent",
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

export const fetchMemberEventList = createAsyncThunk(
  "Members/fetchMemberEventList",
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

export const assignProtocolToMember = createAsyncThunk(
  "Members/assignProtocolToMember",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/member/assignProtocolToMembers`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAssignMemberList = createAsyncThunk(
  "Members/fetchAssignMemberList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/member/assignedMembers`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAssignMemberProtocolList = createAsyncThunk(
  "Members/fetchAssignMemberProtocolList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/member/assignedMembersProtocolList`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const votingMemberApprovalProtocol = createAsyncThunk(
  "Members/votingMemberApprovalProtocol",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/member/votingMemberApprovalProtocol`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchApprovedProtocolsByMembersList = createAsyncThunk(
  "Members/fetchApprovedProtocolsByMembersList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/member/approvedProtocolsByMembersList`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const chairCommitteeApprovalProtocol = createAsyncThunk(
  "Members/chairCommitteeApprovalProtocol",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: "POST",
        url: `${baseURL}/admin/member/chairCommitteeApprovalProtocol`,
        data,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
