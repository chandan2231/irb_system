import * as Yup from "yup";
import CommonModal from "../../components/CommonModal/Modal";
import DropdownWithSearch from "../../components/DropdownWithSearch";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Checkbox,
  styled,
  TextField,
  Typography,
  InputLabel,
  FormGroup,
  Grid,
} from "@mui/material";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const defaultInputValues = {
  research_type_id: "",
  protocol_user_type: "",
  attachments_file: null,
};

const defaultInputValuesForHaveProtocolId = {
  protocolId: "",
  verificationCode: "",
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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

  const optionsForHaveProtocolId = [
    { name: "High School", id: "High School" },
    { name: "Under Graduate", id: "Under Graduate" },
    { name: "Graduate", id: "Graduate" },
    { name: "Commercial", id: "Commercial" },
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
    protocol_user_type: Yup.string().when("research_type_id", {
      is: "Principal Investigator",
      then: (schema) => schema.required("Please select type is required"),
      otherwise: (schema) => schema,
    }),
    attachments_file: Yup.mixed().when(
      ["research_type_id", "protocol_user_type"],
      {
        is: (research_type_id, protocol_user_type) =>
          research_type_id === "Principal Investigator" &&
          protocol_user_type !== "Commercial",
        then: (schema) =>
          schema.test("fileRequired", "File is required", (value) => {
            if (!value) return false;
            if (value instanceof FileList) return value.length > 0;
            if (value instanceof File) return true;
            return false;
          }),
        otherwise: (schema) => schema.notRequired(),
      }
    ),
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
    console.log("aaaaaaa");
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

  const showAfterResearchType = (values) => {
    console.log("values ====>", values);

    if (
      !values.protocol_user_type ||
      values.protocol_user_type === "" ||
      values.protocol_user_type === "Commercial"
    ) {
      return null;
    }

    return (
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Upload verification document
            </InputLabel>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                name="attachments_file"
                {...register("attachments_file")} // Register input for React Hook Form
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setValues({
                      ...values,
                      [e.target.name]: e.target.files,
                    });
                  }
                }}
              />
            </Button>
          </Grid>
        </Grid>
        {values.attachments_file &&
          Array.from(values.attachments_file).map((file, i) => (
            <div key={i}>{file.name}</div>
          ))}
        {errors.attachments_file && (
          <div className="error">{errors.attachments_file?.message}</div>
        )}
      </Box>
    );
  };

  const getContentIfIsHaveProtocolIdNotChecked = () => {
    return (
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
          setOption={(id) => {
            const payload = {
              ...values,
              research_type_id: id,
              protocol_user_type:
                id !== "Principal Investigator"
                  ? ""
                  : values.protocol_user_type || "",
            };
            handleChange({ ...payload });
          }}
          {...register("research_type_id")}
        />

        {values.research_type_id === "Principal Investigator" ? (
          <DropdownWithSearch
            title={"Select PI Affiliation"}
            name={"protocol_user_type"}
            label={"Select PI Affiliation *"}
            error={errors.protocol_user_type ? true : false}
            helperText={errors.protocol_user_type?.message}
            value={values.protocol_user_type}
            labelId={"demo-simple-select-required-label"}
            id={"demo-simple-select-required"}
            activeListArr={optionsForHaveProtocolId}
            setOption={(id) =>
              handleChange({ ...values, protocol_user_type: id })
            }
            {...register("protocol_user_type")}
          />
        ) : null}

        {showAfterResearchType(values)}
      </Box>
    );
  };

  const getContent = () => (
    <Box display="flex" alignItems="center">
      <Checkbox
        checked={isHaveProtocolIdChecked}
        onChange={handleCheckBoxChange}
      />
      <Typography variant="body1">
        Do you have a multi-site protocol access code?
      </Typography>
    </Box>
  );

  const getContentIfIsHaveProtocolIdChecked = () => {
    return (
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
  };

  const getContentForHaveProtocolId = () => (
    <Box>
      {getContent()}
      {isHaveProtocolIdChecked
        ? getContentIfIsHaveProtocolIdChecked()
        : getContentIfIsHaveProtocolIdNotChecked()}
    </Box>
  );

  return (
    <React.Fragment>
      {/* {isHaveProtocolIdChecked ? (
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
      )} */}
      <CommonModal
        open={open}
        onClose={() => {
          onClose();
          isHaveProtocolIdChecked
            ? setIsHaveProtocolIdChecked(false)
            : () => {};
        }}
        title="Start a New Research Protocol"
        subTitle=""
        content={getContentForHaveProtocolId()}
        onSubmit={
          isHaveProtocolIdChecked
            ? handleSubmitForHaveProtocolId(handleHaveProtocolIdSubmit)
            : handleSubmit(addNew)
        }
      />
    </React.Fragment>
  );
};

export default AddResearch;
