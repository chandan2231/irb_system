import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { createInvestigatorInformation } from "../../../../services/ProtocolType/ContractorResearcherService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { uploadFile } from "../../../../services/UserManagement/UserService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../../components/Loader";
import { fetchProtocolDetailsById } from "../../../../services/Admin/ProtocolListService";
import { CustomMUITextFieldWrapper as TextField } from "../../../../components/Mui/CustomTextField";
import { CustomMUIFormLabel as FormLabel } from "../../../../components/Mui/CustomFormLabel";
import { CustomInputLabel as InputLabel } from "../../../../components/Mui/CustomInputLabel";
import { CustomFileUploadWrapper } from "../../../../components/Mui/CustomFileInput";

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
const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const investigatorInfoSchema = yup.object().shape({
  investigator_name: yup.string().required("This is required"),
  investigator_email: yup
    .string()
    .email("Invalid email format")
    .required("This is required"),
  fda_audit_explain: yup.string().when("fda_audit", {
    is: (value) => value === "Yes",
    then: () => yup.string().required("This is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  training_completed_explain: yup.string().when("training_completed", {
    is: (value) => value.includes("8"),
    then: () => yup.string().required("This is required"),
  }),
  investigator_research_number: yup
    .number()
    .positive("The number must be positive")
    .typeError("This must be a number")
    .integer("The number must be an integer")
    .required("This is required"),
  pending_or_active_research_explain: yup
    .string()
    .when("pending_or_active_research", {
      is: (value) => value === "Yes",
      then: () => yup.string().required("This is required"),
      otherwise: () => yup.string().nullable(),
    }),
  fwa_number: yup.string().when("site_fwp", {
    is: (value) => value === "Yes",
    then: () => yup.string().required("This is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  cv_files: yup.mixed().test("fileType", "This is required", (value) => {
    if (value.length === 0) {
      return false;
    }
    return true;
  }),
  medical_license: yup.mixed(),
  training_certificates: yup.mixed(),
});

function InvestigatorInformationForm({
  protocolTypeDetails,
  investigatorInformation,
  handleNextTab,
  submissionForm = {}
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [showAdditionalQuestion, setShowAdditionalQuestion] =
    React.useState(false);
  const [
    showAdditionalQuestionPendingOrActive,
    setShowAdditionalQuestionPendingOrActive,
  ] = React.useState(false);
  const [showAdditionalQuestionSiteFWP, setShowAdditionalQuestionSiteFWP] =
    React.useState(false);
  const [otherQuestionSelection, setOtherQuestionSelection] =
    React.useState("");
  const [showOtherQuestion, setShowOtherQuestion] = React.useState(false);
  const [formData, setFormData] = useState({
    investigator_name: investigatorInformation?.investigator_name || "",
    investigator_email: investigatorInformation?.investigator_email || "",
    sub_investigator_name: investigatorInformation?.sub_investigator_name || "",
    sub_investigator_email:
      investigatorInformation?.sub_investigator_email || "",
    primary_contact: investigatorInformation?.primary_contact || "",
    primary_contact_email: investigatorInformation?.primary_contact_email || "",
    fda_audit: investigatorInformation?.fda_audit || "",
    fda_audit_explain: investigatorInformation?.fda_audit_explain || "",
    involved_years: investigatorInformation?.involved_years || "",
    investigators_npi: investigatorInformation?.investigators_npi || "",
    training_completed: investigatorInformation?.training_completed || "",
    training_completed_explain:
      investigatorInformation?.training_completed_explain || "",
    investigator_research_number:
      investigatorInformation?.investigator_research_number || "",
    pending_or_active_research:
      investigatorInformation?.pending_or_active_research || "",
    pending_or_active_research_explain:
      investigatorInformation?.pending_or_active_research_explain || "",
    site_fwp: investigatorInformation?.site_fwp || "",
    fwa_number: investigatorInformation?.fwa_number || "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
    cv_files:
      investigatorInformation?.documents
        ?.filter((doc) => doc.document_name === "investigator_cv")
        ?.map((doc) => ({
          name: doc.file_name,
          type: doc.protocol_type,
          file_url: doc?.file_url
        })) || [],
    medical_license:
      investigatorInformation?.documents
        ?.filter((doc) => doc.document_name === "medical_license")
        ?.map((doc) => ({
          name: doc.file_name,
          type: doc.protocol_type,
          file_url: doc?.file_url
        })) || [],
    training_certificates:
      investigatorInformation?.documents
        ?.filter((doc) => doc.document_name === "training_certificates")
        ?.map((doc) => ({
          name: doc.file_name,
          type: doc.protocol_type,
          file_url: doc?.file_url
        })) || [],
  });

  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(false);
  const [submissionFormDetails, setSubmissionFormDetails] = useState({
    waiveFee: submissionForm?.waive_fee,
    allowEdit: submissionForm?.allow_edit,
  });

  useEffect(() => {
    if (investigatorInformation) {
      setFormData({
        investigator_name: investigatorInformation.investigator_name || "",
        investigator_email: investigatorInformation.investigator_email || "",
        sub_investigator_name:
          investigatorInformation.sub_investigator_name || "",
        sub_investigator_email:
          investigatorInformation.sub_investigator_email || "",
        primary_contact: investigatorInformation.primary_contact || "",
        primary_contact_email:
          investigatorInformation.primary_contact_email || "",
        fda_audit: investigatorInformation.fda_audit || "",
        fda_audit_explain: investigatorInformation.fda_audit_explain || "",
        involved_years: investigatorInformation.involved_years || "",
        investigators_npi: investigatorInformation.investigators_npi || "",
        training_completed: investigatorInformation.training_completed || "",
        training_completed_explain:
          investigatorInformation.training_completed_explain || "",
        investigator_research_number:
          investigatorInformation.investigator_research_number || "",
        pending_or_active_research:
          investigatorInformation.pending_or_active_research || "",
        pending_or_active_research_explain:
          investigatorInformation.pending_or_active_research_explain || "",
        site_fwp: investigatorInformation.site_fwp || "",
        fwa_number: investigatorInformation.fwa_number || "",
        protocol_id: protocolTypeDetails.protocolId,
        created_by: userDetails.id,
        cv_files:
          investigatorInformation?.documents
            ?.filter((doc) => doc.document_name === "investigator_cv")
            ?.map((doc) => ({
              name: doc.file_name,
              type: doc.protocol_type,
              file_url: doc?.file_url
            })) || [],
        medical_license:
          investigatorInformation?.documents
            ?.filter((doc) => doc.document_name === "medical_license")
            ?.map((doc) => ({
              name: doc.file_name,
              type: doc.protocol_type,
              file_url: doc?.file_url
            })) || [],
        training_certificates:
          investigatorInformation?.documents
            ?.filter((doc) => doc.document_name === "training_certificates")
            ?.map((doc) => ({
              name: doc.file_name,
              type: doc.protocol_type,
              file_url: doc?.file_url
            })) || [],
      });
      setShowAdditionalQuestion(
        investigatorInformation.fda_audit === "Yes" ? true : false
      );
      setShowAdditionalQuestionPendingOrActive(
        investigatorInformation.pending_or_active_research === "Yes"
          ? true
          : false
      );
      setShowAdditionalQuestionSiteFWP(
        investigatorInformation.site_fwp === "Yes" ? true : false
      );
      setShowOtherQuestion(
        investigatorInformation?.training_completed?.includes("8")
          ? true
          : false
      );
      setOtherQuestionSelection(
        investigatorInformation?.training_completed?.includes("8") ? "8" : ""
      );
    }
  }, [investigatorInformation, protocolTypeDetails]);

  const handleRadioButtonFdaAudit = (event, radio_name) => {
    if (radio_name === "fda_audit" && event.target.value === "Yes") {
      setShowAdditionalQuestion(true);
    } else if (radio_name === "fda_audit" && event.target.value === "No") {
      setShowAdditionalQuestion(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePendingOrInactiveresearch = (event, radio_name) => {
    if (
      radio_name === "pending_or_active_research" &&
      event.target.value === "Yes"
    ) {
      setShowAdditionalQuestionPendingOrActive(true);
    } else if (
      radio_name === "pending_or_active_research" &&
      event.target.value === "No"
    ) {
      setShowAdditionalQuestionPendingOrActive(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSiteFWP = (event, radio_name) => {
    if (radio_name === "site_fwp" && event.target.value === "Yes") {
      setShowAdditionalQuestionSiteFWP(true);
    } else if (radio_name === "site_fwp" && event.target.value === "No") {
      setShowAdditionalQuestionSiteFWP(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInvestigatorsInvolvedYears = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTrainingCompletedChecked = (event) => {
    const { value, checked } = event.target;
    if (checked === true && value === "8") {
      setShowOtherQuestion(true);
      setOtherQuestionSelection(8);
    } else if (checked === false && value === "8") {
      setShowOtherQuestion(false);
      setOtherQuestionSelection("");
    }
    let updatedTrainingCompleted = [...formData.training_completed];
    if (checked) {
      updatedTrainingCompleted.push(value);
    } else {
      updatedTrainingCompleted = updatedTrainingCompleted.filter(
        (training) => training !== value
      );
    }
    const updatedTrainingCompletedString = updatedTrainingCompleted.join(",");
    const removeEmptyString = updatedTrainingCompletedString
      .split(",")
      .filter((item) => item !== "")
      .join(",");
    setFormData({
      ...formData,
      training_completed: removeEmptyString,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    setLoader(true);
    e.preventDefault();
    try {
      const getValidatedform = await investigatorInfoSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await investigatorInfoSchema.isValid(getValidatedform);
      console.log("formData", formData);
      console.log("isValid", isValid);
      if (isValid === true) {
        let cv_files = [];
        let medical_license = [];
        let training_certificates = [];
        if (!formData.cv_files) {
          return setErrors({ ...errors, ["cv_files"]: "This is required" });
        } else {
          for (let file of formData.cv_files) {
            let id = await uploadFile(file, {
              protocolId: formData.protocol_id,
              createdBy: formData.created_by,
              protocolType: protocolTypeDetails.researchType,
              informationType: "investigator_information",
              documentName: "investigator_cv",
            });
            cv_files.push(id);
          }
          if (formData.medical_license) {
            for (let file of formData.medical_license) {
              let id = await uploadFile(file, {
                protocolId: formData.protocol_id,
                createdBy: formData.created_by,
                protocolType: protocolTypeDetails.researchType,
                informationType: "investigator_information",
                documentName: "medical_license",
              });
              medical_license.push(id);
            }
          }
          if (formData.training_certificates) {
            for (let file of formData.training_certificates) {
              let id = await uploadFile(file, {
                protocolId: formData.protocol_id,
                createdBy: formData.created_by,
                protocolType: protocolTypeDetails.researchType,
                informationType: "investigator_information",
                documentName: "training_certificates",
              });
              training_certificates.push(id);
            }
          }
        }
        dispatch(
          createInvestigatorInformation({
            ...formData,
            cv_files,
            medical_license,
            training_certificates,
          })
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

  console.log("investigatorInformationFormData", {
    formData,
    errors,
    investigatorInformation,
  });

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
          <Form.Group
            as={Col}
            controlId="validationFormik06"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Investigator Name *"
                id="investigator_name"
                name="investigator_name"
                value={formData.investigator_name || ""}
                onChange={handleChange}


              />
            </Box>
            {errors.investigator_name && (
              <div className="error">{errors.investigator_name}</div>
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
                label="Investigator Email *"
                id="investigator_email"
                name="investigator_email"
                value={formData.investigator_email || ""}
                onChange={handleChange}


              />
            </Box>
            {errors.investigator_email && (
              <div className="error">{errors.investigator_email}</div>
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
                label="Sub-Investigator Name"
                id="sub_investigator_name"
                name="sub_investigator_name"
                value={formData.sub_investigator_name || ""}
                onChange={handleChange}
              />
            </Box>
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik07"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Sub-Investigator Email"
                id="sub_investigator_email"
                name="sub_investigator_email"
                value={formData.sub_investigator_email || ""}
                onChange={handleChange}
              />
            </Box>
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik07"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Primary point of contact if different from above"
                id="primary_contact"
                name="primary_contact"
                value={formData.primary_contact || ""}
                onChange={handleChange}
              />
            </Box>
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik07"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Primary point of contact email address"
                id="primary_contact_email"
                name="primary_contact_email"
                value={formData.primary_contact_email || ""}
                onChange={handleChange}
              />
            </Box>
            {errors.primary_contact_email && (
              <div className="error">{errors.primary_contact_email}</div>
            )}
          </Form.Group>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Has the investigator ever had an FDA audit?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="fda_audit"
                value={formData.fda_audit || ""}
                onChange={(event) =>
                  handleRadioButtonFdaAudit(event, "fda_audit")
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showAdditionalQuestion === true && (
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
                  name="fda_audit_explain"
                  id="fda_audit_explain"
                  value={formData.fda_audit_explain || ""}
                  rows={3}
                  multiline
                  onChange={handleChange}


                />
              </Box>
              {errors.fda_audit_explain && (
                <div className="error">{errors.fda_audit_explain}</div>
              )}
            </Form.Group>
          )}

          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                How long has the investigator been involved in research?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="involved_years"
                value={formData.involved_years || ""}
                onChange={(event) =>
                  handleInvestigatorsInvolvedYears(event, "involved_years")
                }
              >
                <FormControlLabel
                  value="New to research-1 year"
                  control={<Radio />}
                  label="New to research-&lt;1 year"
                />
                <FormControlLabel
                  value="1-5 years"
                  control={<Radio />}
                  label="1-5 years"
                />
                <FormControlLabel
                  value="6 years or more"
                  control={<Radio />}
                  label="6 years or more"
                />
              </RadioGroup>
            </FormControl>
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="validationFormik08"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="What is the investigator's NPI if applicable"
                id="investigators_npi"
                name="investigators_npi"
                value={formData.investigators_npi || ""}
                onChange={handleChange}
              />
            </Box>
          </Form.Group>

          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                What training in the field of human subjects protection has the
                investigator completed?
              </FormLabel>
              <FormGroup
                onChange={(event) => handleTrainingCompletedChecked(event)}
                name="training_completed"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.training_completed.includes("1")}
                    />
                  }
                  label="OHRP Human Subject Assurance Training"
                  value="1"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.training_completed.includes("2")}
                    />
                  }
                  label="CITI Program Training"
                  value="2"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.training_completed.includes("3")}
                    />
                  }
                  label="Certified Physician Investigator Training"
                  value="3"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.training_completed.includes("4")}
                    />
                  }
                  label="ACRP training (CCRC, CCRA)"
                  value="4"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.training_completed.includes("5")}
                    />
                  }
                  label="SOCRA (CCRP)"
                  value="5"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.training_completed.includes("6")}
                    />
                  }
                  label="Graduate or undergraduate research studies or degrees"
                  value="6"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.training_completed.includes("7")}
                    />
                  }
                  label="Academy of Physicians in Clinical Research"
                  value="7"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.training_completed.includes("8")}
                    />
                  }
                  label="Other"
                  value="8"
                />
              </FormGroup>
              {errors.training_completed && (
                <div className="error">{errors.training_completed}</div>
              )}
            </FormControl>
          </Form.Group>
          {showOtherQuestion === true && (
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
                  id="training_completed_explain"
                  name="training_completed_explain"
                  value={formData.training_completed_explain || ""}
                  rows={3}
                  multiline
                  onChange={handleChange}


                />
              </Box>
              {errors.training_completed_explain && (
                <div className="error">{errors.training_completed_explain}</div>
              )}
            </Form.Group>
          )}

          <Form.Group
            as={Col}
            controlId="validationFormik07"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="What is the current number of research studies supervised by the investigator?"
                id="investigator_research_number"
                name="investigator_research_number"
                value={formData.investigator_research_number || ""}
                onChange={handleChange}
              />
            </Box>
            {errors.investigator_research_number && (
              <div className="error">{errors.investigator_research_number}</div>
            )}
          </Form.Group>

          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Do you have any pending or active restrictions related to
                research or the practice of medicine?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="pending_or_active_research"
                value={formData.pending_or_active_research || ""}
                onChange={(event) =>
                  handlePendingOrInactiveresearch(
                    event,
                    "pending_or_active_research"
                  )
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showAdditionalQuestionPendingOrActive === true && (
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
                  id="pending_or_active_research_explain"
                  name="pending_or_active_research_explain"
                  value={formData.pending_or_active_research_explain || ""}
                  rows={3}
                  multiline
                  onChange={handleChange}


                />
              </Box>
              {errors.pending_or_active_research_explain && (
                <div className="error">
                  {errors.pending_or_active_research_explain}
                </div>
              )}
            </Form.Group>
          )}

          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Does your site have an FWA?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="site_fwp"
                value={formData.site_fwp || ""}
                onChange={(event) => handleSiteFWP(event, "site_fwp")}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showAdditionalQuestionSiteFWP === true && (
            <Form.Group
              as={Col}
              controlId="validationFormik07"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Please provide FWA number *"
                  id="fwa_number"
                  name="fwa_number"
                  value={formData.fwa_number || ""}
                  onChange={handleChange}


                />
              </Box>
              {errors.fwa_number && (
                <div className="error">{errors.fwa_number}</div>
              )}
            </Form.Group>
          )}

          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
          >
            <InputLabel id="demo-simple-select-autowidth-label">
              Upload investigator and sub-investigator CV here *
            </InputLabel>
            {/* <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              color="secondary"
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                name="cv_files"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.files,
                    });
                  }
                }}
                multiple
              />
            </Button> */}
            <CustomFileUploadWrapper
              onFileSelect={(e) => {
                if (e.target.files && e.target.files.length) {
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.files,
                  });
                }
              }}
              buttonText="Upload File"
              name="cv_files" // any additional props you need
            />
            {formData?.cv_files !== undefined &&
              Array.from(formData?.cv_files)?.map((file, i) => {
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
            {errors.cv_files && <div className="error">{errors.cv_files}</div>}
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
          >
            <InputLabel id="demo-simple-select-autowidth-label">
              Upload copy of medical license (if applicable) here
            </InputLabel>
            {/* <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              color="secondary"
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                name="medical_license"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.files,
                    });
                  }
                }}
                multiple
              />
            </Button> */}
            <CustomFileUploadWrapper
              onFileSelect={(e) => {
                if (e.target.files && e.target.files.length) {
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.files,
                  });
                }
              }}
              buttonText="Upload File"
              name="medical_license" // any additional props you need
            />
            {formData?.medical_license !== undefined &&
              Array.from(formData?.medical_license)?.map((file, i) => {
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
            {errors.medical_license && (
              <div className="error">{errors.medical_license}</div>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
          >
            <InputLabel id="demo-simple-select-autowidth-label">
              Upload copies of training certificates (if applicable) here
            </InputLabel>
            {/* <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              color="secondary"
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                name="training_certificates"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.files,
                    });
                  }
                }}
                multiple
              />
            </Button> */}
            <CustomFileUploadWrapper
              onFileSelect={(e) => {
                if (e.target.files && e.target.files.length) {
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.files,
                  });
                }
              }}
              buttonText="Upload File"
              name="training_certificates" // any additional props you need
            />
            {formData?.training_certificates !== undefined &&
              Array.from(formData?.training_certificates)?.map((file, i) => {
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
            {errors.training_certificates && (
              <div className="error">{errors.training_certificates}</div>
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

export default InvestigatorInformationForm;
