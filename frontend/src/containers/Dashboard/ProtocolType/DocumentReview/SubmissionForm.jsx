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
import Loader from "../../../../components/Loader";
import ApiCall from "../../../../utility/ApiCall";
import { Box, FormGroup, TextField } from "@mui/material";

const baseURL = import.meta.env.VITE_API_BASE_URL;

function SubmissionForm({
  protocolTypeDetails,
  protocolDetailsById,
  apiCallIdentifier,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [loader, setLoader] = useState(false);
  const [termsSelected, setTermsSelected] = useState(false);
  const [callSavedFormData, setCallSavedFormData] = useState(false);
  const [checkForTerms, setCheckForTerms] = useState(false);
  const [formData, setFormData] = useState({
    protocol_id: protocolTypeDetails.protocolId,
    protocol_type: protocolTypeDetails.researchType,
    created_by: userDetails.id,
    paymentType: protocolTypeDetails.protocolUserType,
  });
  const [unsavedForms, setUnsavedForms] = useState([]);
  const [name, setName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleTermsChecked = (event) => {
    setTermsSelected(event.target.checked);
  };

  const handleCheckForTerms = (event) => {
    setCheckForTerms(event.target.checked);
  }

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
            url: `${baseURL}/researchInfo/getDocumentReviewSavedProtocolType`,
            data,
          });

          if (response?.status === 200) {
            const unsavedForms = response?.data?.filter((form) => !form.filled);
            setUnsavedForms(unsavedForms);
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

  // Validate form fields
  useEffect(() => {
    const isFormValid =
      termsSelected &&
      checkForTerms &&
      name.trim() !== ""

    setIsButtonDisabled(!isFormValid);
  }, [termsSelected, checkForTerms, name,]);

  if (loader) {
    return <Loader />;
  }

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
                "The document review request is not an approval of research or protocol.",
                "The expert opinions in articles or reviews are those of the author and not the organization. The review of documents cannot cover all potential ethical/ legal issues that may arise without complete information of the research protocol.",
                "Your initial below certifies that you have read and agree to the research compliance terms listed in above protocol application..",
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
                    checked={
                      termsSelected ||
                      protocolTypeDetails?.protocolStatus !== "Created"
                    }
                    onChange={handleTermsChecked}
                  />
                }
                label="Your initial below certifies that you have read and agree to the research compliance terms listed in above protocol application."
              />
            </FormControl>
          </Form.Group>

          {/* Checkbox to confirm terms */}
          <Form.Group as={Col} controlId="validationFormik02">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormGroup onChange={
                handleCheckForTerms
              }>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={
                    checkForTerms
                  }
                  label="I acknowledge that process payment for protocol approval submission is non-refundable."
                />
              </FormGroup>
            </FormControl>
          </Form.Group>


          {/* Text box for enter name */}
          <Form.Group as={Col} controlId="validationFormik02">
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Enter Name"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
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
                disabled={isButtonDisabled}
              >
                Submit And Pay
              </Button>
            </Form.Group>
          )}
        </form>
      </Row>
    </>
  );
}

export default SubmissionForm;
