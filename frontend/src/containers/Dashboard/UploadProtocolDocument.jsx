import React, { useEffect } from "react";
import Loader from "../../components/Loader";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CONSTANTS from "../../utility/Constants";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { uploadFile } from "../../services/UserManagement/UserService";

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
  const userDetails = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = React.useState({});
  const [loader, setLoader] = React.useState(false);
  const [formData, setFormData] = React.useState({
    subject: "",
    attachments_file: [],
    created_by: userDetails.id,
  });
  const [subjectOptions, setSubjectOptions] = React.useState([]);
  const [protocolDetails, setProtocolDetails] = React.useState({});
  const [isUploadMandatory, setIsUploadMandatory] = React.useState(true);
  const [uploadDocumentKey, setUploadDocumentKey] = React.useState(null);

  React.useEffect(() => {
    const fetchSubjectOptions = () => {
      const protocolTypeDetails = location?.state?.details || {};
      const { researchType } = protocolTypeDetails;
      setProtocolDetails(protocolTypeDetails);
      try {
        setLoader(true);
        const response = CONSTANTS.getDropDownOptionsByResearchType(
          researchType
        ).filter((source) => source.isUploadMandatory === true);
        setSubjectOptions(response);
      } catch (error) {
        toast.error("Failed to fetch subject options");
      } finally {
        setLoader(false);
      }
    };

    fetchSubjectOptions();
  }, []);

  const handleChange = (e) => {
    const selectedValue = e.target.value;

    const selectedSource = subjectOptions.find(
      (source) => source.value === selectedValue
    );

    if (!selectedSource) {
      return toast.error("Invalid source selected");
    }

    const updatedFormData = { ...formData, subject: selectedValue };
    if (selectedSource.isUploadMandatory === false) {
      updatedFormData.attachments_file = [];
    } else {
      updatedFormData.attachments_file = formData.attachments_file;
    }

    setFormData({ ...updatedFormData });
    setUploadDocumentKey(selectedSource.uploadDocumentKey);
    setIsUploadMandatory(selectedSource.isUploadMandatory);
  };

  const handleCancelReplyButtonClicked = () => {
    navigate("/dashboard");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject) {
      newErrors.subject = "Category is required";
    }
    if (
      isUploadMandatory &&
      (!formData.attachments_file || formData.attachments_file.length === 0)
    ) {
      newErrors.attachments_file = "Please upload a file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoader(true);
      await uploadFilesIfNeeded();
      setFormData({
        subject: "",
        attachments_file: [],
        created_by: userDetails.id,
      });
      toast.success("Form submitted successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    } finally {
      setFormData({
        subject: "",
        attachments_file: [],
        created_by: userDetails.id,
      });
      setLoader(false);
    }
  };

  // Helper function to handle file uploads
  const uploadFilesIfNeeded = async () => {
    if (formData.attachments_file && formData.attachments_file.length > 0) {
      const uploadPromises = Array.from(formData.attachments_file).map((file) =>
        uploadFile(file, {
          protocolId: protocolDetails.protocolId,
          protocolType: protocolDetails.researchType,
          informationType: formData.subject,
          documentName: uploadDocumentKey,
          createdBy: userDetails.id,
        })
      );

      // Wait for all files to upload
      await Promise.all(uploadPromises);
    }
  };

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

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
        <h2 className="ml-20">Upload Document</h2>
        <h3 className="ml-20">
          {protocolDetails?.protocolId || ""}&nbsp;(
          {protocolDetails?.researchType || ""})
        </h3>
        <Box
          className="ml-20"
          sx={{
            marginRight: "20px",
          }}
        >
          <form onSubmit={handleSubmitData}>
            <Form.Group
              as={Col}
              controlId="validationFormik06"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <FormControl sx={{ minWidth: "100%" }} className="mt-mb-20">
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Select Category *
                  </InputLabel>
                  <Select
                    autoWidth
                    label="Select Category"
                    name="subject"
                    value={formData.subject || ""}
                    onChange={(e) => handleChange(e)}
                  >
                    {subjectOptions.map((source, index) => {
                      return (
                        <MenuItem key={index} value={source.value}>
                          {source.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {errors.subject && (
                  <div className="error">{errors.subject}</div>
                )}
              </Box>
            </Form.Group>
            {isUploadMandatory === true ? (
              <Form.Group
                as={Col}
                controlId="validationFormik010"
                className="mt-mb-20"
              >
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <InputLabel>Upload Document</InputLabel>
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
            ) : null}
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
      </Box>
    </React.Fragment>
  );
};

export default UploadDocument;
