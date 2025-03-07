import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Form from "react-bootstrap/Form";
import InputLabel from "@mui/material/InputLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import {
  createProtocolAmendmentRequest,
  fetchEventAndRequestById,
} from "../../services/EventAndRequest/EventAndRequestService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { uploadFile } from "../../services/UserManagement/UserService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomMUIFormLabel as FormLabel } from "../../components/Mui/CustomFormLabel";
import { CustomMUITextFieldWrapper as TextField } from "../../components/Mui/CustomTextField";

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

const protocoalAmendmentSchema = yup.object().shape({
  protocol_number: yup.string().required("This is required"),
  describe_change_request: yup.string().required("This is required"),
  describe_reasoning: yup.string().required("This is required"),
  person_name: yup.string().required("This is required"),
  email: yup.string().required("This is required"),
  phone: yup.string().required("This is required"),
  your_name: yup.string().required("This is required"),
});

function ProtocolAmendmentRequestDetails() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const protocolDetails = location.state.details;
  console.log("protocolDetails", protocolDetails);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [showAdditionalQuestionAmendType, setShowAdditionalQuestionAmendType] =
    React.useState(false);
  const [explainEnrolledTypeErrors, setExplainAmendDocumentErrors] =
    React.useState();
  const [formData, setFormData] = useState({
    protocol_number: "",
    amend_document: "",
    amend_document_explain: "",
    describe_change_request: "",
    describe_reasoning: "",
    person_name: "",
    email: "",
    phone: "",
    your_name: "",
    protocol_id: protocolDetails.protocolId,
    created_by: userDetails.id,
    protocol_type: protocolDetails.researchType,
  });
  const [errors, setErrors] = useState({});

  const handleAmendDocumentChecked = (event) => {
    const { value, checked } = event.target;
    if (checked === true && value === "4") {
      setShowAdditionalQuestionAmendType(true);
    } else if (checked === false && value === "4") {
      setShowAdditionalQuestionAmendType(false);
    }
    let amendDocTypeChecked = [...formData.amend_document];
    if (checked) {
      amendDocTypeChecked.push(value);
    } else {
      amendDocTypeChecked = amendDocTypeChecked.filter(
        (item) => item !== value
      );
    }
    setFormData({ ...formData, amend_document: amendDocTypeChecked });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      if (
        formData.amend_document.includes("4") &&
        formData.amend_document_explain === ""
      ) {
        setExplainAmendDocumentErrors("This is required");
        return;
      } else {
        setExplainAmendDocumentErrors("");
      }
      const getValidatedform = await protocoalAmendmentSchema.validate(
        formData,
        { abortEarly: false }
      );
      const isValid = await protocoalAmendmentSchema.isValid(getValidatedform);
      // const isValid = true
      if (isValid === true) {
        let redlined_document = [];
        if (!formData.redlined_document) {
          return setErrors({
            ...errors,
            ["redlined_document"]: "This is required",
          });
        } else {
          for (let file of formData.redlined_document) {
            let id = await uploadFile(file, {
              protocolId: formData.protocol_id,
              protocolType: "Protocol Amendment Request",
              informationType: "protocol_amendment",
              documentName: "redlined document",
              createdBy: formData.created_by,
            });
            redlined_document.push(id);
          }
        }
        dispatch(createProtocolAmendmentRequest({ ...formData })).then(
          (data) => {
            if (data.payload.status === 200) {
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
              setFormData({});
            } else {
              toast.error(data.payload.data.msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            }
          }
        );
      }
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        const firstErrorField = document.querySelector(
          `[name="${Object.keys(newErrors)[0]}"]`
        );
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  };

  React.useEffect(() => {
    let data = {
      protocol_id: protocolDetails.protocolId,
      type: "amendment",
    };
    dispatch(fetchEventAndRequestById(data));
  }, [dispatch, userDetails.id]);

  const { protocolAmendmentDetails, loading, error } = useSelector((state) => ({
    error: state.eventAndRequest.error,
    protocolAmendmentDetails: state.eventAndRequest.eventAndRequestDetails,
    loading: state.eventAndRequest.loading,
  }));

  console.log("protocolAmendmentDetails", protocolAmendmentDetails);
  return (
    <Box sx={{ width: "100%" }} style={{ padding: "1rem" }}>
      <h2 className="ml-20">
        Protocol Amendment Request Details ({protocolDetails.protocolId})
      </h2>
      <Box
        sx={{
          border: "1px solid #d3d3d3",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on smaller screens
          gap: 1,
          justifyContent: { xs: "center", sm: "flex-start" }, // Center on small screens
          flexWrap: "wrap", // Allow wrapping for smaller screens
          margin: { xs: "0 8px", sm: "0 24px", md: "0 24px" },
          overflow: "hidden", // Prevent any overflow from buttons
        }}
      >
        <Box
          sx={{
            padding: "25px",
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <form onSubmit={handleSubmitData} id="protocol_information">
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
                  onChange={handleChange}
                  value={formData.protocol_number}
                />
              </Box>
              {errors.protocol_number && (
                <div className="error">{errors.protocol_number}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik01">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  What documents are you wanting to modify or amend?
                </FormLabel>
                <FormGroup
                  onChange={(event) => handleAmendDocumentChecked(event)}
                  name="amend_document"
                >
                  <FormControlLabel
                    control={<Checkbox />}
                    value="1"
                    label="Protocol"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    value="2"
                    label="Consent form"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    value="3"
                    label="Subject facing material"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    value="4"
                    label="Other"
                  />
                </FormGroup>
              </FormControl>
            </Form.Group>
            {showAdditionalQuestionAmendType === true && (
              <Form.Group
                as={Col}
                controlId="validationFormik03"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Explain *"
                    fullWidth
                    id="amend_document_explain"
                    name="amend_document_explain"
                    rows={3}
                    multiline
                    onChange={handleChange}
                  />
                </Box>
                {explainEnrolledTypeErrors && (
                  <div className="error">{explainEnrolledTypeErrors}</div>
                )}
              </Form.Group>
            )}

            <Box sx={{ flexGrow: 1 }}>
              <Form.Group
                as={Col}
                controlId="validationFormik010"
                className="mt-mb-20"
              >
                <InputLabel id="demo-simple-select-autowidth-label">
                  Upload redlined document(s) here *
                </InputLabel>
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
                    name="redlined_document"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length) {
                        setFormData({
                          ...formData,
                          redlined_document: e.target.files,
                        });
                      }
                    }}
                  />
                </Button>
                {errors.redlined_document && (
                  <div className="error">{errors.redlined_document}</div>
                )}
                {formData?.redlined_document !== undefined &&
                  Array.from(formData?.redlined_document).map((file, i) => (
                    <div key={i}>{file?.name}</div>
                  ))}
                <div className="highlight-text">
                  Please note: Documents must be in WORD version showing “track
                  changes”{" "}
                </div>
              </Form.Group>
              <h3>Summary of changes:</h3>
              <Form.Group
                as={Col}
                controlId="validationFormik03"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Use the text box below to describe the changes requested in
                    full detail *
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    placeholder="Explain"
                    name="describe_change_request"
                    fullWidth
                    id="describe_change_request"
                    rows={5}
                    multiline
                    onChange={handleChange}
                    value={formData.describe_change_request}
                  />
                </Box>
                {errors.describe_change_request && (
                  <div className="error">{errors.describe_change_request}</div>
                )}
              </Form.Group>
              <h3>Rationale for changes:</h3>
              <Form.Group
                as={Col}
                controlId="validationFormik03"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Use the text box below to describe the reasoning for each of
                    the changes requested *
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    placeholder="Explain"
                    name="describe_reasoning"
                    fullWidth
                    id="describe_reasoning"
                    rows={5}
                    multiline
                    onChange={handleChange}
                    value={formData.describe_reasoning}
                  />
                </Box>
                {errors.describe_reasoning && (
                  <div className="error">{errors.describe_reasoning}</div>
                )}
              </Form.Group>
            </Box>
            <Form.Group
              as={Col}
              controlId="validationFormik08"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Person submitting this form *"
                  id="person_name"
                  name="person_name"
                  onChange={handleChange}
                  value={formData.person_name}
                />
              </Box>
              {errors.person_name && (
                <div className="error">{errors.person_name}</div>
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
                  label="Email *"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </Box>
              {errors.email && <div className="error">{errors.email}</div>}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik08"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Phone *"
                  id="phone"
                  name="phone"
                  onChange={handleChange}
                  value={formData.phone}
                />
              </Box>
              {errors.phone && <div className="error">{errors.phone}</div>}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik06"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Type Name (Electronic Signature) *"
                  id="your_name"
                  name="your_name"
                  onChange={handleChange}
                  value={formData.your_name}
                />
              </Box>
              <div className="highlight-text">
                Note: Your name above is the equivalent of a hand-written
                signature and is legally binding. Your signature confirms that
                you are authorized to submit this document and you acknowledge
                that it is accurate.
              </div>
              {errors.your_name && (
                <div className="error">{errors.your_name}</div>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik010"
              className="mt-mb-20"
              style={{ textAlign: "right" }}
            >
              <Button variant="contained" color="primary" type="Submit">
                SUBMIT
              </Button>
            </Form.Group>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default ProtocolAmendmentRequestDetails;
