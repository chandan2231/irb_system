import { createSlice } from "@reduxjs/toolkit";
import {
  createStudyCloseoutRequest,
  createPromptlyReportableEvent,
  createAdverseEvent,
  createProtocolAmendmentRequest,
} from "../../services/EventAndRequest/EventAndRequestService";

const EventAndRequestSlice = createSlice({
  name: "EventAndRequest",
  initialState: {
    loading: false,
    error: null,
    createdProtocolAmendmentRequest: null,
    createdAdverseEvent: null,
    createdPromptlyReportableEvent: null,
    createdStudyCloseoutRequest: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProtocolAmendmentRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProtocolAmendmentRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.createdProtocolAmendmentRequest = action.payload;
      })
      .addCase(createProtocolAmendmentRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createAdverseEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdverseEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.createdAdverseEvent = action.payload;
      })
      .addCase(createAdverseEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createPromptlyReportableEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPromptlyReportableEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.createdPromptlyReportableEvent = action.payload;
      })
      .addCase(createPromptlyReportableEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createStudyCloseoutRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudyCloseoutRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.createdStudyCloseoutRequest = action.payload;
      })
      .addCase(createStudyCloseoutRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default EventAndRequestSlice.reducer;
