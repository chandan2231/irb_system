import { createSlice } from '@reduxjs/toolkit'
import {
  createInvestigatorAndProtocolInformation,
  createInformedConsent,
  createPrincipalInvestigatorSubmission,
  getPrincipalInvestigatorSavedProtocolType
} from '../../services/ProtocolType/ClinicalResearcherService'
const ClinicalResearcherSlice = createSlice({
  name: 'Principal Investigator',
  initialState: {
    loading: false,
    error: null,
    createdInformedConsent: null,
    createdInvestigatorAndProtocolInformation: null,
    createdPrincipalInvestigatorSubmission: null,
    getAllPrincipalInvestigatorSavedProtocolType: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInvestigatorAndProtocolInformation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        createInvestigatorAndProtocolInformation.fulfilled,
        (state, action) => {
          state.loading = false
          state.createdInvestigatorAndProtocolInformation = action.payload
        }
      )
      .addCase(
        createInvestigatorAndProtocolInformation.rejected,
        (state, action) => {
          state.loading = false
          state.error = action.payload || action.error.message
        }
      )
      .addCase(createInformedConsent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createInformedConsent.fulfilled, (state, action) => {
        state.loading = false
        state.createdInformedConsent = action.payload
      })
      .addCase(createInformedConsent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      .addCase(createPrincipalInvestigatorSubmission.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        createPrincipalInvestigatorSubmission.fulfilled,
        (state, action) => {
          state.loading = false
          state.createdPrincipalInvestigatorSubmission = action.payload
        }
      )
      .addCase(
        createPrincipalInvestigatorSubmission.rejected,
        (state, action) => {
          state.loading = false
          state.error = action.payload || action.error.message
        }
      )
      .addCase(getPrincipalInvestigatorSavedProtocolType.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        getPrincipalInvestigatorSavedProtocolType.fulfilled,
        (state, action) => {
          state.loading = false
          state.getAllPrincipalInvestigatorSavedProtocolType = action.payload
        }
      )
      .addCase(
        getPrincipalInvestigatorSavedProtocolType.rejected,
        (state, action) => {
          state.loading = false
          state.error = action.payload || action.error.message
        }
      )
  }
})

export default ClinicalResearcherSlice.reducer
