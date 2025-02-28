import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMemberList,
  createMember,
  changeStatus,
  resetMemberPassword,
  fetchActiveVotingMemberList,
  createProtocolEvent,
  fetchMemberEventList,
  assignProtocolToMember,
  fetchAssignMemberList,
  fetchAssignMemberProtocolList,
  votingMemberApprovalProtocol,
  fetchApprovedProtocolsByMembersList,
  chairCommitteeApprovalProtocol,
  fetchMemberListForSuperAdmin,
  allowVoteForMember,
} from "../../services/Admin/MembersService";

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
    activeVotingMemberList: null,
    memberEventCreated: null,
    memberEventList: null,
    memberAssigned: null,
    memberAssignedList: null,
    assignMemberProtocolList: null,
    votingMemberApprovedProtocol: null,
    approvedProtocolsByMembersList: null,
    createdChairCommitteeApprovalProtocol: null,
    memberListSuperAdmin: null,
    votingAllowedForMember: null,
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
          element.id === action.payload.id
            ? { ...element, status: action.payload.status }
            : element
        );
        state.memberList = updateMemberList;
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
      .addCase(fetchActiveVotingMemberList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveVotingMemberList.fulfilled, (state, action) => {
        state.loading = false;
        state.activeVotingMemberList = action.payload;
      })
      .addCase(fetchActiveVotingMemberList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createProtocolEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProtocolEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.memberEventCreated = action.payload;
      })
      .addCase(createProtocolEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchMemberEventList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberEventList.fulfilled, (state, action) => {
        state.loading = false;
        state.memberEventList = action.payload;
      })
      .addCase(fetchMemberEventList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(assignProtocolToMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignProtocolToMember.fulfilled, (state, action) => {
        state.loading = false;
        state.memberAssigned = action.payload;
      })
      .addCase(assignProtocolToMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAssignMemberList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignMemberList.fulfilled, (state, action) => {
        state.loading = false;
        state.memberAssignedList = action.payload;
      })
      .addCase(fetchAssignMemberList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAssignMemberProtocolList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignMemberProtocolList.fulfilled, (state, action) => {
        state.loading = false;
        state.assignMemberProtocolList = action.payload;
      })
      .addCase(fetchAssignMemberProtocolList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(votingMemberApprovalProtocol.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(votingMemberApprovalProtocol.fulfilled, (state, action) => {
        state.loading = false;
        state.votingMemberApprovedProtocol = action.payload;
      })
      .addCase(votingMemberApprovalProtocol.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchApprovedProtocolsByMembersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchApprovedProtocolsByMembersList.fulfilled,
        (state, action) => {
          state.loading = false;
          state.approvedProtocolsByMembersList = action.payload;
        }
      )
      .addCase(
        fetchApprovedProtocolsByMembersList.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        }
      )
      .addCase(chairCommitteeApprovalProtocol.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(chairCommitteeApprovalProtocol.fulfilled, (state, action) => {
        state.loading = false;
        state.createdChairCommitteeApprovalProtocol = action.payload;
      })
      .addCase(chairCommitteeApprovalProtocol.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchMemberListForSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberListForSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.memberListSuperAdmin = action.payload;
      })
      .addCase(fetchMemberListForSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(allowVoteForMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allowVoteForMember.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("state.memberEventList", state.memberEventList);
        // let updateMemberEventList = state.memberEventList.map(
        //   (element, index) =>
        //     element.id === action.payload.id
        //       ? { ...element, allow_voting: action.payload.allow_voting }
        //       : element
        // );
        // state.memberEventList = {
        //   ...state.memberEventList,
        //   data: updateMemberEventList,
        // };
        state.votingAllowedForMember = action.payload;
      })
      .addCase(allowVoteForMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default MembersSlice.reducer;
