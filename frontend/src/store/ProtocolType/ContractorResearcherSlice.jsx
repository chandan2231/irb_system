import { createSlice } from "@reduxjs/toolkit";
import { createInformedConsent, createProtocolInformation, createInvestigatorInformation, createStudyInformation, createProtocolProcedures } from "../../services/ProtocolType/ContractorResearcherService";
const ContractorResearcherSlice = createSlice({
  name: "Contractor Researcher",
  initialState: {
    loading: false,
    error: null,
    createdProtocolInformation: null,
    createdInformedConsent: null,
    createdInvestigatorInformation: null,
    createdStudyInformation: null,
    createdProtocolProcedures: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      
      
      
      ;
  },
});

export default ContractorResearcherSlice.reducer;
