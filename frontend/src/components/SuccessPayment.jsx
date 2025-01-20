import * as React from "react";
import Loader from "./Loader";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import { protocolReport } from "../services/UserManagement/UserService";

function SuccessPayment() {
  const theme = useTheme();
  const [loader, setLoader] = React.useState(false);
  const location = useLocation();
  const protocolTypeDetails = location.state.details;
  const amount = location.state.amount;

  const handleViewPdf = async () => {
    const {
      protocol_id: protocolId,
      protocol_type: researchType,
    } = protocolTypeDetails;
    const protocolReportPayload = {
      protocolId: protocolId,
      protocolType: researchType,
    };
    try {
      setLoader(true);
      let pdfResponse = await protocolReport(protocolReportPayload);
      setLoader(false);
      if (pdfResponse !== "") {
        window.open(pdfResponse.pdfUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  if (loader) {
    return <Loader />;
  }

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
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleViewPdf()}
          >
            Download Protocol
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default SuccessPayment;
