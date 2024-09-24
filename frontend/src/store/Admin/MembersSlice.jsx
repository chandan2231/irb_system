import { createSlice } from "@reduxjs/toolkit";
import { fetchMemberList, createMember, changeStatus, resetMemberPassword } from "../../services/Admin/MembersService";

const MembersSlice = createSlice({
  name: "members",
  initialState: {
    loading: false,
    error: null,
    memberList: null,
    memberCreated: null,
    changeStatus: null,
    changeUserStatus: null,
    userActiveList: null,
    loadingActiveUser: null,
    memberPasswordChanged: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberList.fulfilled, (state, action) => {
        state.loading = false;
        state.memberList = action.payload;
      })
      .addCase(fetchMemberList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
        state.memberCreated = action.payload;
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        let updateMemberList = state.memberList.map((element, index) => 
          element.id === action.payload.id ? {...element, status: action.payload.status} : element
        );
        state.memberList = updateMemberList
        state.changeUserStatus = action.payload;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(resetMemberPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetMemberPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.memberPasswordChanged = action.payload;
      })
      .addCase(resetMemberPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      ;
  },
});

export default MembersSlice.reducer;
