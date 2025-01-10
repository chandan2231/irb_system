import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  createClinicalSiteSubmission,
  getClinicalSiteSavedProtocolType,
} from "../../../../services/ProtocolType/ContractorResearcherService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarBorder from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";

function SubmissionForm({
  protocolTypeDetails,
  protocolDetailsById,
  apiCallIdentifier,
}) {
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

  const { getAllClinicalSiteSavedProtocolType, loading, error } = useSelector(
    (state) => state.contractorResearcher
  );

  // Extract unsaved forms directly from the API data
  const unsavedForms =
    getAllClinicalSiteSavedProtocolType?.filter((form) => !form.filled) || [];

  useEffect(() => {
    // Log to verify the protocolTypeDetails values

    if (
      protocolTypeDetails?.protocolId &&
      protocolTypeDetails?.researchType &&
      !loading && // Check if data is loading
      (!getAllClinicalSiteSavedProtocolType ||
        getAllClinicalSiteSavedProtocolType.length === 0) // Ensure no redundant API calls
    ) {
      const data = {
        protocolId: protocolTypeDetails.protocolId,
        protocolType: protocolTypeDetails.researchType,
      };
      dispatch(getClinicalSiteSavedProtocolType(data));
    }
  }, [
    dispatch,
    protocolTypeDetails?.protocolId,
    protocolTypeDetails?.researchType,
    getAllClinicalSiteSavedProtocolType, // Add this to avoid unnecessary calls if data already exists
    loading, // Prevent calls if already in loading state
  ]);

  const handleTermsChecked = (event) => {
    setTermsSelected(event.target.checked);
  };

  const navigateToPaymentPage = (params) => {
    navigate("/payment", {
      state: { details: params, identifierType: "user" },
    });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    if (unsavedForms.length > 0) {
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
    // try {
    //   const response = await dispatch(
    //     createClinicalSiteSubmission({ ...formData })
    //   );
    //   if (response.payload.status === 200) {
    //     toast.success(response.payload.data.msg, {
    //       position: "top-right",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       theme: "dark",
    //     });
    //     setFormData({});
    //   }
    // } catch (error) {
    //   toast.error("Error during submission", {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     theme: "dark",
    //   });
    // }
  };

  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderUnsavedForms = () => {
    return unsavedForms.map((form, index) => (
      <ListItemButton key={index}>
        <ListItemIcon>
          <StarBorder />
        </ListItemIcon>
        <ListItemText primary={titleCase(form.form.replaceAll("_", " "))} />
      </ListItemButton>
    ));
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        theme="dark"
      />

      <Row>
        {unsavedForms.length > 0 && (
          <List
            sx={{ width: "100%", maxWidth: "50%", bgcolor: "background.paper" }}
          >
            <ListItemButton>
              <ListItemText
                primary="Before final submission, you have to fill the following forms"
                style={{ fontSize: "18px", color: "red" }}
              />
            </ListItemButton>
            {renderUnsavedForms()}
          </List>
        )}

        <form onSubmit={handleSubmitData}>
          <Form.Group
            as={Col}
            controlId="validationFormik01"
            className="ul-list"
          >
            <p>By submitting this application, you attest to the following:</p>
            <ul>
              {[
                "Research will not commence prior to receiving the IRB approval letter.",
                "The principal investigator will personally supervise and/or conduct the study.",
                "The principal investigator ensures that all persons involved in conducting the study are trained and have proper credentialing for conducting research.",
                "Only the most current IRB-approved consent form will be used to enroll subjects.",
                "No changes will be made to the research protocol, consents forms, and all patient-facing materials without the approval of the IRB.",
                "The study procedures will comply with all applicable laws and regulations regarding the conduct of research.",
                "All findings from the study that directly affect subject safety will be communicated to subjects and to this IRB.",
                "All serious adverse events (SAEs), whether related to the study procedures or not, will be reported to this IRB within 2 business days of the investigator becoming aware of the event for IRB safety review.",
                "The sponsor agrees to submit and provide payment to this IRB for annual review yearly.",
              ].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Form.Group>

          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsSelected}
                    onChange={handleTermsChecked}
                  />
                }
                label="Your initials below signify that you have read and agree to the terms listed above"
              />
            </FormControl>
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
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
        </form>
      </Row>
    </>
  );
}

export default SubmissionForm;
