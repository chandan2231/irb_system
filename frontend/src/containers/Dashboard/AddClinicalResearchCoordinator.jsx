import React, { useState, useEffect } from "react";
import CommonModal from "../../components/CommonModal/Modal";
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
import DropdownWithSearch from "../../components/DropdownWithSearch";
import { FormHelperText } from "@mui/material";
import { Grid, Button } from "@mui/material";

const defaultInputValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  country: "",
  city: "",
  zip_code: "",
  company_name: "",
  license_number: "",
};

const AddClinicalResearchCoordinator = ({ open, onClose, addNewData }) => {
  const [values, setValues] = useState(defaultInputValues);
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
    // country: Yup.string().required("Country is required"),
    // city: Yup.string().required("City is required"),
    // zip_code: Yup.string().required("Zip Code is required"),
    company_name: Yup.string().required("Company Name is required"),
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
    <Box sx={{ width: "100%", padding: "16px" }}>
      <Grid container spacing={2}>
        {/* Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Name"
            name="name"
            label="Name"
            required
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            value={values.name}
            onChange={(event) =>
              handleChange({ ...values, name: event.target.value })
            }
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Email"
            name="email"
            label="Email"
            required
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            value={values.email}
            onChange={(event) =>
              handleChange({ ...values, email: event.target.value })
            }
          />
        </Grid>

        {/* Phone Number */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Phone Number"
            name="phone"
            label="Phone Number"
            required
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            value={values.phone}
            onChange={(event) =>
              handleChange({ ...values, phone: event.target.value })
            }
          />
        </Grid>

        {/* Company Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Company Name"
            name="company_name"
            label="Company Name"
            required
            {...register("company_name")}
            error={!!errors.company_name}
            helperText={errors.company_name?.message}
            value={values.company_name}
            onChange={(event) =>
              handleChange({ ...values, company_name: event.target.value })
            }
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="City"
            name="city"
            label="City"
            {...register("city")}
            error={!!errors.city}
            helperText={errors.city?.message}
            value={values.city}
            onChange={(event) =>
              handleChange({ ...values, city: event.target.value })
            }
          />
        </Grid>

        {/* Country */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Country"
            name="country"
            label="Country"
            {...register("country")}
            error={!!errors.country}
            helperText={errors.country?.message}
            value={values.country}
            onChange={(event) =>
              handleChange({ ...values, country: event.target.value })
            }
          />
        </Grid>

        {/* Zip Code */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Zip Code"
            name="zip_code"
            label="Zip Code"
            {...register("zip_code")}
            error={!!errors.zip_code}
            helperText={errors.zip_code?.message}
            value={values.zip_code}
            onChange={(event) =>
              handleChange({ ...values, zip_code: event.target.value })
            }
          />
        </Grid>

        {/* License Number */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="License Number"
            name="license_number"
            label="License Number"
            {...register("license_number")}
            error={!!errors.license_number}
            helperText={errors.license_number?.message}
            value={values.license_number}
            onChange={(event) =>
              handleChange({ ...values, license_number: event.target.value })
            }
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create New Clinical Research Coordinator"
      subTitle=""
      content={getContent()}
      onSubmit={handleSubmit(addNew)}
      identifier="external"
    />
  );
};

export default AddClinicalResearchCoordinator;
