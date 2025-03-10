import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { researchProcessSave } from "../../../services/ContinuinReview/ContinuinReviewService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { uploadFile } from "../../../services/UserManagement/UserService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomMUIFormLabel as FormLabel } from "../../../components/Mui/CustomFormLabel";
import { CustomMUITextFieldWrapper as TextField } from "../../../components/Mui/CustomTextField";
import { fetchContinuinReviewDetailsById } from "../../../services/Admin/ContinuinReviewListService";

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

const researchProcessSchema = yup.object().shape({
  subjects_enrolled: yup.string().required("This is required"),
  discontinued_subjects: yup.string().required("This is required"),
  sub_withdrew: yup.string().required("This is required"),
  sub_terminated_before_completion: yup.string().required("This is required"),
  occured_adverse_event: yup.string().required("This is required"),
  subjecte_completed: yup.string().required("This is required"),
});

function ResearchProgress({ continuinReviewDetails, researchProgress }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [showAdditionalQuestionWithdrew, setShowAdditionalQuestionWithdrew] =
    React.useState(1);
  const [
    showAdditionalQuestionTerminated,
    setShowAdditionalQuestionTerminated,
  ] = React.useState(1);
  const [
    showAdverseEventAdditionalQuestion,
    setShowAdverseEventAdditionalQuestion,
  ] = React.useState(false);
  const [
    showLastApprovalChangeAdditionalQuestion,
    setShowLastApprovalChangeAdditionalQuestion,
  ] = React.useState(false);
  const [
    showLastApprovalChangeReportAdditionalQuestion,
    setShowLastApprovalChangeReportAdditionalQuestion,
  ] = React.useState(false);
  const [formData, setFormData] = useState({
    subjects_enrolled: "",
    discontinued_subjects: "",
    sub_withdrew: "",
    withdrawal_reason_explain: "",
    sub_terminated_before_completion: "",
    termination_reason_explain: "",
    occured_adverse_event: "",
    adverse_event_submission: "",
    adverse_event_not_reported_explain: "",
    adverse_event_explain: "",
    subjecte_completed: "",
    last_approval_change: "",
    last_approval_change_report: "",
    changes_not_reported_to_irb: "",
    protocol_id: continuinReviewDetails.protocolId,
    created_by: userDetails.id,
    q3_supporting_documents: [],
    q3_clone_supporting_documents: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (researchProgress) {
      setFormData({
        subjects_enrolled: researchProgress?.subjects_enrolled || "",
        discontinued_subjects: researchProgress?.discontinued_subjects || "",
        sub_withdrew: researchProgress?.sub_withdrew || "",
        withdrawal_reason_explain:
          researchProgress?.withdrawal_reason_explain || "",
        sub_terminated_before_completion:
          researchProgress?.sub_terminated_before_completion || "",
        termination_reason_explain:
          researchProgress?.termination_reason_explain || "",
        occured_adverse_event: researchProgress?.occured_adverse_event || "",
        adverse_event_submission:
          researchProgress?.adverse_event_submission || "",
        adverse_event_not_reported_explain:
          researchProgress?.adverse_event_not_reported_explain || "",
        adverse_event_explain: researchProgress?.adverse_event_explain || "",
        subjecte_completed: researchProgress?.subjecte_completed || "",
        last_approval_change: researchProgress?.last_approval_change || "",
        last_approval_change_report:
          researchProgress?.last_approval_change_report || "",
        changes_not_reported_to_irb:
          researchProgress?.changes_not_reported_to_irb || "",
        protocol_id: continuinReviewDetails?.protocolId,
        created_by: userDetails?.id,

        q3_supporting_documents:
          researchProgress?.documents
            ?.filter((doc) => doc.document_name === "q3_supporting_documents")
            .map((doc) => ({
              id: doc.id,
              name: doc.file_name,
              url: doc.file_url,
            })) || [],

        q3_clone_supporting_documents:
          researchProgress?.documents
            ?.filter((doc) => doc.document_name === "q3_supporting_documents")
            .map((doc) => ({
              id: doc.id,
              name: doc.file_name,
              url: doc.file_url,
            })) || [],
      });

      setShowAdverseEventAdditionalQuestion(
        researchProgress.adverse_event_submission === "No" ? true : false
      );
      setShowLastApprovalChangeAdditionalQuestion(
        researchProgress.last_approval_change === "Yes" ? true : false
      );
      setShowLastApprovalChangeReportAdditionalQuestion(
        researchProgress.last_approval_change_report === "No" ? true : false
      );
    }
  }, [researchProgress, continuinReviewDetails?.protocolId]);

  const handleAdverseEventSubmission = (event, radio_name) => {
    if (
      radio_name === "adverse_event_submission" &&
      event.target.value === "No"
    ) {
      setShowAdverseEventAdditionalQuestion(true);
    } else if (
      radio_name === "adverse_event_submission" &&
      event.target.value === "Yes"
    ) {
      setShowAdverseEventAdditionalQuestion(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLastApprovalChange = (event, radio_name) => {
    if (radio_name === "last_approval_change" && event.target.value === "Yes") {
      setShowLastApprovalChangeAdditionalQuestion(true);
    } else if (
      radio_name === "last_approval_change" &&
      event.target.value === "No"
    ) {
      setShowLastApprovalChangeAdditionalQuestion(false);
      setShowLastApprovalChangeReportAdditionalQuestion(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLastApprovalChangeReport = (event, radio_name) => {
    if (
      radio_name === "last_approval_change_report" &&
      event.target.value === "No"
    ) {
      setShowLastApprovalChangeReportAdditionalQuestion(true);
    } else if (
      radio_name === "last_approval_change_report" &&
      event.target.value === "Yes"
    ) {
      setShowLastApprovalChangeReportAdditionalQuestion(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const getValidatedform = await researchProcessSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await researchProcessSchema.isValid(getValidatedform);
      if (isValid === true) {
        let q3_supporting_documents = [];

        if (formData.q3_supporting_documents) {
          for (let file of formData.q3_supporting_documents) {
            const isFileIdExistInClone =
              formData.q3_clone_supporting_documents.find(
                (doc) => doc.name === file.name
              );
            if (!isFileIdExistInClone) {
              let id = uploadFile(file, {
                protocolId: formData.protocol_id,
                createdBy: formData.created_by,
                protocolType: "continuein_review",
                informationType: "research_progress",
                documentName: "q3_supporting_documents",
              });
              q3_supporting_documents.push(id);
            }
          }
        }

        dispatch(researchProcessSave({ ...formData })).then((data) => {
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
            let data = {
              protocolId: continuinReviewDetails?.protocolId,
              protocolType: continuinReviewDetails?.researchType,
            };
            dispatch(fetchContinuinReviewDetailsById(payload));
            setFormData({});
            e.target.reset();
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

  console.log("researchProgress", {
    researchProgress,
    formData,
  });

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
          <h4>Question 1</h4>
          <Form.Group
            as={Col}
            controlId="validationFormik06"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Total Subjects Enrolled *"
                id="subjects_enrolled"
                name="subjects_enrolled"
                value={formData.subjects_enrolled}
                onChange={handleChange}
              />
            </Box>
            {errors.subjects_enrolled && (
              <div className="error">{errors.subjects_enrolled}</div>
            )}
          </Form.Group>
          <h4>Question 2</h4>
          <Form.Group
            as={Col}
            controlId="validationFormik07"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="How many subjects have discontinued their participation? *"
                id="discontinued_subjects"
                name="discontinued_subjects"
                value={formData.discontinued_subjects}
                onChange={handleChange}
              />
            </Box>
            {errors.discontinued_subjects && (
              <div className="error">{errors.discontinued_subjects}</div>
            )}
          </Form.Group>
          <div style={{ marginLeft: "0px" }}>
            <Form.Group
              as={Col}
              controlId="validationFormik07"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Out of that number, how many subjects withdrew of their own accord *"
                  id="sub_withdrew"
                  name="sub_withdrew"
                  value={formData.sub_withdrew}
                  onChange={handleChange}
                />
              </Box>
              {errors.sub_withdrew && (
                <div className="error">{errors.sub_withdrew}</div>
              )}
            </Form.Group>
            {showAdditionalQuestionWithdrew >= 1 && (
              <div>
                <FormLabel>Describe the reasons for withdrawal *</FormLabel>
                <Form.Group as={Col} controlId="validationFormik03">
                  <Box sx={{ width: "100%", maxWidth: "100%" }}>
                    <TextField
                      variant="outlined"
                      placeholder="Explain"
                      fullWidth
                      name="withdrawal_reason_explain"
                      id="withdrawal_reason_explain"
                      rows={3}
                      multiline
                      value={formData.withdrawal_reason_explain}
                      onChange={handleChange}
                    />
                  </Box>
                  {errors.withdrawal_reason_explain_error && (
                    <div className="error">
                      {errors.withdrawal_reason_explain_error}
                    </div>
                  )}
                </Form.Group>
              </div>
            )}
            <Form.Group
              as={Col}
              controlId="validationFormik07"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="how many subjects were terminated before completion of the protocol by the decision of the PI, Sponsor, or other contracted research personnel *"
                  id="sub_terminated_before_completion"
                  name="sub_terminated_before_completion"
                  value={formData.sub_terminated_before_completion}
                  onChange={handleChange}
                />
              </Box>
              {errors.sub_terminated_before_completion && (
                <div className="error">
                  {errors.sub_terminated_before_completion}
                </div>
              )}
            </Form.Group>
            {showAdditionalQuestionTerminated >= 1 && (
              <div>
                <FormLabel>Describe the reasons for termination *</FormLabel>
                <Form.Group as={Col} controlId="validationFormik03">
                  <Box sx={{ width: "100%", maxWidth: "100%" }}>
                    <TextField
                      variant="outlined"
                      placeholder="Explain"
                      fullWidth
                      name="termination_reason_explain"
                      id="termination_reason_explain"
                      rows={3}
                      multiline
                      value={formData.termination_reason_explain}
                      onChange={handleChange}
                    />
                  </Box>
                  {errors.termination_reason_explain_error && (
                    <div className="error">
                      {errors.termination_reason_explain_error}
                    </div>
                  )}
                </Form.Group>
              </div>
            )}
          </div>
          <h4>Question 3</h4>
          <Form.Group
            as={Col}
            controlId="validationFormik07"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="How many adverse events have occurred since the last approval?*"
                id="occured_adverse_event"
                name="occured_adverse_event"
                value={formData.occured_adverse_event}
                onChange={handleChange}
              />
            </Box>
            {errors.occured_adverse_event && (
              <div className="error">{errors.occured_adverse_event}</div>
            )}
          </Form.Group>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Have these adverse events been submitted to the IRB?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="adverse_event_submission"
                value={formData.adverse_event_submission}
                onChange={(event) =>
                  handleAdverseEventSubmission(
                    event,
                    "adverse_event_submission"
                  )
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showAdverseEventAdditionalQuestion === true && (
            <>
              <div className="mt-mb-20">
                <FormLabel>
                  What was the reason the adverse events were not reported to
                  the IRB?*
                </FormLabel>
                <Form.Group as={Col} controlId="validationFormik03">
                  <Box sx={{ width: "100%", maxWidth: "100%" }}>
                    <TextField
                      variant="outlined"
                      placeholder="Explain"
                      fullWidth
                      name="adverse_event_not_reported_explain"
                      id="adverse_event_not_reported_explain"
                      rows={3}
                      multiline
                      value={formData.adverse_event_not_reported_explain}
                      onChange={handleChange}
                    />
                  </Box>
                  {errors.adverse_event_not_reported_explain_error && (
                    <div className="error">
                      {errors.adverse_event_not_reported_explain_error}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className="mt-mb-20">
                <FormLabel>
                  Please describe the adverse events including what occurred,
                  the timeline in which it occurred, and the time at which the
                  study personnel became aware of the adverse event*
                </FormLabel>
                <Form.Group as={Col} controlId="validationFormik03">
                  <Box sx={{ width: "100%", maxWidth: "100%" }}>
                    <TextField
                      variant="outlined"
                      placeholder="Explain"
                      fullWidth
                      name="adverse_event_explain"
                      id="adverse_event_explain"
                      rows={3}
                      multiline
                      value={formData.adverse_event_explain}
                      onChange={handleChange}
                    />
                  </Box>
                  {errors.adverse_event_explain_error && (
                    <div className="error">
                      {errors.adverse_event_explain_error}
                    </div>
                  )}
                </Form.Group>
              </div>

              <Form.Group
                as={Col}
                controlId="validationFormik010"
                className="mt-mb-20"
              >
                <InputLabel
                  id="demo-simple-select-autowidth-label"
                  className="mt-mb-10"
                >
                  Upload any supporting documents
                </InputLabel>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    name="q3_supporting_documents"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length) {
                        setFormData({
                          ...formData,
                          [e.target.name]: e.target.files,
                        });
                      }
                    }}
                  />
                </Button>
                {formData?.q3_supporting_documents !== undefined &&
                  Array.from(formData?.q3_supporting_documents)?.map(
                    (file, i) => <div key={i}>{file?.name}</div>
                  )}
                {errors.q3_supporting_documents && (
                  <div className="error">{errors.q3_supporting_documents}</div>
                )}
              </Form.Group>
            </>
          )}
          <h4>Question 4</h4>
          <Form.Group
            as={Col}
            controlId="validationFormik07"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="How many subject have completed the study per protocol?*"
                id="subjecte_completed"
                name="subjecte_completed"
                value={formData.subjecte_completed}
                onChange={handleChange}
              />
            </Box>
            {errors.subjecte_completed && (
              <div className="error">{errors.subjecte_completed}</div>
            )}
          </Form.Group>
          <h4>Question 5</h4>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Have there been any updates/changes to the protocol since the
                last approval?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="last_approval_change"
                value={formData.last_approval_change}
                onChange={(event) =>
                  handleLastApprovalChange(event, "last_approval_change")
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showLastApprovalChangeAdditionalQuestion === true && (
            <Form.Group as={Col} controlId="validationFormik01">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Have these changes been reported to the IRB?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="last_approval_change_report"
                  value={formData.last_approval_change_report}
                  onChange={(event) =>
                    handleLastApprovalChangeReport(
                      event,
                      "last_approval_change_report"
                    )
                  }
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
          )}
          {showLastApprovalChangeReportAdditionalQuestion === true && (
            <div className="mt-mb-20">
              <FormLabel>
                What is the reason the changes have not reported to the IRB?*
              </FormLabel>
              <Form.Group as={Col} controlId="validationFormik03">
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Explain"
                    fullWidth
                    name="changes_not_reported_to_irb"
                    id="changes_not_reported_to_irb"
                    rows={3}
                    multiline
                    value={formData.changes_not_reported_to_irb}
                    onChange={handleChange}
                  />
                </Box>
                {errors.changes_not_reported_to_irb_error && (
                  <div className="error">
                    {errors.changes_not_reported_to_irb_error}
                  </div>
                )}
              </Form.Group>
            </div>
          )}
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
        </form>
      </Row>
    </>
  );
}

export default ResearchProgress;
