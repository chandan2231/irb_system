import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSignin } from "../../services/Auth/AuthService";
import { Box, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const defaultInputValues = {
  email: "",
  password: "",
};

function SignIn() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState(defaultInputValues);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  // console.log('errors', errors)
  const onSubmit = (data) => {
    dispatch(userSignin(data)).then((data) => {
      console.log("signin response", data);
      if (data.payload.status === 200) {
        setSuccessMessage(true);
        setCurrentUser(data.payload.data);
        localStorage.setItem("user", JSON.stringify(data.payload.data));
        setTimeout(() => {
          if (data.payload.data.user_type === "admin") {
            navigate("/admin/approved-protocol-list");
          } else if(data.payload.data.user_type === "Voting Member") {
            navigate("/member/protocol-list");
          } else if(data.payload.data.user_type === "Committee Chair") {
            navigate("/dashboard");
          } else if(data.payload.data.user_type === "Office Staff") {
            navigate("/dashboard");
          } else if(data.payload.data.user_type === "Non Voting Member") {
            navigate("/dashboard");
          }
        }, 2000);
      } else {
        setSuccessMessage(false);
      }
    });
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
      marginTop: "25px",
    },
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
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // useEffect(() => {
  //     localStorage.setItem("user", JSON.stringify(currentUser));
  // }, [currentUser]);

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
                {successMessage === true ? (
                  <Typography sx={{ mt: 2, mb: 5 }}>
                    <h4 sx={styles.title} className="success_msg">
                      Login Successfull
                    </h4>
                  </Typography>
                ) : successMessage === false ? (
                  <Typography sx={{ mt: 2, mb: 5 }}>
                    <h4 sx={styles.title} className="error_msg">
                      Something went wrong
                    </h4>
                  </Typography>
                ) : (
                  <></>
                )}
                <Typography sx={{ mt: 2, mb: 5 }}>
                  <h2 sx={styles.title}>LOGIN</h2>
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    placeholder="Email"
                    name="email"
                    label="Email"
                    {...register("email")}
                    error={errors.email ? true : false}
                    helperText={errors.email?.message}
                    value={values.email}
                    onChange={(event) =>
                      handleChange({ ...values, email: event.target.value })
                    }
                  />
                </FormControl>
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
                      handleChange({ ...values, password: event.target.value })
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
                <Box style={{ marginTop: "40px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{ float: "right", paddingLeft: "0px" }}
                  >
                    <CardActions style={{ padding: "0px" }}>
                      <span>Don't you have an account?</span>
                      <Link to="/signup">
                        <Button variant="contained" color="primary">
                          REGISTER
                        </Button>
                      </Link>
                    </CardActions>
                  </Grid>
                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                </Box>
              </CardContent>
            </form>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
}

export default SignIn;
