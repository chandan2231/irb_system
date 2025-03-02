import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { createPrincipalInvestigatorSubmission } from "../../../../services/ProtocolType/ClinicalResearcherService";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomMUIFormLabel as FormLabel } from "../../../../components/Mui/CustomFormLabel";
import { CustomMUITextFieldWrapper as TextField } from "../../../../components/Mui/CustomTextField";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const SubmissionForm = ({
  protocolTypeDetails,
  submissionForm = {},
  monitorInformation = {},
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [termsSelected, setTermsSelected] = useState(
    submissionForm?.applicant_terms
      ? Number(submissionForm?.applicant_terms) === 1
      : false
  );
  const [checkForTerms, setCheckForTerms] = useState(
    submissionForm?.applicant_acknowledge
      ? Number(submissionForm?.applicant_acknowledge) === 1
      : false
  );
  const [errors, setErrors] = useState({});
  const [addExternalMonitorDetails, setAddExternalMonitorDetails] = useState(
    typeof monitorInformation?.external_monitor_id === "string" ? true : false
  );
  const [externalMonitorsList, setExternalMonitorsList] = useState(false);
  const [selectedExternalMonitor, setSelectedExternalMonitor] = useState(
    typeof monitorInformation?.external_monitor_id === "string"
      ? monitorInformation?.external_monitor_id.toString()
      : ""
  );
  const [loader, setLoader] = useState(false);
  const [notSavedForms, setNotSavedForms] = useState([]);
  const [formData, setFormData] = useState({
    protocol_id: protocolTypeDetails.protocolId,
    protocol_type: protocolTypeDetails.researchType,
    created_by: userDetails.id,
    paymentType: protocolTypeDetails.protocolUserType,
  });
  const [name, setName] = useState(
    submissionForm?.applicant_acknowledge_name
      ? submissionForm?.applicant_acknowledge_name
      : ""
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [submissionFormDetails, setSubmissionFormDetails] = useState({
    waiveFee: submissionForm?.waive_fee,
    allowEdit: submissionForm?.allow_edit,
  });

  const [monitorInformationDetails, setMonitorInformationDetails] = useState({
    created_at: monitorInformation?.created_at,
    created_by: monitorInformation?.created_by,
    external_monitor_id: monitorInformation?.external_monitor_id,
    id: monitorInformation?.id,
    protocol_id: monitorInformation?.protocol_id,
    protocol_type: monitorInformation?.protocol_type,
    updated_at: monitorInformation?.updated_at,
  });

  const navigateToPaymentPage = (params) => {
    navigate("/payment", {
      state: { details: params, identifierType: "user" },
    });
  };

  const navigateToPaymentSuccessPage = (params) => {
    navigate("/success", {
      state: { details: params, identifierType: "user", waiveFee: true },
    });
  };

  const handleTermsChange = (event) => {
    setTermsSelected(event.target.checked);
  };

  const handleCheckForTerms = (event) => {
    setCheckForTerms(event.target.checked);
  };

  const handleAddExternalMonitor = (event) => {
    setAddExternalMonitorDetails(event.target.checked);
  };

  const handleSubmitData = async (e) => {
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
      try {
        if (addExternalMonitorDetails === true) {
          // validation for selectedExternalMonitor field should not be empty
          if (selectedExternalMonitor === "") {
            toast.error("Please select external monitor", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            return;
          } else {
            if (selectedExternalMonitor !== "") {
              formData.external_monitor_id = selectedExternalMonitor;
              formData.terms = termsSelected;
              formData.acknowledge = checkForTerms;
              formData.acknowledge_name = name;
              formData.waive_fee = submissionFormDetails?.waiveFee;
            }
            if (whichSubmitButtonToShow().isSubmitForTrailMonitorVisible) {
              formData.identifier = 1;
            } else {
              formData.identifier = 2;
            }

            setLoader(true);
            // console.log("formData", formData);
            // return;
            dispatch(createPrincipalInvestigatorSubmission(formData)).then(
              (data) => {
                console.log("data", data);
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
                  if (
                    whichSubmitButtonToShow()?.isSubmitForTrailMonitorVisible
                  ) {
                    // Do nothing
                  } else {
                    if (Number(submissionFormDetails?.waiveFee) === 2) {
                      const timer = setTimeout(() => {
                        navigateToPaymentSuccessPage(formData);
                      }, 1000);
                      return () => clearTimeout(timer);
                    } else {
                      const timer = setTimeout(() => {
                        navigateToPaymentPage(formData);
                      }, 1000);
                      return () => clearTimeout(timer);
                    }
                  }
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
        } else {
          formData.terms = termsSelected;
          formData.acknowledge = checkForTerms;
          formData.acknowledge_name = name;
          formData.waive_fee = submissionFormDetails?.waiveFee;
          formData.external_monitor_id = "";

          if (whichSubmitButtonToShow().isSubmitForTrailMonitorVisible) {
            formData.identifier = 1;
          } else {
            formData.identifier = 2;
          }

          setLoader(true);
          dispatch(createPrincipalInvestigatorSubmission(formData)).then(
            (data) => {
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
                if (whichSubmitButtonToShow()?.isSubmitForTrailMonitorVisible) {
                  // Do nothing
                } else {
                  if (Number(submissionFormDetails?.waiveFee) === 2) {
                    const timer = setTimeout(() => {
                      navigateToPaymentSuccessPage(formData);
                    }, 1000);
                    return () => clearTimeout(timer);
                  } else {
                    const timer = setTimeout(() => {
                      navigateToPaymentPage(formData);
                    }, 1000);
                    return () => clearTimeout(timer);
                  }
                }
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
        setLoader(false);
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

  // Validate form fields
  useEffect(() => {
    const isFormValid =
      termsSelected &&
      checkForTerms &&
      name.trim() !== "" &&
      (!addExternalMonitorDetails || selectedExternalMonitor.trim() !== "");

    setIsButtonDisabled(!isFormValid);
  }, [
    termsSelected,
    checkForTerms,
    name,
    addExternalMonitorDetails,
    selectedExternalMonitor,
  ]);

  // console.log("submissionFormDetails", submissionFormDetails);

  const whichSubmitButtonToShow = () => {
    const isSubmitAndPayVisible =
      protocolTypeDetails?.protocolStatus === "Created" &&
      Number(submissionFormDetails?.waiveFee) === 1;
    const isSubmitVisible =
      protocolTypeDetails?.protocolStatus === "Created" &&
      Number(submissionFormDetails?.waiveFee) === 2;
    const isSubmitForTrailMonitorVisible =
      !isSubmitAndPayVisible && !isSubmitVisible;

    return {
      isSubmitAndPayVisible,
      isSubmitVisible,
      isSubmitForTrailMonitorVisible,
    };
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
                  label="Assign to Clinical Trial Monitor Details"
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
                  {externalMonitorsList.length > 0 &&
                    externalMonitorsList.map((user) => (
                      <FormControlLabel
                        key={user.id}
                        value={user.id.toString()} // Convert ID to string for value
                        control={<Radio />}
                        label={user.name}
                        defaultChecked={
                          user.id?.toString() ===
                          monitorInformationDetails.external_monitor_id?.toString()
                        }
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          {/* show submit for trail monitor */}
          {whichSubmitButtonToShow().isSubmitForTrailMonitorVisible && (
            <Form.Group
              as={Col}
              controlId="validationFormik012"
              className="mt-mb-20"
              style={{ textAlign: "left" }}
            >
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Form.Group>
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
                  label="Your initial below certifies that you have read and agree to the research compliance terms listed in above protocol application."
                  // when show submit for trail monitor button is visible then disable the text field
                  disabled={
                    whichSubmitButtonToShow().isSubmitForTrailMonitorVisible
                  }
                />
              </FormGroup>
            </FormControl>
          </Form.Group>

          {/* Checkbox to confirm terms */}
          <Form.Group as={Col} controlId="validationFormik02">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormGroup onChange={handleCheckForTerms}>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={
                    checkForTerms ||
                    protocolTypeDetails?.protocolStatus !== "Created"
                  }
                  label="I acknowledge that processed payment for protocol approval submission is non-refundable."
                  // when show submit for trail monitor button is visible then disable the text field
                  disabled={
                    whichSubmitButtonToShow().isSubmitForTrailMonitorVisible
                  }
                />
              </FormGroup>
            </FormControl>
          </Form.Group>

          {/* Text box for enter name */}
          <Form.Group as={Col} controlId="validationFormik02">
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Type Name (Electronic Signature)"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                // when show submit for trail monitor button is visible then disable the text field
                isButtonDisabled={
                  whichSubmitButtonToShow().isSubmitForTrailMonitorVisible
                }
              />
            </Box>
          </Form.Group>

          {/* Submit button */}
          {whichSubmitButtonToShow().isSubmitAndPayVisible && (
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
                disabled={isButtonDisabled}
              >
                Submit And Pay
              </Button>
            </Form.Group>
          )}

          {/* Submit button */}
          {whichSubmitButtonToShow().isSubmitVisible && (
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
                disabled={isButtonDisabled}
              >
                Submit
              </Button>
            </Form.Group>
          )}
        </form>
      </Row>
    </>
  );
};

export default SubmissionForm;
