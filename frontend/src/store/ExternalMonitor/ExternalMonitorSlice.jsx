import { createSlice } from "@reduxjs/toolkit";
import { fetchProtocolList } from "../../services/ExternalMonitor/ExternalMonitorService";

const ExternalMonitorSlice = createSlice({
  name: "External Monitor",
  initialState: {
    loading: false,
    error: null,
    protocolList: null,
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
      });
  },
});

export default ExternalMonitorSlice.reducer;
