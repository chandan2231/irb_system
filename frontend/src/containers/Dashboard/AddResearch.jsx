import * as Yup from "yup";
import CommonModal from "../../components/CommonModal/Modal";
import DropdownWithSearch from "../../components/DropdownWithSearch";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Checkbox, TextField, Typography } from "@mui/material";

const defaultInputValues = {
  research_type_id: "",
};

const defaultInputValuesForHaveProtocolId = {
  protocolId: "",
  verificationCode: "",
};

const AddResearch = ({ open, onClose, addNewData }) => {
  const [values, setValues] = useState(defaultInputValues);
  const [valuesForHaveProtocolId, setValuesForHaveProtocolId] = useState(
    defaultInputValuesForHaveProtocolId
  );
  const [isHaveProtocolIdChecked, setIsHaveProtocolIdChecked] = useState(false);
  const [researchTypeError, setResearchTypeError] = useState("");
  const options = [
    { name: "Clinical Site", id: "Clinical Site" },
    { name: "Multi-Site Sponsor", id: "Multi-Site Sponsor" },
    { name: "Principal Investigator", id: "Principal Investigator" },
    { name: "Document Review", id: "Document Review" },
  ];

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

  const validationSchema = Yup.object().shape({
    research_type_id: Yup.string().required("Research type is required"),
  });

  const validationSchemaForHaveProtocolId = Yup.object().shape({
    protocolId: Yup.string().required("Protocol ID is required"),
    verificationCode: Yup.string().required("Verification Code is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const {
    register: registerForHaveProtocolId,
    handleSubmit: handleSubmitForHaveProtocolId,
    formState: { errors: errorsForHaveProtocolId },
  } = useForm({ resolver: yupResolver(validationSchemaForHaveProtocolId) });

  const addNew = (data) => {
    addNewData(data);
  };

  const handleHaveProtocolIdSubmit = (data) => {
    addNewData(data, "haveProtocolId");
  };

  const handleCheckBoxChange = (e) => {
    const { checked } = e.target;
    setIsHaveProtocolIdChecked(checked);
  };

  const handleChange = (value) => {
    setValues(value);
  };

  useEffect(() => {
    if (open) setValues(defaultInputValues);
  }, [open]);

  const getContent = () => (
    <Box
      sx={{
        marginTop: "-20px",
        marginBottom: "-20px",
      }}
    >
      <Box display="flex" alignItems="center">
        <Checkbox
          checked={isHaveProtocolIdChecked}
          onChange={handleCheckBoxChange}
        />
        <Typography variant="body1">
          Do You have Multi-site Protocol ID?
        </Typography>
      </Box>

      <Box sx={modalStyles.inputFields}>
        <DropdownWithSearch
          title={"Select Research Type"}
          name={"research_type_id"}
          label={"Select Research Type *"}
          error={errors.research_type_id ? true : false}
          helperText={errors.research_type_id?.message}
          value={values.research_type_id}
          labelId={"demo-simple-select-required-label"}
          id={"demo-simple-select-required"}
          activeListArr={options}
          setOption={(id) => handleChange({ ...values, research_type_id: id })}
          {...register("research_type_id")}
        />
      </Box>
    </Box>
  );

  const getContentForHaveProtocolId = () => (
    <Box sx={modalStyles.inputFields}>
      <TextField
        id="outlined-basic"
        label="Multi-site Protocol ID"
        variant="outlined"
        fullWidth
        name="protocolId"
        error={errorsForHaveProtocolId.protocolId ? true : false}
        value={valuesForHaveProtocolId.protocolId}
        helperText={errorsForHaveProtocolId.protocolId?.message}
        {...registerForHaveProtocolId("protocolId")}
        onChange={(e) => {
          setValuesForHaveProtocolId({
            ...valuesForHaveProtocolId,
            protocolId: e.target.value,
          });
        }}
      />

      <TextField
        id="outlined-basic"
        label="Verification Code"
        variant="outlined"
        fullWidth
        name="verificationCode"
        error={errorsForHaveProtocolId.verificationCode ? true : false}
        helperText={errorsForHaveProtocolId.verificationCode?.message}
        value={valuesForHaveProtocolId.verificationCode}
        {...registerForHaveProtocolId("verificationCode")}
        onChange={(e) => {
          setValuesForHaveProtocolId({
            ...valuesForHaveProtocolId,
            verificationCode: e.target.value,
          });
        }}
      />
    </Box>
  );

  return (
    <React.Fragment>
      {isHaveProtocolIdChecked ? (
        <CommonModal
          open={open}
          onClose={() => {
            onClose();
            setIsHaveProtocolIdChecked(false);
          }}
          title="Create New Research Type"
          subTitle=""
          content={getContentForHaveProtocolId()}
          onSubmit={handleSubmitForHaveProtocolId(handleHaveProtocolIdSubmit)}
        />
      ) : (
        <CommonModal
          open={open}
          onClose={onClose}
          title="Create New Research Type"
          subTitle=""
          content={getContent()}
          onSubmit={handleSubmit(addNew)}
        />
      )}
    </React.Fragment>
  );
};

export default AddResearch;
