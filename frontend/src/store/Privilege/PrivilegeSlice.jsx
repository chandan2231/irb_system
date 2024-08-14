import { createSlice } from "@reduxjs/toolkit";
import { fetchPrivilegeList, createPrivilege, changeStatus, fetchActivePrivilegeList } from "../../services/Privilege/PrivilegeService"; // Import the thunk

const PrivilegeSlice = createSlice({
  name: "role",
  initialState: {
    privilegeList: null,
    loading: false,
    error: null,
    createdPrivilege: null,
    changeStatus: null,
    changePrivilegeStatus: null,
    activePrivilegeList: null,
    loadingPrivilege: null,
    errorPrivilege: null,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrivilegeList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrivilegeList.fulfilled, (state, action) => {
        state.loading = false;
        state.privilegeList = action.payload;
      })
      .addCase(fetchPrivilegeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createPrivilege.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrivilege.fulfilled, (state, action) => {
        state.loading = false;
        state.createdPrivilege = action.payload;
      })
      .addCase(createPrivilege.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        let updatePrivilegeList = state.privilegeList.content.map((element, index) => 
          element.id === action.payload.id ? {...element, enabled: action.payload.enabled} : element
        );
        state.privilegeList['content'] = updatePrivilegeList
        state.changePrivilegeStatus = action.payload;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchActivePrivilegeList.pending, (state) => {
        state.loadingPrivilege = true;
        state.errorPrivilege = null;
      })
      .addCase(fetchActivePrivilegeList.fulfilled, (state, action) => {
        state.loadingPrivilege = false;
        state.activePrivilegeList = action.payload;
      })
      .addCase(fetchActivePrivilegeList.rejected, (state, action) => {
        state.loadingPrivilege = false;
        state.errorPrivilege = action.payload || action.error.message;
      });
  },
});

export default PrivilegeSlice.reducer;
