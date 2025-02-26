import React, { useEffect, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createMultiSiteSubmission } from "../../../../services/ProtocolType/MultiSiteSponsorService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarBorder from "@mui/icons-material/StarBorder";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApiCall from "../../../../utility/ApiCall";
import Loader from "../../../../components/Loader";
import { Box, IconButton } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import { RadioGroup, Radio } from "@mui/material";

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
  const [externalMonitorsList, setExternalMonitorsList] = useState([]);
  const [selectedExternalMonitor, setSelectedExternalMonitor] = useState(
    typeof monitorInformation?.external_monitor_id === "string"
      ? monitorInformation?.external_monitor_id.toString()
      : ""
  );
  const [loader, setLoader] = useState(false);
  const [notSavedForms, setNotSavedForms] = useState([]);
  const [payloadFormData, setPayloadFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

  const handleTermsChange = (event) => setTermsSelected(event.target.checked);

  const handleCheckForTerms = (event) => {
    setCheckForTerms(event.target.checked);
  };

  const handleAddExternalMonitor = (event) => {
    setAddExternalMonitorDetails(event.target.checked);
    // if check is false, clear the external monitor details
    if (!event.target.checked) {
      setPayloadFormData({
        ...initialValues,
      });
    }
  };

  const handleChangeForExternalMonitor = (e) => {
    setPayloadFormData({
      ...payloadFormData,
      [e.target.name]: e.target.value,
    });
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
              formData.identifier = 1
            } else {
              formData.identifier = 2
            }

            setLoader(true);
            dispatch(createMultiSiteSubmission(formData)).then((data) => {
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
            });
          }
        } else {
          formData.terms = termsSelected;
          formData.acknowledge = checkForTerms;
          formData.acknowledge_name = name;
          formData.waive_fee = submissionFormDetails?.waiveFee;
          formData.external_monitor_id = ""

          if (whichSubmitButtonToShow().isSubmitForTrailMonitorVisible) {
            formData.identifier = 1
          } else {
            formData.identifier = 2
          }

          setLoader(true);
          dispatch(createMultiSiteSubmission(formData)).then((data) => {
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
          });
        }
      } catch (error) {
        setLoader(false);
      }
    }
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
            url: `${baseURL}/researchInfo/getMultiSiteSavedProtocolType`,
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

  const titleCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

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
      <Row>
        {notSavedForms.length > 0 && (
          <List
            sx={{ width: "100%", maxWidth: "50%", bgcolor: "background.paper" }}
          >
            <ListSubheader
              component="div"
              style={{ fontSize: "18px", color: "red" }}
            >
              Before final submission, fill in the forms below
            </ListSubheader>
            {notSavedForms.map((form) => (
              <ListItemButton key={form.form}>
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

        <form onSubmit={handleSubmitData}>
          <Form.Group as={Col} controlId="addExternalMinotorDetails">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label-external-monitor"></FormLabel>
              <FormGroup onChange={handleAddExternalMonitor}>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={addExternalMonitorDetails}
                  label="Assign to Clinical Monitor Trial"
                />
              </FormGroup>
            </FormControl>
          </Form.Group>

          {/* Fields when  addExternalMonitorDetails is true */}
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
                        value={user.id.toString()}
                        control={<Radio />}
                        label={user.name}
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

          <Form.Group as={Col} controlId="protocol-terms" className="ul-list">
            <p>By submitting this application, you attest to the following:</p>
            <ul>
              <li>
                Research will not commence prior to receiving the IRB approval
                letter.
              </li>
              <li>
                The sponsor will conduct regular reviews of the sites and
                investigators.
              </li>
              <li>All involved in the study are properly credentialed.</li>
              <li>
                Only the most current IRB-approved consent form will be used.
              </li>
              <li>
                No changes to the protocol or consent forms will be made without
                IRB approval.
              </li>
              <li>
                Study procedures comply with applicable laws and regulations.
              </li>
              <li>
                Findings affecting subject safety will be communicated to the
                IRB.
              </li>
              <li>
                The sponsor will ensure compliance with investigational product
                regulations.
              </li>
              <li>The sponsor will submit payment for annual IRB review.</li>
            </ul>
          </Form.Group>

          <Form.Group as={Col} controlId="terms-checkbox">
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      termsSelected ||
                      protocolTypeDetails?.protocolStatus !== "Created"
                    }
                    onChange={handleTermsChange}
                  />
                }
                label="I agree to the terms."
                // when show submit for trail monitor button is visible then disable the text field
                disabled={
                  whichSubmitButtonToShow().isSubmitForTrailMonitorVisible
                }
              />
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
                disabled={
                  whichSubmitButtonToShow().isSubmitForTrailMonitorVisible
                }
              />
            </Box>
          </Form.Group>

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
