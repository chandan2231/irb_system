import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import React, { useState, useEffect, useCallback } from "react";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { getEmailVerification } from "../../services/Auth/AuthService";

function EmailVerification() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    let dataObject = { token: token };
    dispatch(getEmailVerification(dataObject)).then((data) => {
      if (data.payload.status === 200) {
        setMessage("Email Verified! Redirecting to signin...");
        setTimeout(() => navigate("/signin"), 3000);
      } else {
        setMessage("Email verification failed");
      }
    });
  }, [token, navigate]);

  const modalStyles = {
    inputFields: {
      display: "flex",
      flexDirection: "column",
      marginTop: "20px",
      marginBottom: "15px",
      ".MuiFormControl-root": {
        marginBottom: "20px",
      },
    },
  };

  const styles = {
    title: {
      paddingTop: "50px",
      paddingBottom: "10px",
      display: "flex",
      top: "50%",
      left: "50%",
      margin: "auto",
    },
  };

  return (
    <Box m={theme.layoutContainer.layoutSection}>
      <Box sx={modalStyles.inputFields}>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Card sx={{ width: 700 }}>
            <CardContent>
              <Typography sx={{ mt: 2, mb: 5 }}>
                <h2 sx={styles.title}>Email Verification</h2>
              </Typography>
              <Typography sx={{ mt: 2, mb: 5 }}>
                <h2 sx={styles.title}>{message}</h2>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
}

export default EmailVerification;
