import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { createContactInformation } from "../../../../../services/ProtocolType/MultiSiteSponsorService";
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

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

const contactInfoSchema = yup.object().shape({
  name: yup.string().required("This is required"),
  title: yup.string().required("This is required"),
  company_name: yup.string().required("This is required"),
  address: yup.string().required("This is required"),
  city: yup.string().required("This is required"),
  state: yup.string().required("This is required"),
  zip_code: yup.string().required("This is required"),
  country: yup.string().required("This is required"),
  phone_number: yup.string().required("This is required"),
  email: yup.string().required("This is required"),
  secondary_contact_name: yup.string().required("This is required"),
  secondary_contact_title: yup.string().required("This is required"),
  secondary_contact_phone_number: yup.string().required("This is required"),
  secondary_contact_email: yup.string().required("This is required"),
});

function ContactInformationForm({
  protocolTypeDetails,
  contactInformation,
  type,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company_name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    phone_number: "",
    email: "",
    secondary_contact_name: "",
    secondary_contact_title: "",
    secondary_contact_phone_number: "",
    secondary_contact_email: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const getValidatedform = await contactInfoSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await contactInfoSchema.isValid(getValidatedform);
      console.log("formData", formData);
      if (isValid === true) {
        dispatch(createContactInformation(formData)).then((data) => {
          if (data.payload.status === 200) {
          } else {
          }
        });
      }
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };
  return (
    <Row>
      <form onSubmit={handleSubmitData}>
        <h4>Who is the primary point of contact for this study?</h4>
        <Form.Group
          as={Col}
          controlId="validationFormik06"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Name *"
              id="name"
              name="name"
              value={contactInformation?.name}
            />
          </Box>
          {errors.name && <div className="error">{errors.name}</div>}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Title *"
              id="title"
              name="title"
              value={contactInformation?.title}
            />
          </Box>
          {errors.title && <div className="error">{errors.title}</div>}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Company Name *"
              id="company_name"
              name="company_name"
              value={contactInformation?.company_name}
            />
          </Box>
          {errors.company_name && (
            <div className="error">{errors.company_name}</div>
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
              label="Address *"
              id="address"
              name="address"
              value={contactInformation?.address}
            />
          </Box>
          {errors.address && <div className="error">{errors.address}</div>}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="City *"
              id="city"
              name="city"
              value={contactInformation?.city}
            />
          </Box>
          {errors.city && <div className="error">{errors.city}</div>}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="State *"
              id="state"
              name="state"
              value={contactInformation?.state}
            />
          </Box>
          {errors.state && <div className="error">{errors.state}</div>}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Zip code *"
              id="zip_code"
              name="zip_code"
              value={contactInformation?.zip_code}
            />
          </Box>
          {errors.zip_code && <div className="error">{errors.zip_code}</div>}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Country *"
              id="country"
              name="country"
              value={contactInformation?.country}
            />
          </Box>
          {errors.country && <div className="error">{errors.country}</div>}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Phone Number *"
              id="phone_number"
              name="phone_number"
              value={contactInformation?.phone_number}
            />
          </Box>
          {errors.phone_number && (
            <div className="error">{errors.phone_number}</div>
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
              label="Email *"
              id="email"
              name="email"
              value={contactInformation?.email}
            />
          </Box>
          {errors.email && <div className="error">{errors.email}</div>}
        </Form.Group>
        <h4>Who is the secondary point of contact for this study?</h4>
        <Form.Group
          as={Col}
          controlId="validationFormik06"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Name *"
              id="secondary_contact_name"
              name="secondary_contact_name"
              value={contactInformation?.secondary_contact_name}
            />
          </Box>
          {errors.secondary_contact_name && (
            <div className="error">{errors.name}</div>
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
              label="Title *"
              id="secondary_contact_title"
              name="secondary_contact_title"
              value={contactInformation?.secondary_contact_title}
            />
          </Box>
          {errors.secondary_contact_title && (
            <div className="error">{errors.secondary_contact_title}</div>
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
              label="Phone Number *"
              id="secondary_contact_phone_number"
              name="secondary_contact_phone_number"
              value={contactInformation?.secondary_contact_phone_number}
            />
          </Box>
          {errors.secondary_contact_phone_number && (
            <div className="error">{errors.secondary_contact_phone_number}</div>
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
              label="Email *"
              id="secondary_contact_email"
              name="secondary_contact_email"
              value={contactInformation?.secondary_contact_email}
            />
          </Box>
          {errors.secondary_contact_email && (
            <div className="error">{errors.secondary_contact_email}</div>
          )}
        </Form.Group>

        {type !== "member" && (
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
            style={{ textAlign: "right" }}
          >
            {/* <Button
                variant="contained"
                color="primary"
                type="Submit"
              >
                SAVE AND CONTINUE
              </Button> */}
          </Form.Group>
        )}
      </form>
    </Row>
  );
}

export default ContactInformationForm;
