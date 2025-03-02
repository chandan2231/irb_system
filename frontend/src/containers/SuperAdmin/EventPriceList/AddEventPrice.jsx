import React, { useState, useEffect } from "react";
import CommonModal from "../../../components/CommonModal/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DropdownWithSearch from "../../../components/DropdownWithSearch";

const defaultInputValues = {
  event_type: "",
  price: "",
};

const AddEventPrice = ({ open, onClose, addNewData, title }) => {
  const [values, setValues] = useState(defaultInputValues);
  const [eventTypeList, setEventTypeList] = React.useState([
    { name: "PI Initiated Trial", id: "Clinical Site" },
    { name: "Multi-Site Sponsor", id: "Multi-Site Sponsor" },
    { name: "Document Review", id: "Document Review" },
    { name: "High School", id: "High School" },
    { name: "Under Graduate", id: "Under Graduate" },
    { name: "Graduate", id: "Graduate" },
    { name: "Commercial", id: "Commercial" },
    { name: "Continue Yearly Review", id: "Continue Yearly Review" },
    { name: "Protocol Amendment", id: "Protocol Amendment" },
    {
      name: "Multi-Site Joining Clinical Site",
      id: "Multi-Site Joining Clinical Site",
    },
  ]);
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
  const reg = /^$|^[0-9]+$/;
  const validationSchema = Yup.object().shape({
    event_type: Yup.string().required("Event Type is required"),
    price: Yup.string().matches(reg, "Price must be gretter than 0").min(1),
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
      <DropdownWithSearch
        title={"Select Event"}
        name={"event_type"}
        label={"Select Event *"}
        error={errors.event_type ? true : false}
        helperText={errors.event_type?.message}
        value={values.event_type}
        labelId={"demo-simple-select-required-label"}
        id={"demo-simple-select-required"}
        activeListArr={eventTypeList}
        setOption={(id) => handleChange({ ...values, event_type: id })}
        multiple={false}
        {...register("event_type")}
      />
      <TextField
        placeholder={"Price"}
        name={"price"}
        label={"Price"}
        required
        {...register("price")}
        error={errors.price ? true : false}
        helperText={errors.price?.message}
        value={values.price}
        onChange={(event) =>
          handleChange({ ...values, price: event.target.value })
        }
      />
    </Box>
  );

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={title}
      subTitle=""
      content={getContent()}
      onSubmit={handleSubmit(addNew)}
    />
  );
};

export default AddEventPrice;
