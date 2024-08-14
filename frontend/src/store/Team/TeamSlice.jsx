import { createSlice } from "@reduxjs/toolkit";
import { fetchTeamList, createTeam, changeStatus } from "../../services/Team/TeamService";
const TeamSlice = createSlice({
  name: "team",
  initialState: {
    loading: false,
    error: null,
    teamList: null,
    createdTeam: null,
    changeStatus: null,
    changeTeamStatus: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamList.fulfilled, (state, action) => {
        state.loading = false;
        state.teamList = action.payload;
      })
      .addCase(fetchTeamList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.createdTeam = action.payload;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;
        let updateTeamList = state.teamList.content.map((element) => 
          element.id === action.payload.id ? {...element, enabled: action.payload.enabled} : element
        );
        state.teamList['content'] = updateTeamList
        state.changeTeamStatus = action.payload;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default TeamSlice.reducer;
