import { createAsyncThunk } from '@reduxjs/toolkit'
import ApiCall from '../../utility/ApiCall'
const baseURL = 'http://localhost:8800/api'

export const fetchContinuinReviewProtocolList = createAsyncThunk(
  'ContinuinReviewList/fetchContinuinReviewProtocolList',
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: 'GET',
        url: `${baseURL}/admin/protocol/list`,
        data
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchContinuinReviewDetailsById = createAsyncThunk(
  'ContinuinReviewList/fetchContinuinReviewDetailsById',
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiCall({
        method: 'POST',
        url: `${baseURL}/admin/continuinDetailsById`,
        data
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
