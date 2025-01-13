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

const baseURL = import.meta.env.VITE_API_BASE_URL;

const SubmissionForm = ({ protocolTypeDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [termsSelected, setTermsSelected] = useState(false);
  const [formData, setFormData] = useState({
    protocol_id: protocolTypeDetails.protocolId,
    protocol_type: protocolTypeDetails.researchType,
    created_by: userDetails.id,
    paymentType: "Protocol Submission",
  });
  const [loader, setLoader] = useState(false);
  const [notSavedForms, setNotSavedForms] = useState([]);

  const navigateToPaymentPage = (params) => {
    navigate("/payment", {
      state: { details: params, identifierType: "user" },
    });
  };

  const handleTermsChange = (event) => {
    setTermsSelected(event.target.checked);
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
      navigateToPaymentPage(formData);
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

      {/* Submission Form */}
      <Row>
        <form onSubmit={handleSubmitData}>
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
                  label="Your initials below signify that you have read and agree to the terms listed above"
                />
              </FormGroup>
            </FormControl>
          </Form.Group>

          {/* Submit button */}
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
            style={{ textAlign: "right" }}
          >
            <Button
              variant="contained"
              color="primary"
              type="Submit"
              disabled={!termsSelected}
            >
              SUBMIT AND PAY
            </Button>
          </Form.Group>
        </form>
      </Row>
    </>
  );
};

export default SubmissionForm;
