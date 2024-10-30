import { createSlice } from "@reduxjs/toolkit";
import { fetchEventPriceList, createEventPrice, changeStatus } from "../../services/Admin/EventPriceService";

const EventPriceSlice = createSlice({
  name: "Event Price",
  initialState: {
    loading: false,
    error: null,
    eventPriceList: null,
    eventPriceCreated: null,
    changeStatus: null,
    changeEventPriceStatus: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventPriceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventPriceList.fulfilled, (state, action) => {
        state.loading = false;
        state.eventPriceList = action.payload;
      })
      .addCase(fetchEventPriceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createEventPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEventPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.eventPriceCreated = action.payload;
      })
      .addCase(createEventPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        let updateEventPriceList = state.eventPriceList.map((element, index) => 
          element.id === action.payload.id ? {...element, status: action.payload.status} : element
        );
        state.eventPriceList = updateEventPriceList
        state.changeEventPriceStatus = action.payload;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      ;
  },
});

export default EventPriceSlice.reducer;
