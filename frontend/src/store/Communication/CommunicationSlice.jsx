import { createSlice } from "@reduxjs/toolkit";
import {
  saveEnquiry,
  getCommunicationListByProtocolId,
  downloadCommunicationPdf,
} from "../../services/Communication/CommunicationService";

const ContinuinReviewSlice = createSlice({
  name: "communication",
  initialState: {
    loading: false,
    error: null,
    enquirySaved: null,
    communicationList: null,
    communicationPdfDownloaded: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquirySaved = action.payload;
      })
      .addCase(saveEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getCommunicationListByProtocolId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommunicationListByProtocolId.fulfilled, (state, action) => {
        state.loading = false;
        state.communicationList = action.payload;
      })
      .addCase(getCommunicationListByProtocolId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(downloadCommunicationPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadCommunicationPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.communicationPdfDownloaded = action.payload;
      })
      .addCase(downloadCommunicationPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default ContinuinReviewSlice.reducer;
