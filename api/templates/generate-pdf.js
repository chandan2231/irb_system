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
  };
  const template = {
    content: `${htmlTemplates.continuingReviewHTMLTemplate(templatePayload)}`,
  };
  return template;
};

const PdfTemplates = {
  ContinuingReviewPdfTemplate,
};

export default PdfTemplates;
