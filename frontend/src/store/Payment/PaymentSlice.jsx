import { createSlice } from "@reduxjs/toolkit";
import {
  getPaymentAmountInfo,
  createPayment,
  capturePayment,
  canclePayment,
  successPayment,
} from "../../services/Payment/PaymentService";

const PaymentSlice = createSlice({
  name: "Payment",
  initialState: {
    paymentLoading: false,
    paymentError: null,
    paymentAmount: null,
    paymentCreated: null,
    paymentCaptured: null,
    paymentCancled: null,
    paymentSuccessed: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentAmountInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentAmountInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentAmount = action.payload;
      })
      .addCase(getPaymentAmountInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentCreated = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(capturePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(capturePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentCaptured = action.payload;
      })
      .addCase(capturePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(successPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(successPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSuccessed = action.payload;
      })
      .addCase(successPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(canclePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(canclePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentCancled = action.payload;
      })
      .addCase(canclePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default PaymentSlice.reducer;
