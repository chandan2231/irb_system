import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Form from "react-bootstrap/Form";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import { createProtocolInformation } from "../../../../services/ProtocolType/MultiSiteSponsorService";
import { Box, useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../../components/Loader";
import { uploadFile } from "../../../../services/UserManagement/UserService";
import { useDispatch, useSelector } from "react-redux";
import { fetchProtocolDetailsById } from "../../../../services/Admin/ProtocolListService";

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

const protocoalInfoSchema = yup.object().shape({
  first_time_protocol: yup.string().required("This is required"),
  protocol_title: yup.string().required("This is required"),
  protocol_number: yup.string().required("This is required"),
  sponsor: yup.string().required("This is required"),
  study_duration: yup.string().required("This is required"),
  funding_source: yup.string().required("This is required"),
  disapproved_or_withdrawn_explain: yup
    .string()
    .when("disapproved_or_withdrawn", {
      is: (value) => value === "Yes",
      then: () => yup.string().required("This is required"),
      otherwise: () => yup.string().notRequired(),
    }),
  oversite_explain: yup.string().when("oversite", {
    is: (value) => value === "Yes",
    then: () => yup.string().required("This is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  protocol_file: yup
    .mixed()
    .test("fileReuired", "This is required", (value) => {
      return value && value.length > 0;
    }),
});

function ProtocolInformationForm({
  protocolTypeDetails,
  protocolInformation,
  handleNextTab,
  submissionForm = {},
}) {
  const [loader, setLoader] = useState(false);
  const [submissionFormDetails, setSubmissionFormDetails] = useState({
    waiveFee: submissionForm?.waive_fee,
    allowEdit: submissionForm?.allow_edit,
  });
  const dispatch = useDispatch();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [showAdditionalQuestion, setShowAdditionalQuestion] =
    React.useState(false);
  const [showDisapproveAdditionTextArea, setShowDisapproveAdditionTextArea] =
    React.useState(false);
  const [showOversiteAdditionTextArea, setShowOversiteAdditionTextArea] =
    React.useState(false);
  const [formData, setFormData] = useState({
    first_time_protocol: "",
    protocol_title: "",
    protocol_number: "",
    sponsor: "",
    study_duration: "",
    funding_source: "",
    disapproved_or_withdrawn: "",
    disapproved_or_withdrawn_explain: "",
    oversite: "",
    oversite_explain: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
    protocol_file: [],
  });
  const [errors, setErrors] = useState({});

  const handleRadioButtonSelectFirstTime = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (radio_name === "first_time_protocol" && value === "No") {
      setShowAdditionalQuestion(true);
    } else if (radio_name === "first_time_protocol" && value === "Yes") {
      setShowAdditionalQuestion(false);
      setShowDisapproveAdditionTextArea(false);
    }
  };

  const handleRadioButtonSelectDisapproved = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setShowDisapproveAdditionTextArea(value === "Yes");
  };

  const handleRadioButtonSelectOversite = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setShowOversiteAdditionTextArea(value === "Yes");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    setLoader(true);
    e.preventDefault();
    try {
      console.log("formData", formData);
      const getValidatedform = await protocoalInfoSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await protocoalInfoSchema.isValid(getValidatedform);
      console.log("formData", formData);
      if (isValid) {
        let protocol_file = [];
        if (!formData.protocol_file) {
          return setErrors({ ...errors, protocol_file: "This is required" });
        } else {
          for (let file of formData.protocol_file) {
            let id = await uploadFile(file, {
              protocolId: formData.protocol_id,
              createdBy: formData.created_by,
              protocolType: protocolTypeDetails.researchType,
              informationType: "protocol_information",
              documentName: "protocol",
            });
            protocol_file.push(id);
          }
        }

        dispatch(
          createProtocolInformation({ ...formData, protocol_file })
        ).then((data) => {
          if (data.payload.status === 200) {
            setLoader(false);
            toast.success(data.payload.data.msg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            getProtocolDetailsById(
              formData.protocol_id,
              protocolTypeDetails.researchType
            );
            handleNextTab(1);
          }
        });
      }
    } catch (error) {
      setLoader(false);

      console.log("error", error);

      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      console.log("error", { error, newErrors, formData });
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if (protocolInformation) {
      setFormData({
        first_time_protocol: protocolInformation?.first_time_protocol || "",
        protocol_title: protocolInformation?.protocol_title || "",
        protocol_number: protocolInformation?.protocol_number || "",
        sponsor: protocolInformation?.sponsor || "",
        study_duration: protocolInformation?.study_duration || "",
        funding_source: protocolInformation?.funding_source || "",
        disapproved_or_withdrawn:
          protocolInformation?.disapproved_or_withdrawn || "",
        disapproved_or_withdrawn_explain:
          protocolInformation?.disapproved_or_withdrawn_explain || "",
        oversite: protocolInformation?.oversite || "",
        oversite_explain: protocolInformation?.oversite_explain || "",
        protocol_id: protocolTypeDetails.protocolId,
        created_by: userDetails.id,
        protocol_file:
          protocolInformation?.documents?.map((doc) => ({
            name: doc.file_name,
            url: doc.file_url,
            type: doc.protocol_type,
            file_url: doc?.file_url,
          })) || [],
      });
      setShowAdditionalQuestion(
        protocolInformation?.first_time_protocol === "No"
      );
      setShowDisapproveAdditionTextArea(
        protocolInformation?.disapproved_or_withdrawn === "Yes"
      );
      setShowOversiteAdditionTextArea(protocolInformation?.oversite === "Yes");
    }
  }, [protocolInformation, protocolTypeDetails]);

  const { protocolDetailsById, loading, error } = useSelector((state) => ({
    error: state.admin.error,
    protocolDetailsById: state.admin.protocolDetailsById,
    loading: state.admin.loading,
  }));
  const getProtocolDetailsById = (protocolId, protocolType) => {
    let data = {
      protocolId: protocolId,
      protocolType: protocolType,
    };
    dispatch(fetchProtocolDetailsById(data));
  };

  const shouldShowSaveButton = () => {
    // allowEdit
    // waiveFee
    const waiseFeeStatus = Number(submissionFormDetails.waiveFee)
    const allowEdit = Number(submissionFormDetails.allowEdit)
    if (waiseFeeStatus === 1) {
      return true; // Always show for status 1
    } else if (waiseFeeStatus === 2) {
      return allowEdit === 2; // Show only if allowEdit is 2
    } else if (waiseFeeStatus === 3) {
      return allowEdit === 2; // Show only if allowEdit is 2
    } else if (waiseFeeStatus === 4) {
      return allowEdit === 2; // Show only if allowEdit is 2
    }
    return false; // Default case (if status is something else)
  };


  if (loader) {
    return <Loader />;
  }

  return (
    <Row>
      <ToastContainer position="top-right" autoClose={5000} />
      <form onSubmit={handleSubmitData} id="protocol_information">
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel>
              Are you submitting this protocol for the first time? *
            </FormLabel>
            <RadioGroup
              row
              name="first_time_protocol"
              value={formData.first_time_protocol}
              onChange={(event) =>
                handleRadioButtonSelectFirstTime(event, "first_time_protocol")
              }
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
          {errors.first_time_protocol && (
            <div className="error">{errors.first_time_protocol}</div>
          )}
        </Form.Group>

        {showAdditionalQuestion && (
          <>
            <Form.Group as={Col} controlId="validationFormik02">
              <FormControl>
                <FormLabel>
                  Has this study been disapproved or withdrawn from another IRB?
                </FormLabel>
                <RadioGroup
                  row
                  name="disapproved_or_withdrawn"
                  value={formData.disapproved_or_withdrawn}
                  onChange={(event) =>
                    handleRadioButtonSelectDisapproved(
                      event,
                      "disapproved_or_withdrawn"
                    )
                  }
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>

            {showDisapproveAdditionTextArea && (
              <Form.Group
                as={Col}
                controlId="validationFormik03"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Explain *"
                    name="disapproved_or_withdrawn_explain"
                    fullWidth
                    id="explain"
                    rows={3}
                    multiline
                    value={formData.disapproved_or_withdrawn_explain}
                    onChange={handleChange}
                  />
                </Box>
                {errors.disapproved_or_withdrawn_explain && (
                  <div className="error">
                    {errors.disapproved_or_withdrawn_explain}
                  </div>
                )}
              </Form.Group>
            )}

            <Form.Group as={Col} controlId="validationFormik04">
              <FormControl>
                <FormLabel>
                  Are you transferring oversight from another IRB?
                </FormLabel>
                <RadioGroup
                  row
                  name="oversite"
                  value={formData.oversite}
                  onChange={(event) =>
                    handleRadioButtonSelectOversite(event, "oversite")
                  }
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>

            {showOversiteAdditionTextArea && (
              <Form.Group
                as={Col}
                controlId="validationFormik05"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Explain *"
                    name="oversite_explain"
                    fullWidth
                    id="explain"
                    rows={3}
                    multiline
                    value={formData.oversite_explain}
                    onChange={handleChange}
                  />
                </Box>
                {errors.oversite_explain && (
                  <div className="error">{errors.oversite_explain}</div>
                )}
              </Form.Group>
            )}
          </>
        )}

        {/* Continue with other form fields */}
        <Form.Group
          as={Col}
          controlId="validationFormik06"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Title of Protocol *"
              id="protocol_title"
              name="protocol_title"
              value={formData.protocol_title}
              onChange={handleChange}
            />
          </Box>
          {errors.protocol_title && (
            <div className="error">{errors.protocol_title}</div>
          )}
        </Form.Group>

        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Protocol number *"
              id="protocol_number"
              name="protocol_number"
              value={formData.protocol_number}
              onChange={handleChange}
            />
          </Box>
          {errors.protocol_number && (
            <div className="error">{errors.protocol_number}</div>
          )}
        </Form.Group>

        <Form.Group
          as={Col}
          controlId="validationFormik08"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Sponsor *"
              id="sponsor"
              name="sponsor"
              value={formData.sponsor}
              onChange={handleChange}
            />
          </Box>
          {errors.sponsor && <div className="error">{errors.sponsor}</div>}
        </Form.Group>

        <Form.Group
          as={Col}
          controlId="validationFormik09"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Approximate duration of study *"
              id="study_duration"
              name="study_duration"
              value={formData.study_duration}
              onChange={handleChange}
            />
          </Box>
          {errors.study_duration && (
            <div className="error">{errors.study_duration}</div>
          )}
        </Form.Group>

        <Form.Group as={Col} controlId="validationFormik09">
          <FormControl fullWidth className="mt-mb-20">
            <InputLabel id="demo-simple-select-label">
              Funding source *
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Funding source"
              name="funding_source"
              value={formData.funding_source}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Self/Investigator-Sponsor/Internally Funded">
                Self/Investigator-Sponsor/Internally Funded
              </MenuItem>
              <MenuItem value="Industry">Industry</MenuItem>
              <MenuItem value="Non-profit organization">
                Non-profit organization
              </MenuItem>
              <MenuItem value="U.S. Federal Grant">U.S. Federal Grant</MenuItem>
              <MenuItem value="State or local Government">
                State or local Government
              </MenuItem>
              <MenuItem value="No funding">No funding</MenuItem>
            </Select>
            {errors.funding_source && (
              <div className="error">{errors.funding_source}</div>
            )}
          </FormControl>
        </Form.Group>

        {/* File upload section */}
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <InputLabel>Upload Protocol *</InputLabel>
            </Grid>
            <Grid item xs={10}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                color="secondary"
              >
                Upload file
                <VisuallyHiddenInput
                  type="file"
                  name="protocol_file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length) {
                      setFormData({
                        ...formData,
                        protocol_file: e.target.files,
                      });
                    }
                  }}
                />
              </Button>
              {errors.protocol_file && (
                <div className="error">{errors.protocol_file}</div>
              )}
              {formData.protocol_file &&
                Array.from(formData.protocol_file).map((file, i) => {
                  return file?.file_url ? <div>
                    <a
                      href={file.file_url}
                      target="_blank"
                      className="no_underline"
                    >
                      {file.name}
                    </a>
                  </div> : <div key={i}>{file?.name}</div>
                })}
            </Grid>
          </Grid>
        </Form.Group>

        {shouldShowSaveButton() && (
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
            style={{ textAlign: "right" }}
          >
            <Button variant="contained" color="primary" type="Submit">
              SAVE AND CONTINUE
            </Button>
          </Form.Group>
        )}
      </form>
    </Row>
  );
}

export default ProtocolInformationForm;
