import { useDispatch, useSelector } from "react-redux";
import { resetPassword, validateUser } from "../../services/Auth/AuthService";
import { Box, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";

const defaultInputValues = {
  password: "",
  confirm_password: "",
};

function ResetPassword() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [values, setValues] = useState(defaultInputValues);
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = React.useState(false);
  const [passwordResetError, setPasswordResetError] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [userValidation, setUserValidation] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [seconds, setSeconds] = React.useState(10);
  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  // const { usernameSent, loading, error } = useSelector(
  //     state => ({
  //         error: state.auth.error,
  //         usernameSent: state.auth.usernameSent.status,
  //         loading: state.auth.loading
  //     })
  // );

  // useEffect(() => {
  //   let dataObject = {};
  //   dataObject.token = searchParams.get("token");
  //   dataObject.app_id = searchParams.get("app_id");
  //   dispatch(validateUser(dataObject)).then((data) => {
  //     console.log("validate user response", data);
  //     if (data.payload.status === true) {
  //       setUserValidation(true);
  //     } else {
  //       setUserValidation(false);
  //     }
  //   });
  // }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  const onSubmit = (data) => {
    let dataObject = {};
    dataObject.password = data.password;
    dataObject.token = token;
    dispatch(resetPassword(dataObject)).then((data) => {
      if (data.payload.status === 200) {
        setPasswordResetSuccess(true);
      } else {
        setPasswordResetError(true);
      }
    });
  };

  const [timer, setTimer] = useState(10);
  const timeOutCallback = useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  );
  useEffect(() => {
    if (passwordResetSuccess === true) {
      timer > 0 && setTimeout(timeOutCallback, 1000);
      timer === 0 && navigate("/signin");
    }
  }, [timer, timeOutCallback, passwordResetSuccess]);

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
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (value) => {
    setValues(value);
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                {passwordResetSuccess === true && (
                  <>
                    <Typography sx={{ mt: 2 }}>
                      <h4 sx={styles.title} className="success_msg">
                        You have reset your password successfully
                      </h4>
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      <h4 sx={styles.title}>
                        You will be redirected in 10 seconds {timer}
                      </h4>
                    </Typography>
                  </>
                )}
                {passwordResetError === true && (
                  <Typography sx={{ mt: 2, mb: 5 }}>
                    <h4 sx={styles.title} className="error_msg">
                      Something went wrong, Try again
                    </h4>
                  </Typography>
                )}
                <Typography sx={{ mt: 2, mb: 5 }}>
                  <h2 sx={styles.title}>Reset Password</h2>
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    placeholder="Password"
                    name="password"
                    label="Password"
                    {...register("password")}
                    error={errors.password ? true : false}
                    helperText={errors.password?.message}
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    onChange={(event) =>
                      handleChange({
                        ...values,
                        password: event.target.value,
                      })
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {Object.keys(errors).length > 0 && (
                    <div className="error_msg">{errors?.password?.message}</div>
                  )}
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    placeholder="Confirm Password"
                    name="confirm_password"
                    label="Confirm Password"
                    {...register("confirm_password")}
                    error={errors.confirm_password ? true : false}
                    helperText={errors.confirm_password?.message}
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    onChange={(event) =>
                      handleChange({
                        ...values,
                        confirm_password: event.target.value,
                      })
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {Object.keys(errors).length > 0 && (
                    <div className="error_msg">
                      {errors?.confirm_password?.message}
                    </div>
                  )}
                </FormControl>
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  sx={styles.buttonStyle}
                  style={{
                    width: "100%",
                  }}
                >
                  Submit
                </Button>
              </CardContent>
            </form>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
}

export default ResetPassword;
