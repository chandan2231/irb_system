import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { createContactInformation } from "../../../../services/ProtocolType/MultiSiteSponsorService";
import { useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../../components/Loader";
import { useSelector } from "react-redux";
import { fetchProtocolDetailsById } from "../../../../services/Admin/ProtocolListService";

import { CustomMUITextFieldWrapper as TextField } from "../../../../components/Mui/CustomTextField";
import { CustomMUIFormLabel as FormLabel } from "../../../../components/Mui/CustomFormLabel";
import { CustomInputLabel as InputLabel } from "../../../../components/Mui/CustomInputLabel";

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
  handleNextTab,
  submissionForm = {},
}) {
  const [loader, setLoader] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [submissionFormDetails, setSubmissionFormDetails] = useState({
    waiveFee: submissionForm?.waive_fee,
    allowEdit: submissionForm?.allow_edit,
  });

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
    protocol_id: protocolTypeDetails?.protocolId || "",
    created_by: userDetails?.id || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    setLoader(true);
    e.preventDefault();
    try {
      const getValidatedform = await contactInfoSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await contactInfoSchema.isValid(getValidatedform);
      if (isValid === true) {
        dispatch(createContactInformation(formData)).then((data) => {
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
            handleNextTab(2);
          }
        });
      }
    } catch (error) {
      setLoader(false);

      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  // UseEffect to populate the formData
  useEffect(() => {
    if (contactInformation) {
      setFormData({
        name: contactInformation?.name || "",
        title: contactInformation?.title || "",
        company_name: contactInformation?.company_name || "",
        address: contactInformation?.address || "",
        city: contactInformation?.city || "",
        state: contactInformation?.state || "",
        zip_code: contactInformation?.zip_code || "",
        country: contactInformation?.country || "",
        phone_number: contactInformation?.phone_number || "",
        email: contactInformation?.email || "",
        secondary_contact_name:
          contactInformation?.secondary_contact_name || "",
        secondary_contact_title:
          contactInformation?.secondary_contact_title || "",
        secondary_contact_phone_number:
          contactInformation?.secondary_contact_phone_number || "",
        secondary_contact_email:
          contactInformation?.secondary_contact_email || "",
        protocol_id: protocolTypeDetails?.protocolId || "",
        created_by: userDetails?.id || "",
      });
    }
  }, [contactInformation, protocolTypeDetails]);

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

  console.log(submissionFormDetails)

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
                value={formData.name}
                onChange={handleChange}
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
                value={formData.title}
                onChange={handleChange}
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
                value={formData.company_name}
                onChange={handleChange}
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
                value={formData.address}
                onChange={handleChange}
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
                value={formData.city}
                onChange={handleChange}
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
                value={formData.state}
                onChange={handleChange}
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
                value={formData.zip_code}
                onChange={handleChange}
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
                value={formData.country}
                onChange={handleChange}
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
                value={formData.phone_number}
                onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
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
                value={formData.secondary_contact_name}
                onChange={handleChange}
              />
            </Box>
            {errors.secondary_contact_name && (
              <div className="error">{errors.secondary_contact_name}</div>
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
                value={formData.secondary_contact_title}
                onChange={handleChange}
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
                value={formData.secondary_contact_phone_number}
                onChange={handleChange}
              />
            </Box>
            {errors.secondary_contact_phone_number && (
              <div className="error">
                {errors.secondary_contact_phone_number}
              </div>
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
                value={formData.secondary_contact_email}
                onChange={handleChange}
              />
            </Box>
            {errors.secondary_contact_email && (
              <div className="error">{errors.secondary_contact_email}</div>
            )}
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
    </>
  );
}

export default ContactInformationForm;
