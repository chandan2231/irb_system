import React, { useState, useEffect } from "react";
import CommonModal from "../../../components/CommonModal/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
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
import DropdownWithSearch from "../../../components/DropdownWithSearch";
import { FormHelperText } from "@mui/material";

const defaultInputValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const AddMember = ({ open, onClose, addNewData }) => {
  const [values, setValues] = useState(defaultInputValues);
  const [showPassword, setShowPassword] = React.useState(false);
  const [userTypeList, setUserTypeList] = React.useState([
    { name: "Voting Member", id: "Voting Member" },
    { name: "Non Voting Member", id: "Non Voting Member" },
    { name: "Office Staff", id: "Office Staff" },
    { name: "Committee Chair", id: "Committee Chair" },
  ]);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
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

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email is invalid."),
    phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
    password: Yup.string().required("Password is required"),
    user_type: Yup.string().required("User Type is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  const addNew = (data) => {
    addNewData(data);
  };

  const handleChange = (value) => {
    setValues(value);
  };

  useEffect(() => {
    if (open) setValues(defaultInputValues);
  }, [open]);

  const getContent = () => (
    <Box sx={modalStyles.inputFields}>
      <TextField
        placeholder="Name"
        name="name"
        label="Name"
        required
        {...register("name")}
        error={errors.name ? true : false}
        helperText={errors.name?.message}
        value={values.name}
        onChange={(event) =>
          handleChange({ ...values, name: event.target.value })
        }
      />
      <TextField
        placeholder="Email"
        name="email"
        label="Email"
        required
        {...register("email")}
        error={errors.email ? true : false}
        helperText={errors.email?.message}
        value={values.email}
        onChange={(event) =>
          handleChange({ ...values, email: event.target.value })
        }
      />
      <TextField
        placeholder="Phone Number"
        name="phone"
        label="Phone Number"
        required
        {...register("phone")}
        error={errors.phone ? true : false}
        helperText={errors.phone?.message}
        value={values.phone}
        onChange={(event) =>
          handleChange({ ...values, phone: event.target.value })
        }
      />

      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          placeholder="Password"
          name="password"
          label="Password"
          required
          {...register("password")}
          error={errors.password ? true : false}
          helperText={errors.password?.message}
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
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
        {errors.password?.message !== undefined ? (
          <FormHelperText style={{ color: "red" }}>
            {errors.password?.message}
          </FormHelperText>
        ) : null}
      </FormControl>
      <DropdownWithSearch
        title={"User Type"}
        name={"user_type"}
        label={"Select User *"}
        error={errors.user_type ? true : false}
        helperText={errors.user_type?.message}
        value={values.user_type}
        labelId={"demo-simple-select-required-label"}
        id={"demo-simple-select-required"}
        activeListArr={userTypeList}
        setOption={(id) => handleChange({ ...values, user_type: id })}
        multiple={false}
        {...register("user_type")}
      />
    </Box>
  );

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create New Member"
      subTitle=""
      content={getContent()}
      onSubmit={handleSubmit(addNew)}
    />
  );
};

export default AddMember;
