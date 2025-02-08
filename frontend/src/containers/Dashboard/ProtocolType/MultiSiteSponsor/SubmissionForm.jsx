import React, { useEffect, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createMultiSiteSubmission,
  getMultiSiteSavedProtocolType,
} from "../../../../services/ProtocolType/MultiSiteSponsorService";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApiCall from "../../../../utility/ApiCall";
import Loader from "../../../../components/Loader";
import { Box, IconButton } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
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
    paymentType: "Multi-Site Sponsor",
  });

  const navigateToPaymentPage = (params) => {
    navigate("/payment", {
      state: { details: params, identifierType: "user" },
    });
  };

  const handleTermsChange = (event) => setTermsSelected(event.target.checked);

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
                  label="Add External Monitor Details"
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
              />
            </FormControl>
          </Form.Group>

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
