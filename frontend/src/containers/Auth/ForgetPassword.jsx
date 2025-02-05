import { useDispatch, useSelector } from "react-redux";
import { sendUsername } from "../../services/Auth/AuthService";
import { Box, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

const defaultInputValues = {
  username: "",
};

function ForgetPassword() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [values, setValues] = useState(defaultInputValues);
  const [successMessage, setSuccessMessage] = React.useState("");
  let [searchParams, setSearchParams] = useSearchParams();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  // console.log('errors', errors)
  const onSubmit = (data) => {
    console.log("data ===>", data);
    // let dataObject = {};
    // dataObject.username = data.username;
    // dataObject.redirect_url = searchParams.get("redirect_url");
    // dispatch(sendUsername(dataObject)).then((data) => {
    //   // console.log("send username response", data)
    //   if (data.payload.status) {
    //     setSuccessMessage(true);
    //   } else {
    //     setSuccessMessage(false);
    //   }
    // });
  };

  const handleChange = (value) => {
    setValues(value);
  };

  // useEffect(() => {
  //     if(loading){
  //         const paginationData = { page: paginationModel.page, size: paginationModel.pageSize };
  //         dispatch(fetchMarketList(paginationData));
  //     }
  // }, [loading])

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
                  <h2 sx={styles.title}>Welcome to IRBHUB</h2>
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

                <Grid
                  container
                  spacing={2}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      type="submit"
                      style={{
                        width: "100%",
                      }}
                    >
                      Submit
                    </Button>
                  </Grid>
                  <Grid container xs={12}>
                    <Box style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      marginTop: "15px",
                    }}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "flex-start",
                          width: "100%",
                          marginLeft: "20px",
                        }}
                      >
                        Already  have an account? &nbsp;
                        <Link
                          to="/signin"
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          Sign In
                        </Link>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </form>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
}

export default ForgetPassword;
