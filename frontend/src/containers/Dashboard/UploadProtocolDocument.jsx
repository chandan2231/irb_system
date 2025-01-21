import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { uploadFile } from "../../services/UserManagement/UserService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";

const UploadProtocolDocument = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [loader, setLoader] = React.useState(false);
  const protocolTypeDetails = location.state.details;

  if (loader) {
    return <Loader />;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Box sx={{ width: "100%" }}>
        <h2 className="ml-20">Upload Document</h2>
        <h3 className="ml-20">
          {protocolTypeDetails.researchType}&nbsp;(
          {protocolTypeDetails.protocolId})
        </h3>
      </Box>
    </>
  );
};

export default UploadProtocolDocument;
