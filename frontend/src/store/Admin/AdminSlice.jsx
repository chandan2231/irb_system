import { createSlice } from "@reduxjs/toolkit";
import {
  fetchApprovedProtocolList,
  fetchProtocolDetailsById,
  allowProtocolEdit,
  fetchUnderReviewProtocolList,
  fetchCreatedProtocolList,
  allowProtocolWaiveFee,
  fetchAllProtocolList,
  fetchRejectedProtocolList,
} from "../../services/Admin/ProtocolListService";
import {
  fetchContinuinReviewProtocolList,
  fetchContinuinReviewDetailsById,
} from "../../services/Admin/ContinuinReviewListService";
import {
  fetchUsersList,
  changeUserStatus,
  resetUserPassword,
  fetchMasterListByType,
} from "../../services/Admin/UsersListService";
import {
  getStudyCloseoutRequest,
  getPromptlyReportableEvent,
  getProtocolAmendmentRequest,
  getAdverseEvent,
  fetchStudyCloseoutRequestDetailsById,
  fetchPromptlyReportableEventById,
  fetchAdverseEventById,
  fetchProtocolAmendmentRequestById,
} from "../../services/Admin/EventAndRequestService";

const AdminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    error: null,
    approvedProtocolList: null,
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
    userStatusChanged: null,
    memberPasswordChanged: null,
    userPasswordChanged: null,
    underReviewProtocolList: null,
    createdProtocolList: null,
    protocolWaiveFee: null,
    allProtocolList: null,
    rejectedProtocolList: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProtocolList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProtocolList.fulfilled, (state, action) => {
        state.loading = false;
        state.allProtocolList = action.payload;
      })
      .addCase(fetchAllProtocolList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchApprovedProtocolList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedProtocolList.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedProtocolList = action.payload;
      })
      .addCase(fetchApprovedProtocolList.rejected, (state, action) => {
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
      .addCase(
        fetchStudyCloseoutRequestDetailsById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.studyCloseoutRequestDetailsById = action.payload;
        }
      )
      .addCase(
        fetchStudyCloseoutRequestDetailsById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        }
      )
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
        let updateUnderReviewProtocolList = state.underReviewProtocolList.map(
          (element, index) =>
            element.id === action.payload.id
              ? { ...element, allow_edit: action.payload.allow_edit }
              : element
        );
        state.underReviewProtocolList = updateUnderReviewProtocolList;
        state.allowEditStatus = action.payload;
      })
      .addCase(allowProtocolEdit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        let updateUserList = state.usersList.map((element, index) =>
          element.id === action.payload.id
            ? { ...element, status: action.payload.status }
            : element
        );
        state.usersList = updateUserList;
        state.userStatusChanged = action.payload;
      })
      .addCase(changeUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.userPasswordChanged = action.payload;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchUnderReviewProtocolList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnderReviewProtocolList.fulfilled, (state, action) => {
        state.loading = false;
        state.underReviewProtocolList = action.payload;
      })
      .addCase(fetchUnderReviewProtocolList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchRejectedProtocolList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRejectedProtocolList.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectedProtocolList = action.payload;
      })
      .addCase(fetchRejectedProtocolList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCreatedProtocolList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreatedProtocolList.fulfilled, (state, action) => {
        state.loading = false;
        state.createdProtocolList = action.payload;
      })
      .addCase(fetchCreatedProtocolList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(allowProtocolWaiveFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allowProtocolWaiveFee.fulfilled, (state, action) => {
        state.loading = false;
        let updateCreatedProtocolList = state.createdProtocolList.map(
          (element, index) =>
            element.id === action.payload.id
              ? { ...element, waive_fee: action.payload.waive_fee }
              : element
        );
        state.createdProtocolList = updateCreatedProtocolList;
        state.protocolWaiveFee = action.payload;
      })
      .addCase(allowProtocolWaiveFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchMasterListByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterListByType.fulfilled, (state, action) => {
        state.loading = false;
        state.masterDataList = action.payload;
      })
      .addCase(fetchMasterListByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default AdminSlice.reducer;
