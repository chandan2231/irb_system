import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  createPrincipalInvestigatorSubmission,
  getPrincipalInvestigatorSavedProtocolType,
} from "../../../../services/ProtocolType/ClinicalResearcherService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarBorder from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loader";
import ApiCall from "../../../../utility/ApiCall";
import { Box, IconButton } from "@mui/material";
import { RadioGroup, Radio } from "@mui/material";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const SubmissionForm = ({ protocolTypeDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [termsSelected, setTermsSelected] = useState(false);
  const [errors, setErrors] = useState({});
  const [addExternalMonitorDetails, setAddExternalMonitorDetails] =
    useState(false);
  const [externalMonitorsList, setExternalMonitorsList] = useState(false);
  const [selectedExternalMonitor, setSelectedExternalMonitor] = useState("");
  const [loader, setLoader] = useState(false);
  const [notSavedForms, setNotSavedForms] = useState([]);
  const [formData, setFormData] = useState({
    protocol_id: protocolTypeDetails.protocolId,
    protocol_type: protocolTypeDetails.researchType,
    created_by: userDetails.id,
    paymentType: "Protocol Submission",
  });
  const [payloadFormData, setPayloadFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigateToPaymentPage = (params) => {
    navigate("/payment", {
      state: { details: params, identifierType: "user" },
    });
  };

  const handleTermsChange = (event) => {
    setTermsSelected(event.target.checked);
  };

  const handleAddExternalMonitor = (event) => {
    setAddExternalMonitorDetails(event.target.checked);
    if (!event.target.checked) {
      setPayloadFormData({
        ...initialValues,
      });
    }
  };

  const handleSubmitData = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (notSavedForms.length > 0) {
      toast.error(
        "Before final submission, you have to fill protocol information",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        }
      );
      return;
    } else {
      if (addExternalMonitorDetails === true) {
        try {
          const getValidatedform = await validationSchema.validate(
            payloadFormData,
            { abortEarly: false }
          );
          const isValid = await validationSchema.isValid(getValidatedform);
          if (isValid === true) {
            setLoader(false); // Remove this line when API is integrated
            console.log("payloadFormData ====>", {
              ...payloadFormData,
              ...formData,
            });
            // api call here ....
            // if (response.status === 200) {
            //  setLoader(false);
            //   navigateToPaymentPage(formData);
            // }
          }
        } catch (error) {
          setLoader(false);
          const newErrors = {};
          error.inner.forEach((err) => {
            newErrors[err.path] = err.message;
          });
          setErrors(newErrors);
          console.error("Error submitting data:", error);
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
      } else {
        navigateToPaymentPage(formData);
      }
    }
  };

  // Utility function to format titles
  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchProtocolTypeDetails = async () => {
      try {
        if (
          protocolTypeDetails?.protocolId &&
          protocolTypeDetails?.researchType &&
          loader === false
        ) {
          const data = {
            protocolId: protocolTypeDetails.protocolId,
            protocolType: protocolTypeDetails.researchType,
          };
          setLoader(true);
          const response = await ApiCall({
            method: "POST",
            url: `${baseURL}/researchInfo/getPrincipalInvestigatorSavedProtocolType`,
            data,
          });

          if (response?.status === 200) {
            const unsavedForms = response?.data?.filter((form) => !form.filled);
            setNotSavedForms(unsavedForms);
            setLoader(false);
          }
        }
      } catch (error) {
        setLoader(false);
        console.error("Error fetching protocol type details:", error);
      }
    };

    fetchProtocolTypeDetails();
  }, []);

  useEffect(() => {
    const fetchExternalMonitorDetails = async () => {
      try {
        if (
          protocolTypeDetails?.protocolId &&
          protocolTypeDetails?.researchType &&
          loader === false
        ) {
          const data = { added_by: userDetails.id };
          setLoader(true);
          const response = await ApiCall({
            method: "POST",
            url: `${baseURL}/protocol/external/monitor/list`,
            data,
          });
          if (response?.status === 200) {
            setExternalMonitorsList(response?.data);
            setLoader(false);
          }
        }
      } catch (error) {
        setLoader(false);
        console.error("Error fetching external monitors details:", error);
      }
    };
    fetchExternalMonitorDetails();
  }, []);

  const handleChange = (event) => {
    setSelectedExternalMonitor(event.target.value);
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

      {/* Display list of unsaved forms */}
      {notSavedForms.length > 0 && (
        <List
          sx={{ width: "100%", maxWidth: "50%", bgcolor: "background.paper" }}
          component="nav"
        >
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            style={{ fontSize: "18px", color: "red" }}
          >
            Before final submission you have to fill the below forms
          </ListSubheader>
          {notSavedForms.map((form, index) => (
            <ListItemButton key={index}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText
                primary={titleCase(form.form.replaceAll("_", " "))}
              />
            </ListItemButton>
          ))}
        </List>
      )}

      <Row>
        <form onSubmit={handleSubmitData}>
          <Form.Group as={Col} controlId="addExternalMinotorDetails">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label-external-monitor"></FormLabel>
              <FormGroup onChange={handleAddExternalMonitor}>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={addExternalMonitorDetails}
                  label="Add External Monitor Details"
                />
              </FormGroup>
            </FormControl>
          </Form.Group>
          {addExternalMonitorDetails && (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedExternalMonitor}
                  onChange={handleChange}
                >
                  {externalMonitorsList.map((user) => (
                    <FormControlLabel
                      key={user.id}
                      value={user.id.toString()} // Convert ID to string for value
                      control={<Radio />}
                      label={user.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          <Form.Group
            as={Col}
            controlId="validationFormik01"
            className="ul-list"
          >
            <p>By submitting this application you attest to the following:</p>
            <ul>
              <li>
                Research will not commence prior to receiving the IRB approval
                letter.
              </li>
              <li>
                The principal investigator will personally supervise and/or
                conduct the study.
              </li>
              <li>
                The principal investigator ensures that all persons involved in
                conducting the study are trained and have proper credentialing
                for conducting research.
              </li>
              <li>
                Only the most current IRB-approved consent form will be used to
                enroll subjects.
              </li>
              <li>
                No changes will be made to the research protocol, consents
                forms, and all patient-facing materials without the approval of
                the IRB.
              </li>
              <li>
                The study procedures will comply with all applicable laws and
                regulations regarding the conduct of research.
              </li>
              <li>
                All findings from the study that directly affect subject safety
                will be communicated to subjects, the sponsor, and to this IRB.
              </li>
              <li>
                All serious adverse events (SAEs), whether related to the study
                procedures or not, will be reported to this IRB within 2
                business days of the investigator becoming aware of the event
                for IRB safety review.
              </li>
              <li>
                The investigator will submit annual reviews in compliance with
                the sponsor.
              </li>
            </ul>
          </Form.Group>

          {/* Checkbox to confirm terms */}
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormGroup onChange={handleTermsChange}>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={
                    termsSelected ||
                    protocolTypeDetails?.protocolStatus !== "Created"
                  }
                  label="Your initials below signify that you have read and agree to the terms listed above"
                />
              </FormGroup>
            </FormControl>
          </Form.Group>

          {/* Submit button */}
          {protocolTypeDetails?.protocolStatus === "Created" && (
            <Form.Group
              as={Col}
              controlId="validationFormik010"
              className="mt-mb-20"
              style={{ textAlign: "right" }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!termsSelected}
              >
                Submit And Pay
              </Button>
            </Form.Group>
          )}
        </form>
      </Row>
    </>
  );
};

export default SubmissionForm;
