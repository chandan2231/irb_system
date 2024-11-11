import { createSlice } from "@reduxjs/toolkit";
import {
  createInformedConsent,
  createProtocolInformation,
  createContactInformation,
  createStudyInformation,
  createProtocolProcedures,
  createMultiSiteSubmission,
  getMultiSiteSavedProtocolType,
} from "../../services/ProtocolType/MultiSiteSponsorService";
const MultiSiteSponsorSlice = createSlice({
  name: "Multi-Site Sponsor",
  initialState: {
    loading: false,
    error: null,
    createdProtocolInformation: null,
    createdContactInformation: null,
    createdInformedConsent: null,
    createdStudyInformation: null,
    createdProtocolProcedures: null,
    createdMultiSiteSubmission: null,
    getAllMultiSiteSavedProtocolType: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProtocolInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProtocolInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.createdProtocolInformation = action.payload;
      })
      .addCase(createProtocolInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createContactInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContactInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.createdContactInformation = action.payload;
      })
      .addCase(createContactInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createInformedConsent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInformedConsent.fulfilled, (state, action) => {
        state.loading = false;
        state.createdInformedConsent = action.payload;
      })
      .addCase(createInformedConsent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createStudyInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudyInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.createdStudyInformation = action.payload;
      })
      .addCase(createStudyInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createProtocolProcedures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProtocolProcedures.fulfilled, (state, action) => {
        state.loading = false;
        state.createdProtocolProcedures = action.payload;
      })
      .addCase(createProtocolProcedures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createMultiSiteSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMultiSiteSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.createdMultiSiteSubmission = action.payload;
      })
      .addCase(createMultiSiteSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getMultiSiteSavedProtocolType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultiSiteSavedProtocolType.fulfilled, (state, action) => {
        state.loading = false;
        state.getAllMultiSiteSavedProtocolType = action.payload;
      })
      .addCase(getMultiSiteSavedProtocolType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default MultiSiteSponsorSlice.reducer;
