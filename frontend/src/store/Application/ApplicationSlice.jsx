import { createSlice } from "@reduxjs/toolkit";
import { fetchApplicationList, createApplication, changeStatus, fetchActiveApplicationList } from "../../services/Application/ApplicationService"; // Import the thunk

const ApplicationSlice = createSlice({
  name: "application",
  initialState: {
    applicationList: null,
    loading: false,
    error: null,
    createdApplication: null,
    changeStatus: null,
    changeApplicationStatus: null,
    activeApplicationList: null,
    loadingApplicaton: null,
    errorApplication: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationList.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationList = action.payload;
      })
      .addCase(fetchApplicationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.createdApplication = action.payload;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        let updateApplicationList = state.applicationList.content.map((element, index) => 
          element.id === action.payload.id ? {...element, enabled: action.payload.enabled} : element
        );
        state.applicationList['content'] = updateApplicationList
        state.changeApplicationStatus = action.payload;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchActiveApplicationList.pending, (state) => {
        state.loadingApplicaton = true;
        state.errorApplication = null;
      })
      .addCase(fetchActiveApplicationList.fulfilled, (state, action) => {
        state.loadingApplicaton = false;
        state.activeApplicationList = action.payload;
      })
      .addCase(fetchActiveApplicationList.rejected, (state, action) => {
        state.loadingApplicaton = false;
        state.errorApplication = action.payload || action.error.message;
      });
  },
});

export default ApplicationSlice.reducer;
