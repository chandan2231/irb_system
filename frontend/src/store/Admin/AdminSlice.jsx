import { createSlice } from "@reduxjs/toolkit";
import { fetchProtocolList, fetchProtocolDetailsById, allowProtocolEdit } from "../../services/Admin/ProtocolListService";
import { fetchContinuinReviewProtocolList, fetchContinuinReviewDetailsById } from "../../services/Admin/ContinuinReviewListService";
import { fetchUsersList } from "../../services/Admin/UsersListService";
import { 
    getStudyCloseoutRequest, 
    getPromptlyReportableEvent, 
    getProtocolAmendmentRequest, 
    getAdverseEvent,
    fetchStudyCloseoutRequestDetailsById,
    fetchPromptlyReportableEventById,
    fetchAdverseEventById,
    fetchProtocolAmendmentRequestById
} from "../../services/Admin/EventAndRequestService";



const AdminSlice = createSlice({
    name: "admin",
    initialState: {
        loading: false,
        error: null,
        protocolList: null,
        continuinReviewProtocolList: null,
        usersList: null,
        continuinReviewDetailsById: null,
        protocolDetailsById: null,
        studyCloseoutRequestList: null,
        promptlyReportableEventList: null,
        protocolAmendmentRequestList: null,
        adverseEventList: null,
        studyCloseoutRequestDetailsById: null,
        promptlyReportableEventById: null,
        adverseEventById: null,
        protocolAmendmentRequestById: null,
        allowEditStatus: null,
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
        })
        .addCase(fetchProtocolDetailsById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProtocolDetailsById.fulfilled, (state, action) => {
            state.loading = false;
            state.protocolDetailsById = action.payload;
        })
        .addCase(fetchProtocolDetailsById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(getStudyCloseoutRequest.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getStudyCloseoutRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.studyCloseoutRequestList = action.payload;
        })
        .addCase(getStudyCloseoutRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(getPromptlyReportableEvent.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getPromptlyReportableEvent.fulfilled, (state, action) => {
            state.loading = false;
            state.promptlyReportableEventList = action.payload;
        })
        .addCase(getPromptlyReportableEvent.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(getProtocolAmendmentRequest.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getProtocolAmendmentRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.protocolAmendmentRequestList = action.payload;
        })
        .addCase(getProtocolAmendmentRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(getAdverseEvent.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAdverseEvent.fulfilled, (state, action) => {
            state.loading = false;
            state.adverseEventList = action.payload;
        })
        .addCase(getAdverseEvent.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(fetchStudyCloseoutRequestDetailsById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchStudyCloseoutRequestDetailsById.fulfilled, (state, action) => {
            state.loading = false;
            state.studyCloseoutRequestDetailsById = action.payload;
        })
        .addCase(fetchStudyCloseoutRequestDetailsById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(fetchPromptlyReportableEventById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPromptlyReportableEventById.fulfilled, (state, action) => {
            state.loading = false;
            state.promptlyReportableEventById = action.payload;
        })
        .addCase(fetchPromptlyReportableEventById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(fetchAdverseEventById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAdverseEventById.fulfilled, (state, action) => {
            state.loading = false;
            state.adverseEventById = action.payload;
        })
        .addCase(fetchAdverseEventById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(fetchProtocolAmendmentRequestById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProtocolAmendmentRequestById.fulfilled, (state, action) => {
            state.loading = false;
            state.protocolAmendmentRequestById = action.payload;
        })
        .addCase(fetchProtocolAmendmentRequestById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        .addCase(allowProtocolEdit.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(allowProtocolEdit.fulfilled, (state, action) => {
            state.loading = false;
            state.allowEditStatus = action.payload;
        })
        .addCase(allowProtocolEdit.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
        ;
    },
});

export default AdminSlice.reducer;
