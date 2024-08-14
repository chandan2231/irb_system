import { createSlice } from "@reduxjs/toolkit";
import { fetchHierarchyList, createHierarchy, changeStatus } from "../../services/Hierarchy/HierarchyService";
const HierarchySlice = createSlice({
  name: "hierarchy",
  initialState: {
    loading: false,
    error: null,
    hierarchyList: null,
    createdHierarchy: null,
    changeStatus: null,
    changeHierarchyStatus: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHierarchyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHierarchyList.fulfilled, (state, action) => {
        state.loading = false;
        state.hierarchyList = action.payload;
      })
      .addCase(fetchHierarchyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createHierarchy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHierarchy.fulfilled, (state, action) => {
        state.loading = false;
        state.createdHierarchy = action.payload;
      })
      .addCase(createHierarchy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        let updateHierarchyList = state.hierarchyList.content.map((element) => 
          element.id === action.payload.id ? {...element, enabled: action.payload.enabled} : element
        );
        state.hierarchyList['content'] = updateHierarchyList
        state.changeHierarchyStatus = action.payload;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default HierarchySlice.reducer;
