import React from "react";
import Loader from "../../components/Loader";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { Box, MenuItem, Select, FormControl } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import CONSTANTS from "../../utility/Constants";
import { uploadDocument } from "../../services/UploadDocumen/UploadSocument";

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

const UploadDocument = () => {
  const navigate = useNavigate();
  const { protocolId, researchType } = useParams();
  const [errors, setErrors] = React.useState({});
  const [loader, setLoader] = React.useState(false);
  const [formData, setFormData] = React.useState({
    subject: "",
    attachments_file: null,
  });
  const [subjectOptions, setSubjectOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchSubjectOptions = () => {
      try {
        setLoader(true);
        const response =
          CONSTANTS.getDropDownOptionsByResearchType(researchType);
        console.log("response", response);
        setSubjectOptions(response);
      } catch (error) {
        toast.error("Failed to fetch subject options");
      } finally {
        setLoader(false);
      }
    };

    fetchSubjectOptions();
  }, [researchType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancelReplyButtonClicked = () => {
    navigate("/dashboard");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.attachments_file || formData.attachments_file.length === 0) {
      newErrors.attachments_file = "At least one attachment is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setLoader(true);
      // API CALL
      await uploadDocument(formData);
      toast.success("Form submitted successfully");
    } catch (error) {
      toast.error("Failed to submit form");
    } finally {
      setLoader(false);
    }
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <React.Fragment>
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
      <Box sx={{ width: "100%" }}>
        <h2 className="ml-20">
          {protocolId}&nbsp;({researchType})
        </h2>
      </Box>
      <Row>
        <Box>
          <form onSubmit={handleSubmitData}>
            <Form.Group
              as={Col}
              controlId="validationFormik06"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="subject-label">Subject</InputLabel>
                  <Select
                    labelId="subject-label"
                    id="subject"
                    name="subject"
                    value={formData.subject || ""}
                    onChange={handleChange}
                  >
                    {subjectOptions.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.subject && (
                  <div className="error">{errors.subject}</div>
                )}
              </Box>
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik010"
              className="mt-mb-20"
            >
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <InputLabel>Upload Attachment</InputLabel>
                </Grid>
                <Grid item xs={10}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      name="attachments_file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length) {
                          setFormData({
                            ...formData,
                            attachments_file: e.target.files,
                          });
                        }
                      }}
                      multiple
                    />
                  </Button>
                  {errors.attachments_file && (
                    <div className="error">{errors.attachments_file}</div>
                  )}
                  {formData.attachments_file &&
                    Array.from(formData.attachments_file).map((file, i) => (
                      <div key={i}>{file.name}</div>
                    ))}
                </Grid>
              </Grid>
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik010"
              className="mt-mb-20"
              style={{ textAlign: "right" }}
            >
              <Button
                variant="outlined"
                color="error"
                type="button"
                onClick={handleCancelReplyButtonClicked}
                sx={{ mr: 2 }}
              >
                CANCEL
              </Button>
              <Button variant="contained" color="primary" type="Submit">
                SUBMIT
              </Button>
            </Form.Group>
          </form>
        </Box>
      </Row>
    </React.Fragment>
  );
};

export default UploadDocument;
