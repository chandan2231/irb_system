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

// Helper function to convert string to title case
const titleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const SubmissionForm = ({ protocolTypeDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [termsSelected, setTermsSelected] = useState(false);

  const [formData, setFormData] = useState({
    protocol_id: protocolTypeDetails.protocolId,
    protocol_type: protocolTypeDetails.researchType,
    created_by: userDetails.id,
  });

  const navigateToPaymentPage = (params) => {
    navigate("/payment", {
      state: { details: params, identifierType: "user" },
    });
  };

  const { getAllMultiSiteSavedProtocolType, loading, error } = useSelector(
    (state) => state.multiSiteSponsor
  );

  const notSavedForms =
    getAllMultiSiteSavedProtocolType?.filter((form) => !form.filled) || [];

  useEffect(() => {
    if (
      protocolTypeDetails?.protocolId &&
      protocolTypeDetails?.researchType &&
      !loading && // Check if data is loading
      (!getAllMultiSiteSavedProtocolType ||
        getAllMultiSiteSavedProtocolType.length === 0) // Ensure no redundant API calls
    ) {
      const data = {
        protocolId: protocolTypeDetails.protocolId,
        protocolType: protocolTypeDetails.researchType,
      };
      dispatch(getMultiSiteSavedProtocolType(data));
    }
  }, [
    dispatch,
    protocolTypeDetails?.protocolId,
    protocolTypeDetails?.researchType,
    getAllMultiSiteSavedProtocolType, // Add this to avoid unnecessary calls if data already exists
    loading, // Prevent calls if already in loading state
  ]);

  // Handle terms checkbox change
  const handleTermsChange = (event) => setTermsSelected(event.target.checked);

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

  // Handle form submission
  // const handleSubmitDataOld = async (e) => {
  //   e.preventDefault();

  //   // Show toast if there are unsaved forms
  //   if (notSavedForms.length > 0) {
  //     toast.error(
  //       "Before final submission, you must fill in the required protocol information.",
  //       {
  //         position: "top-right",
  //         autoClose: 5000,
  //         theme: "dark",
  //       }
  //     );
  //     return;
  //   }

  //   try {
  //     const response = await dispatch(createMultiSiteSubmission(formData));
  //     if (response.payload.status === 200) {
  //       toast.success(response.payload.data.msg, {
  //         position: "top-right",
  //         autoClose: 5000,
  //         theme: "dark",
  //       });
  //       setFormData({}); // Clear form data after successful submission
  //     }
  //   } catch (error) {
  //     console.error("Error during submission:", error);
  //   }
  // };

  console.log("notSavedForms", notSavedForms);
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />

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
                    checked={termsSelected}
                    onChange={handleTermsChange}
                  />
                }
                label="I agree to the terms."
              />
            </FormControl>
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="submit-button"
            style={{ textAlign: "right" }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
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
