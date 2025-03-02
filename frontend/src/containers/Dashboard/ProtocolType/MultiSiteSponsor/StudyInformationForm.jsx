import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import { createStudyInformation } from "../../../../services/ProtocolType/MultiSiteSponsorService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { uploadFile } from "../../../../services/UserManagement/UserService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../../components/Loader";
import { fetchProtocolDetailsById } from "../../../../services/Admin/ProtocolListService";

import { CustomMUITextFieldWrapper as TextField } from "../../../../components/Mui/CustomTextField";
import { CustomMUIFormLabel as FormLabel } from "../../../../components/Mui/CustomFormLabel";
import { CustomInputLabel as InputLabel } from "../../../../components/Mui/CustomInputLabel";


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

const studyInfoSchema = yup.object().shape({
  research_type: yup.string().required("This is required"),
  research_type_explain: yup.string().when("research_type", {
    is: (val) => val === "Other",
    then: () => yup.string().required("This is required"),
    otherwise: () => yup.string().notRequired(),
  }),
});

function StudyInformationForm({
  protocolTypeDetails,
  studyInformation,
  handleNextTab,
  submissionForm = {},
}) {
  const [loader, setLoader] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [showOtherQuestion, setShowOtherQuestion] = React.useState(false);
  const [errors, setErrors] = useState({});
  const [explainErrors, setExplainErrors] = useState();
  const [submissionFormDetails, setSubmissionFormDetails] = useState({
    waiveFee: submissionForm?.waive_fee,
    allowEdit: submissionForm?.allow_edit,
  });
  const [formData, setFormData] = useState({
    research_type: "",
    research_type_explain: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
    ingredient_list: [],
  });

  const handleSelectResearchType = (event, select_name) => {
    if (event.target.value === "Other" && select_name === "research_type") {
      setShowOtherQuestion(true);
    } else {
      setShowOtherQuestion(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    setLoader(true);
    e.preventDefault();
    try {
      const getValidatedform = await studyInfoSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await studyInfoSchema.isValid(getValidatedform);
      if (isValid === true) {
        let ingredient_list = [];
        if (formData.ingredient_list) {
          for (let file of formData.ingredient_list) {
            let id = await uploadFile(file, {
              protocolId: formData.protocol_id,
              createdBy: formData.created_by,
              protocolType: protocolTypeDetails.researchType,
              informationType: "study_information",
              documentName: "ingredient_list",
            });
            ingredient_list.push(id);
          }
        }
        dispatch(createStudyInformation({ ...formData, ingredient_list })).then(
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
              getProtocolDetailsById(
                formData.protocol_id,
                protocolTypeDetails.researchType
              );
              handleNextTab(3);
            }
          }
        );
      }
    } catch (error) {
      setLoader(false);
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
      console.log("newErrors", {
        newErrors,
        formData,
        error,
      });
    }
  };

  useEffect(() => {
    if (studyInformation) {
      setFormData({
        research_type: studyInformation?.research_type || "",
        research_type_explain: studyInformation?.research_type_explain || "",
        protocol_id: protocolTypeDetails?.protocolId || "",
        created_by: userDetails?.id || "",
        ingredient_list:
          studyInformation?.documents?.map((doc) => ({
            name: doc.file_name,
            url: doc.file_url,
            type: doc.protocol_type,
            file_url: doc?.file_url
          })) || [],
      });
      setShowOtherQuestion(studyInformation?.research_type === "Other");
    }
  }, [studyInformation, protocolTypeDetails]);

  const { protocolDetailsById, loading, error } = useSelector((state) => ({
    error: state.admin.error,
    protocolDetailsById: state.admin.protocolDetailsById,
    loading: state.admin.loading,
  }));
  const getProtocolDetailsById = (protocolId, protocolType) => {
    let data = {
      protocolId: protocolId,
      protocolType: protocolType,
    };
    dispatch(fetchProtocolDetailsById(data));
  };

  console.log(submissionFormDetails)

  const shouldShowSaveButton = () => {
    // allowEdit
    // waiveFee
    const waiseFeeStatus = Number(submissionFormDetails.waiveFee)
    const allowEdit = Number(submissionFormDetails.allowEdit)
    if (waiseFeeStatus === 1) {
      return true; // Always show for status 1
    } else if (waiseFeeStatus === 2) {
      return allowEdit === 2; // Show only if allowEdit is 2
    } else if (waiseFeeStatus === 3) {
      return allowEdit === 2; // Show only if allowEdit is 2
    } else if (waiseFeeStatus === 4) {
      return allowEdit === 2; // Show only if allowEdit is 2
    }
    return false; // Default case (if status is something else)
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
        <form onSubmit={handleSubmitData}>
          <Form.Group as={Col} controlId="validationFormik09">
            <FormControl fullWidth className="mt-mb-20">
              <InputLabel id="demo-simple-select-label">
                What type of research study are you submitting *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.research_type}
                onChange={(event) =>
                  handleSelectResearchType(event, "research_type")
                }
                label="What type of research study are you submitting"
                name="research_type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Drug/biologic">Drug/biologic</MenuItem>
                <MenuItem value="Device">Device</MenuItem>
                <MenuItem value="Social/behavioral">Social/behavioral</MenuItem>
                <MenuItem value="Food/dietary supplement">
                  Food/dietary supplement
                </MenuItem>
                <MenuItem value="State or local Government">
                  State or local Government
                </MenuItem>
                <MenuItem value="Cosmetic">Cosmetic</MenuItem>
                <MenuItem value="Retrospective/chart review">
                  Retrospective/chart review
                </MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Form.Group>
          {showOtherQuestion && (
            <Form.Group
              as={Col}
              controlId="validationFormik03"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  variant="outlined"
                  placeholder="Explain *"
                  name="research_type_explain"
                  fullWidth
                  id="research_type_explain"
                  rows={3}
                  multiline
                  value={formData?.research_type_explain}
                  onChange={handleChange}
                />
              </Box>
              {errors?.research_type_explain && (
                <div className="error">{errors?.research_type_explain}</div>
              )}
            </Form.Group>
          )}
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
          >
            <InputLabel id="demo-simple-select-autowidth-label">
              Upload drug/biologic profile, device profile, food/dietary
              supplement ingredient list, or cosmetic ingredient list
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
                name="ingredient_list"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.files,
                    });
                  }
                }}
                multiple
              />
            </Button>
            {formData?.ingredient_list !== undefined &&
              Array.from(formData?.ingredient_list)?.map((file, i) => {
                return file?.file_url ? <div>
                  <a
                    href={file.file_url}
                    target="_blank"
                    className="no_underline"
                  >
                    {file.name}
                  </a>
                </div> : <div key={i}>{file?.name}</div>
              })}
            {errors.ingredient_list && (
              <div className="error">{errors.ingredient_list}</div>
            )}
          </Form.Group>

          {shouldShowSaveButton() && (
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
          )}
        </form>
      </Row>
    </>
  );
}

export default StudyInformationForm;
