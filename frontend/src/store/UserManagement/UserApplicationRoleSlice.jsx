import { createSlice } from "@reduxjs/toolkit";
import { fetchUserApplicationRoleList, createUserApplicationRole, changeStatus } from "../../services/UserManagement/UserApplicationRoleService";

const RoleSlice = createSlice({
  name: "userApplicationRole",
  initialState: {
    loading: false,
    error: null,
    userApplicationRoleList: null,
    createdUserApplicationRole: null,
    changeStatus: null,
    changeUserApplicationRoleStatus: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserApplicationRoleList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserApplicationRoleList.fulfilled, (state, action) => {
        state.loading = false;
        state.userApplicationRoleList = action.payload;
      })
      .addCase(fetchUserApplicationRoleList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createUserApplicationRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserApplicationRole.fulfilled, (state, action) => {
        state.loading = false;
        state.createdUserApplicationRole = action.payload;
      })
      .addCase(createUserApplicationRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        let updateRoleList = state.roleList.content.map((element, index) => 
          element.id === action.payload.id ? {...element, enabled: action.payload.enabled} : element
        );
        state.roleList['content'] = updateRoleList
        state.changeUserApplicationRoleStatus = action.payload;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default RoleSlice.reducer;
