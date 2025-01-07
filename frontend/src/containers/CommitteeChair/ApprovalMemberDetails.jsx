import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  createProtocolEvent,
  assignProtocolToMember,
} from "../../services/Admin/MembersService";
import { chairCommitteeApprovalProtocol } from "../../services/Admin/MembersService";
import { useLocation } from "react-router-dom";
import { fetchApprovedProtocolsByMembersList } from "../../services/Admin/MembersService";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import * as yup from "yup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const chairCommitteeApprovalSchema = yup.object().shape({
  protocol: yup.string().required("This is required"),
  electronic_signature: yup.string().required("This is required"),
});

function ApprovalMemberDetails() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState([]);
  const protocolTypeDetails = location.state.details;
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    protocol: "",
    comment: "",
    electronic_signature: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
    id: protocolTypeDetails.id,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);

  const { approvedProtocolsByMembersList, loading, error } = useSelector(
    (state) => ({
      error: state.member.error,
      approvedProtocolsByMembersList:
        state.member.approvedProtocolsByMembersList,
      loading: state.member.loading,
    })
  );
  useEffect(() => {
    let data = { protocolId: protocolTypeDetails.protocolId };
    dispatch(fetchApprovedProtocolsByMembersList(data));
  }, [dispatch, user.id]);

  console.log("approvedProtocolsByMembersList", approvedProtocolsByMembersList);

  const handleRadioButtonProtocolStatus = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const getValidatedform = await chairCommitteeApprovalSchema.validate(
        formData,
        { abortEarly: false }
      );
      const isValid =
        await chairCommitteeApprovalSchema.isValid(getValidatedform);
      if (isValid === true) {
        dispatch(chairCommitteeApprovalProtocol(formData)).then((data) => {
          if (data.payload.status === 200) {
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
            // setFormData({});
            // e.target.reset();
          }
        });
      }
    } catch (error) {
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
      <Box m={theme.layoutContainer.layoutSection}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={5} sm={5} md={8} lg={8}>
              <Typography variant="h5" mb={2}>
                Protocol Approved By Members List
              </Typography>
              <h2 mb={2}>
                {protocolTypeDetails.protocolId} (
                {protocolTypeDetails.researchType})
              </h2>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 5 }}>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography variant="h6">
                  Protocol Approved by Members
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {approvedProtocolsByMembersList?.data !== null &&
                    approvedProtocolsByMembersList?.data?.length > 0 &&
                    approvedProtocolsByMembersList?.data?.map((users) => (
                      <Grid item xs={12} sm={12} md={6} lg={6} key={users.id}>
                        <Card>
                          <CardHeader subheader={users.name} />
                          <CardContent style={{ paddingTop: "0px" }}>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                              style={{ marginTop: "10px" }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                  Protocol
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                  <strong>
                                    {users.protocol !== ""
                                      ? users.protocol
                                      : "Awating Response"}
                                  </strong>
                                </Grid>
                              </Grid>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                              style={{ marginTop: "10px" }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                  Consent
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                  <strong>
                                    {users.consent !== ""
                                      ? users.consent
                                      : "Awating Response"}
                                  </strong>
                                </Grid>
                              </Grid>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                              style={{ marginTop: "10px" }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                  Supported Document
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                  <strong>
                                    {users.supported_documents !== ""
                                      ? users.supported_documents
                                      : "Awating Response"}
                                  </strong>
                                </Grid>
                              </Grid>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                              style={{ marginTop: "10px" }}
                            >
                              Comment: <strong>{users.comment}</strong>
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography variant="h6">
                  Final Status of Study Approval
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Row className="ml-20">
                  <form onSubmit={handleSubmitData}>
                    <Grid container>
                      <Grid item xs={12} md={12} lg={12}>
                        <Form.Group
                          as={Col}
                          controlId="validationFormik01"
                          className="mt-mb-10"
                        >
                          <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                              Final Status of Study approval
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="protocol"
                              value={formData.protocol}
                              onChange={handleRadioButtonProtocolStatus}
                            >
                              <FormControlLabel
                                value="Approved"
                                control={<Radio />}
                                label="Approved"
                              />
                              <FormControlLabel
                                value="Under Review"
                                control={<Radio />}
                                label="Under Review"
                              />
                              <FormControlLabel
                                value="Approved pending changes"
                                control={<Radio />}
                                label="Approved pending changes"
                              />
                              <FormControlLabel
                                value="Rejected"
                                control={<Radio />}
                                label="Rejected"
                              />
                            </RadioGroup>
                          </FormControl>
                          {errors.protocol && (
                            <div className="error">{errors.protocol}</div>
                          )}
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          controlId="validationFormik04"
                          className="mt-mb-10"
                        >
                          <TextField
                            fullWidth
                            placeholder="Enter your comment"
                            label="Comment"
                            id="comment"
                            name="comment"
                            onChange={handleInputChange}
                            defaultValue={formData.comment}
                            multiline
                            rows={4}
                            maxRows={10}
                          />
                          {errors.comment && (
                            <div className="error">{errors.comment}</div>
                          )}
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          controlId="validationFormik05"
                          className="mt-mb-10"
                        >
                          <TextField
                            fullWidth
                            placeholder="Enter your name"
                            label="Electronic Signature *"
                            id="electronic_signature"
                            name="electronic_signature"
                            onChange={handleInputChange}
                            defaultValue={formData.electronic_signature}
                          />
                          {errors.electronic_signature && (
                            <div className="error">
                              {errors.electronic_signature}
                            </div>
                          )}
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          controlId="validationFormik010"
                          style={{ textAlign: "right" }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            type="Submit"
                          >
                            SUBMIT
                          </Button>
                        </Form.Group>
                      </Grid>
                    </Grid>
                  </form>
                </Row>
              </AccordionDetails>
            </Accordion>
          </div>
        </Box>
      </Box>
    </>
  );
}

export default ApprovalMemberDetails;
