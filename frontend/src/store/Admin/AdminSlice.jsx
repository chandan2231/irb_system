import { createSlice } from "@reduxjs/toolkit";
import { fetchProtocolList } from "../../services/Admin/ProtocolListService";
import { fetchContinuinReviewProtocolList, fetchContinuinReviewDetailsById } from "../../services/Admin/ContinuinReviewListService";
import { fetchUsersList } from "../../services/Admin/UsersListService";
const AdminSlice = createSlice({
    name: "admin",
    initialState: {
        loading: false,
        error: null,
        protocolList: null,
        continuinReviewProtocolList: null,
        usersList: null,
        continuinReviewDetailsById: null,
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
        .addCase(fetchContinuinReviewProtocolList.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchContinuinReviewProtocolList.fulfilled, (state, action) => {
            state.loading = false;
            state.continuinReviewProtocolList = action.payload;
        })
        .addCase(fetchContinuinReviewProtocolList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(fetchUsersList.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsersList.fulfilled, (state, action) => {
            state.loading = false;
            state.usersList = action.payload;
        })
        .addCase(fetchUsersList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(fetchContinuinReviewDetailsById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchContinuinReviewDetailsById.fulfilled, (state, action) => {
            state.loading = false;
            state.continuinReviewDetailsById = action.payload;
        })
        .addCase(fetchContinuinReviewDetailsById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });
    },
});

export default AdminSlice.reducer;
