import { createSlice } from "@reduxjs/toolkit";
import {
  createProtocolInformation,
  createInvestigatorInformation,
  createDocumentReview,
  createDocumentSubmission,
} from "../../services/ProtocolType/DocumentReviewService";
const DocumentReviewSlice = createSlice({
  name: "Document Review",
  initialState: {
    loading: false,
    error: null,
    createdProtocolInformation: null,
    createdInvestigatorInformation: null,
    createdDocumentReview: null,
    createdDocumentReviewSubmission: null,
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
      .addCase(createInvestigatorInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvestigatorInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.createdInvestigatorInformation = action.payload;
      })
      .addCase(createInvestigatorInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createDocumentReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDocumentReview.fulfilled, (state, action) => {
        state.loading = false;
        state.createdDocumentReview = action.payload;
      })
      .addCase(createDocumentReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createDocumentSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDocumentSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.createdDocumentReviewSubmission = action.payload;
      })
      .addCase(createDocumentSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default DocumentReviewSlice.reducer;
