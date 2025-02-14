import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import { userSignUp } from "../../services/Auth/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function SignUp() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [err, setErr] = useState(null);
  // const [researchTypeError, setResearchTypeError] = useState('')
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const initialValues = {
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    // researcherType: "",
  };
  // const options = [
  //     { label: "Clinical Site", value: "Clinical Site" },
  //     { label: "Multi-Site Sponsor", value: "Multi-Site Sponsor" },
  //     { label: "Principal Investigator", value: "Principal Investigator" },
  // ]
  //password validation
  const lowercaseRegEx = /(?=.*[a-z])/;
  const uppercaseRegEx = /(?=.*[A-Z])/;
  const numericRegEx = /(?=.*[0-9])/;
  const lengthRegEx = /(?=.{6,})/;

  let validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    mobile: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .matches(
        lowercaseRegEx,
        "Must contain one lowercase alphabetical character!"
      )
      .matches(
        uppercaseRegEx,
        "Must contain one uppercase alphabetical character!"
      )
      .matches(numericRegEx, "Must contain one numeric character!")
      .matches(lengthRegEx, "Must contain 6 characters!")
      .required("Required!"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required!"),
  });
  const handleFormSubmit = (values) => {
    dispatch(userSignUp(values)).then((data) => {
      if (data.payload.status === 200) {
        console.log("signup response", data);
        setSuccessMessage(data.payload.data);
        setTimeout(() => navigate("/signin"), 5000);
      } else {
        setSuccessMessage(false);
      }
    });
  };
  const modalStyles = {
    inputFields: {
      display: "flex",
      flexDirection: "column",
      marginTop: "20px",
      marginBottom: "15px",
      ".MuiFormControl-root": {
        marginBottom: "10px",
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
    buttonStyle: {
      margin: "0 auto",
      display: "flex",
      marginTop: "25px",
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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({
                dirty,
                isValid,
                values,
                handleSubmit,
                handleChange,
                handleBlur,
              }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <CardContent>
                      {successMessage !== "" && (
                        <Typography sx={{ mt: 2, mb: 5 }}>
                          <h2 sx={styles.title} className="success_msg">
                            {successMessage}
                          </h2>
                        </Typography>
                      )}
                      <Typography sx={{ mt: 2, mb: 5 }}>
                        <h2 sx={styles.title}>SIGNUP</h2>
                      </Typography>
                      <p
                        className="error_text"
                        style={{ marginBottom: "15px" }}
                      >
                        {err && err}
                      </p>
                      <Grid item container spacing={1}>
                        <Grid item xs={12} sm={12} md={12}>
                          <Field
                            label="Name"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={values.name}
                            component={TextField}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          style={{ marginTop: "5px" }}
                        >
                          <Field
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name="email"
                            value={values.email}
                            component={TextField}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          style={{ marginTop: "5px" }}
                        >
                          <Field
                            label="Password"
                            variant="outlined"
                            fullWidth
                            name="password"
                            value={values.password}
                            type={showPassword ? "text" : "password"} // Toggle password visibility
                            component={TextField}
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          style={{ marginTop: "5px" }}
                        >
                          <Field
                            label="Confirm Password"
                            variant="outlined"
                            fullWidth
                            name="confirmPassword"
                            value={values.confirmPassword}
                            type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                            component={TextField}
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  edge="end"
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          style={{ marginTop: "5px" }}
                        >
                          <Field
                            label="Mobile"
                            variant="outlined"
                            fullWidth
                            name="mobile"
                            value={values.mobile}
                            component={TextField}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Grid item container spacing={1} justify="center">
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        style={{
                          marginLeft: "15px",
                          marginRight: "15px",
                        }}
                      >
                        <Button
                          disabled={!dirty || !isValid}
                          variant="contained"
                          color="primary"
                          type="Submit"
                          sx={{
                            width: "100%",
                          }}
                        >
                          SIGNUP
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        style={{
                          marginLeft: "15px",
                          marginRight: "15px",
                          marginTop: "15px",
                          marginBottom: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CardActions
                          style={{
                            padding: "0px",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span>Do you have an account?</span>
                          <Link
                            to="/signin"
                            style={{
                              textDecoration: "none",
                            }}
                          >
                            Login
                          </Link>
                        </CardActions>
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
}

export default SignUp;
