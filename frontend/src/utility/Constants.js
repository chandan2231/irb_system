const RESEARCH_TYPE = {
  CLINICAL_SITE: "Clinical Site",
  PRINCIPAL_INVESTIGATOR: "Principal Investigator",
  MULTI_SITE_SPONSOR: "Multi-Site Sponsor",
};

const getResearchType = (type) => {
  switch (type) {
    case RESEARCH_TYPE.CLINICAL_SITE:
      return "Clinical Site";
    case RESEARCH_TYPE.PRINCIPAL_INVESTIGATOR:
      return "Principal Investigator";
    case RESEARCH_TYPE.MULTI_SITE_SPONSOR:
      return "Multi-Site Sponsor";
    default:
      return "";
  }
};

const getDropDownOptionsByResearchType = (type) => {
  console.log("type", type);
  if (type === RESEARCH_TYPE.CLINICAL_SITE) {
    return [
      { value: "protocol_information", label: "Protocol Information" },
      { value: "investigator_information", label: "Investigator Information" },
      { value: "study_information", label: "Study Information" },
      { value: "informed_consent", label: "Informed Consent" },
      { value: "protocol_procedure", label: "Protocol Procedure" },
    ];
  }
  if (type === RESEARCH_TYPE.PRINCIPAL_INVESTIGATOR) {
    return [
      {
        value: "investigator_protocol_information",
        label: "Investigator Protocol Information",
      },
      { value: "consent_information", label: "Consent Information" },
    ];
  }
  if (type === RESEARCH_TYPE.MULTI_SITE_SPONSOR) {
    return [
      { value: "protocol_information", label: "Protocol Information" },
      { value: "contact_information", label: "Contact Information" },
      { value: "study_information", label: "Study Information" },
      { value: "informed_consent", label: "Informed Consent" },
      { value: "protocol_procedure", label: "Protocol Procedure" },
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
