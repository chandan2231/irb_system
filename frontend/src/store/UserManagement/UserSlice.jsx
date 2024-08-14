import { createSlice } from "@reduxjs/toolkit";
import { fetchUserList, createUser, changeStatus, fetchActiveUsersList } from "../../services/UserManagement/UserService"; // Import the thunk

const UserSlice = createSlice({
  name: "user",
  initialState: {
    userList: null,
    loading: false,
    error: null,
    createdUser: null,
    changeStatus: null,
    changeUserStatus: null,
    userActiveList: null,
    loadingActiveUser: null,
    errorActiveUser: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.createdUser = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        let updateUserList = state.userList.content.map((element, index) => 
          element.id === action.payload.id ? {...element, enabled: action.payload.enabled} : element
        );
        state.userList['content'] = updateUserList
        state.changeUserStatus = action.payload;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchActiveUsersList.pending, (state) => {
        state.loadingActiveUser = true;
        state.errorActiveUser = null;
      })
      .addCase(fetchActiveUsersList.fulfilled, (state, action) => {
        state.loadingActiveUser = false;
        state.userActiveList = action.payload;
      })
      .addCase(fetchActiveUsersList.rejected, (state, action) => {
        state.loadingActiveUser = false;
        state.errorActiveUser = action.payload || action.error.message;
      });
  },
});

export default UserSlice.reducer;
