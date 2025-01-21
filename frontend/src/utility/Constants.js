const RESEARCH_TYPE = {
  CLINICAL_SITE: "Clinical Site",
  PRINCIPAL_INVESTIGATOR: "Principal Investigator",
  MULTI_SITE_SPONSOR: "Multi-Site Sponsor",
  DOCUMENT_REVIEW: "Document Review",
};

const getResearchType = (type) => {
  switch (type) {
    case RESEARCH_TYPE.CLINICAL_SITE:
      return "Clinical Site";
    case RESEARCH_TYPE.PRINCIPAL_INVESTIGATOR:
      return "Principal Investigator";
    case RESEARCH_TYPE.MULTI_SITE_SPONSOR:
      return "Multi-Site Sponsor";
    case RESEARCH_TYPE.DOCUMENT_REVIEW:
      return "Document Review";
    default:
      return "";
  }
};

const getDropDownOptionsByResearchType = (type) => {
  console.log("type", type);
  if (type === RESEARCH_TYPE.CLINICAL_SITE) {
    return [
      {
        value: "protocol_information",
        label: "Protocol Information",
        isUploadMandatory: true,
        uploadDocumentKey: "protocol",
      },
      {
        value: "investigator_information",
        label: "Investigator Information",
        isUploadMandatory: true,
        uploadDocumentKey: "investigator_cv",
      },
      {
        value: "study_information",
        label: "Study Type",
        isUploadMandatory: true,
        uploadDocumentKey: "ingredient_list",
      },
      {
        value: "informed_consent",
        label: "Informed Consent",
        isUploadMandatory: true,
        uploadDocumentKey: "consent_files",
      },
      {
        value: "protocol_procedure",
        label: "Protocol Procedure",
        isUploadMandatory: true,
        uploadDocumentKey: "subject_facing_materials",
      },
    ];
  }
  if (type === RESEARCH_TYPE.PRINCIPAL_INVESTIGATOR) {
    return [
      {
        value: "investigator_protocol_information",
        label: "Investigator Protocol Information",
        isUploadMandatory: true,
        uploadDocumentKey: "investigator_cv",
      },
      {
        value: "consent_information",
        label: "Consent Information",
        isUploadMandatory: false,
        uploadDocumentKey: "",
      },
    ];
  }
  if (type === RESEARCH_TYPE.MULTI_SITE_SPONSOR) {
    return [
      {
        value: "protocol_information",
        label: "Protocol Information",
        isUploadMandatory: true,
        uploadDocumentKey: "protocol",
      },
      {
        value: "contact_information",
        label: "Contact Information",
        isUploadMandatory: false,
        uploadDocumentKey: "",
      },
      {
        value: "study_information",
        label: "Study Information",
        isUploadMandatory: true,
        uploadDocumentKey: "ingredient_list",
      },
      {
        value: "informed_consent",
        label: "Informed Consent",
        isUploadMandatory: true,
        uploadDocumentKey: "consent_files",
      },
      {
        value: "protocol_procedure",
        label: "Protocol Procedure",
        isUploadMandatory: true,
        uploadDocumentKey: "subject_facing_materials",
      },
    ];
  }
  if (type === RESEARCH_TYPE.DOCUMENT_REVIEW) {
    return [
      {
        value: "protocol_information",
        label: "Protocol Information",
        isUploadMandatory: true,
        uploadDocumentKey: "protocol",
      },
      {
        value: "investigator_information",
        label: "Investigator Information",
        isUploadMandatory: true,
        uploadDocumentKey: "investigator_cv",
      },
      {
        value: "informed_consent",
        label: "Document Review",
        isUploadMandatory: true,
        uploadDocumentKey: "consent_files",
      },
    ];
  }
  return [];
};

const CONSTANTS = {
  RESEARCH_TYPE: RESEARCH_TYPE,
  getResearchType: getResearchType,
  getDropDownOptionsByResearchType: getDropDownOptionsByResearchType,
};

export default CONSTANTS;
