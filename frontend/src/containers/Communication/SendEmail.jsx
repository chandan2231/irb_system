import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { saveEnquiry } from "../../services/Communication/CommunicationService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { uploadFile } from "../../services/UserManagement/UserService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const communicationSchema = yup.object().shape({
  subject: yup.string().required("This is required"),
  body: yup.string().required("This is required"),
});

function SendEmail({ protocolTypeDetails, enqueryUserType }) {
  const dispatch = useDispatch();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
    status: enqueryUserType === "user" ? 1 : 2,
    protocol_type: protocolTypeDetails.researchType,
    created_by_user_type: enqueryUserType === "user" ? "user" : "admin",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const getValidatedform = await communicationSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await communicationSchema.isValid(getValidatedform);
      if (isValid === true) {
        let attachments_file = [];
        for (let file of formData.attachments_file) {
          let id = await uploadFile(file, {
            protocolId: formData.protocol_id,
            createdBy: formData.created_by,
            createdByUserType: enqueryUserType === "user" ? "user" : "admin",
            protocolType: protocolTypeDetails.researchType,
            informationType: "communication_attachments",
            documentName: "communication_attachments",
          });
          attachments_file.push(id);
        }
        dispatch(saveEnquiry({ ...formData, attachments_file })).then(
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
              setErrors({});
            }
          }
        );
      }
    } catch (error) {
      console.log("error", error);
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
  return (
    <>
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
      <Row>
        <Box>
          <form onSubmit={handleSubmitData}>
            <Form.Group
              as={Col}
              controlId="validationFormik06"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Subject *"
                  id="subject"
                  name="subject"
                  value={formData.subject || ""}
                  onChange={handleChange}
                />
              </Box>
              {errors.subject && <div className="error">{errors.subject}</div>}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik03"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  variant="outlined"
                  placeholder="Type Your Message Here*"
                  name="body"
                  id="body"
                  fullWidth
                  rows={12}
                  multiline
                  onChange={handleChange}
                  value={formData.body}
                />
              </Box>
              {errors.body && <div className="error">{errors.body}</div>}
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
              <Button variant="contained" color="primary" type="Submit">
                SEND
              </Button>
            </Form.Group>
          </form>
        </Box>
      </Row>
    </>
  );
}

export default SendEmail;
