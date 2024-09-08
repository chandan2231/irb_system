import htmlTemplates from "./html-templates.js";

const ContinuingReviewPdfTemplate = (
  continuinReviewDetailObj,
  protocolIdObj
) => {
  const { protocolId, researchType } = protocolIdObj;
  const templatePayload = {
    headerText: "Continuin Review Details",
    protocolId,
    researchType,
    risk_assessment: continuinReviewDetailObj.risk_assessment,
    informed_consent_process: continuinReviewDetailObj.informed_consent_process,
    investigator_instuation_info:
      continuinReviewDetailObj.investigator_instuation_info,
    research_progress_info: continuinReviewDetailObj.research_progress_info,
  };
  const template = {
    content: `${htmlTemplates.continuingReviewHTMLTemplate(templatePayload)}`,
  };
  return template;
};

const protocolAmendmentRequestPdfTemplate = () => {
  const template = {
    content: `${htmlTemplates.protocolAmendmentRequestHTMLTemplate()}`,
  };
  return template;
};

const PdfTemplates = {
  ContinuingReviewPdfTemplate,
  protocolAmendmentRequestPdfTemplate,
};

export default PdfTemplates;
