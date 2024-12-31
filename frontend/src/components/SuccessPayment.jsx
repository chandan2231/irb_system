import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate, useLocation } from "react-router-dom";

function SuccessPayment() {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const protocolTypeDetails = location.state.details;
  const amount = location.state.amount;

  return (
    <>
      <Box m={theme.layoutContainer.layoutSection}>
        <Box>
          <Typography variant="h5" mb={2} style={{ textAlign: "center" }}>
            Payment Successfull
          </Typography>
          <Typography variant="h6" mb={2}>
            Amount Paid: {amount}
            {" USD"}
          </Typography>
          <Typography variant="h6" mb={2}>
            Protocol Number: {protocolTypeDetails?.protocol_id}
          </Typography>
          <Typography variant="h6" mb={2}>
            Protocol Type: {protocolTypeDetails?.protocol_type}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default SuccessPayment;
