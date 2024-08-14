import { createSlice } from "@reduxjs/toolkit";
import { fetchProtocolList, createProtocol } from "../../services/Dashboard/DashboardService";
const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    error: null,
    protocolList: null,
    createdProtocol: null,
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
  },
});

export default DashboardSlice.reducer;
