import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProtocolList,
  createProtocol,
  approvedProtocolListCheck,
  fetchApprovedProtocolList,
  checkMultisiteProtocolExist,
  getMultiSiteChildProtocols,
} from "../../services/Dashboard/DashboardService";
const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    error: null,
    protocolList: null,
    createdProtocol: null,
    approvedProtocolListCount: null,
    approvedProtocolList: null,
    multisiteProtocolExist: null,
    multiSiteChildProtocolsList: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProtocolList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProtocolList.fulfilled, (state, action) => {
        state.loading = false;
        state.protocolList = action.payload;
      })
      .addCase(fetchProtocolList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createProtocol.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProtocol.fulfilled, (state, action) => {
        state.loading = false;
        state.createdProtocol = action.payload;
      })
      .addCase(createProtocol.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(approvedProtocolListCheck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approvedProtocolListCheck.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedProtocolListCount = action.payload;
      })
      .addCase(approvedProtocolListCheck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchApprovedProtocolList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedProtocolList.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedProtocolList = action.payload;
      })
      .addCase(fetchApprovedProtocolList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(checkMultisiteProtocolExist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkMultisiteProtocolExist.fulfilled, (state, action) => {
        state.loading = false;
        state.multisiteProtocolExist = action.payload;
      })
      .addCase(checkMultisiteProtocolExist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getMultiSiteChildProtocols.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultiSiteChildProtocols.fulfilled, (state, action) => {
        state.loading = false;
        state.multiSiteChildProtocolsList = action.payload;
      })
      .addCase(getMultiSiteChildProtocols.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default DashboardSlice.reducer;
