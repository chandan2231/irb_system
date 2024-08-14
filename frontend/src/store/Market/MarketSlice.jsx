import { createSlice } from "@reduxjs/toolkit";
import { fetchMarketList, createMarket, changeStatus, fetchActiveMarketList } from "../../services/Market/MarketService"; // Import the thunk
const MarketSlice = createSlice({
  name: "market",
  initialState: {
    marketList: null,
    loading: false,
    error: null,
    createdMarket: null,
    changeMarketStatus: null,
    activeMarketList: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketList.fulfilled, (state, action) => {
        state.loading = false;
        state.marketList = action.payload;
      })
      .addCase(fetchMarketList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createMarket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMarket.fulfilled, (state, action) => {
        state.loading = false;
        state.createdMarket = action.payload;
      })
      .addCase(createMarket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        let updateMarketList = state.marketList.content.map((element, index) => 
          element.id === action.payload.id ? {...element, enabled: action.payload.enabled} : element
        );
        state.marketList['content'] = updateMarketList
        state.changeMarketStatus = action.payload;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchActiveMarketList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveMarketList.fulfilled, (state, action) => {
        state.loading = false;
        state.activeMarketList = action.payload;
      })
      .addCase(fetchActiveMarketList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default MarketSlice.reducer;
