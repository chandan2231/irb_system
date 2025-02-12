import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProtocolList,
  createProtocol,
  approvedProtocolListCheck,
  fetchApprovedProtocolList,
  checkMultisiteProtocolExist,
  getMultiSiteChildProtocols,
  createExternalMonitor,
  fetchExternalMonitorList,
  createCRC,
  fetchCRCList,
  getCTMProtocolsReport,
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
    createdExternalMonitor: null,
    externalMonitorList: null,
    createdCRC: null,
    crcList: null,
    CTMProtocolsReport: null,
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
      })
      .addCase(createExternalMonitor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExternalMonitor.fulfilled, (state, action) => {
        state.loading = false;
        state.createdExternalMonitor = action.payload;
      })
      .addCase(createExternalMonitor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchExternalMonitorList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExternalMonitorList.fulfilled, (state, action) => {
        state.loading = false;
        state.externalMonitorList = action.payload;
      })
      .addCase(fetchExternalMonitorList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCRCList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCRCList.fulfilled, (state, action) => {
        state.loading = false;
        state.crcList = action.payload;
      })
      .addCase(fetchCRCList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createCRC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCRC.fulfilled, (state, action) => {
        state.loading = false;
        state.createdCRC = action.payload;
      })
      .addCase(createCRC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getCTMProtocolsReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCTMProtocolsReport.fulfilled, (state, action) => {
        state.loading = false;
        state.CTMProtocolsReport = action.payload;
      })
      .addCase(getCTMProtocolsReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default DashboardSlice.reducer;
