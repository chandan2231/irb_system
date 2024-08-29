import { createSlice } from "@reduxjs/toolkit";
import {createInvestigatorAndProtocolInformation, createInformedConsent  } from "../../services/ProtocolType/ClinicalResearcherService";
const ClinicalResearcherSlice = createSlice({
  name: "Clinical Researcher",
  initialState: {
    loading: false,
    error: null,
    createdInformedConsent: null,
    createdInvestigatorAndProtocolInformation: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInvestigatorAndProtocolInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvestigatorAndProtocolInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.createdInvestigatorAndProtocolInformation = action.payload;
      })
      .addCase(createInvestigatorAndProtocolInformation.rejected, (state, action) => {
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
      });
  },
});

export default ClinicalResearcherSlice.reducer;
