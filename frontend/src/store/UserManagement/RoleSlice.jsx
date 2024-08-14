import { createSlice } from "@reduxjs/toolkit";
import { fetchRoleList, createRole, changeStatus, fetchActiveRoleList } from "../../services/UserManagement/RoleService"; // Import the thunk

const RoleSlice = createSlice({
  name: "role",
  initialState: {
    roleList: null,
    loading: false,
    error: null,
    createdRole: null,
    changeStatus: null,
    changeRoleStatus: null,
    roleActiveList: null,
    loadingActiveRole: null,
    errorActiveRole: null

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoleList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleList.fulfilled, (state, action) => {
        state.loading = false;
        state.roleList = action.payload;
      })
      .addCase(fetchRoleList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.createdUser = action.payload;
      })
      .addCase(createRole.rejected, (state, action) => {
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
        state.changeRoleStatus = action.payload;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchActiveRoleList.pending, (state) => {
        state.loadingActiveRole = true;
        state.errorActiveRole = null;
      })
      .addCase(fetchActiveRoleList.fulfilled, (state, action) => {
        state.loadingActiveRole = false;
        state.roleActiveList = action.payload;
      })
      .addCase(fetchActiveRoleList.rejected, (state, action) => {
        state.loadingActiveRole = false;
        state.errorActiveRole = action.payload || action.error.message;
      });
  },
});

export default RoleSlice.reducer;
