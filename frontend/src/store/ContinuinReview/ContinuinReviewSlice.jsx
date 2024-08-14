import { createSlice } from "@reduxjs/toolkit";
import { riskAssessmentSave, informedConsentSave, investigatorAndinstuationSave, researchProcessSave } from "../../services/ContinuinReview/ContinuinReviewService";

const ContinuinReviewSlice = createSlice({
  name: "continuin review",
  initialState: {
    loading: false,
    error: null,
    createdRiskAssessment: null,
    createdInformedConsent: null,
    createdInvestigatorAndinstuation: null,
    createdResearchProcess: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(riskAssessmentSave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(riskAssessmentSave.fulfilled, (state, action) => {
        state.loading = false;
        state.createdRiskAssessment = action.payload;
      })
      .addCase(riskAssessmentSave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(informedConsentSave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(informedConsentSave.fulfilled, (state, action) => {
        state.loading = false;
        state.createdInformedConsent = action.payload;
      })
      .addCase(informedConsentSave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(investigatorAndinstuationSave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(investigatorAndinstuationSave.fulfilled, (state, action) => {
        state.loading = false;
        state.createdInvestigatorAndinstuation = action.payload;
      })
      .addCase(investigatorAndinstuationSave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(researchProcessSave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(researchProcessSave.fulfilled, (state, action) => {
        state.loading = false;
        state.createdResearchProcess = action.payload;
      })
      .addCase(researchProcessSave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default ContinuinReviewSlice.reducer;
