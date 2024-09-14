import questionsToRender from "./constant.js";

const renderHeader = (Children) => {
  return `<p style="padding:25px">${Children}</p>`;
};

const RenderBody = (children) => {
  return `<body style="padding:25">${children}</body>`;
};

const RenderTextOnly = (text) => {
  return `<div>
      <p>${text}</p>
    </div>`;
};

const RenderSubTextAnswer = (answer, answerObject) => {
  return `<div>
          ${
            answerObject[answer]
              ? `<span>${answerObject[answer]}</span>`
              : `<h4>N/A</h4>`
          }
      </div>`;
};

const RenderQuestion = (sequence, text) => {
  return `<div>
      <h3>Question ${sequence}</h3>${text ? `<span>${text}</span>` : ``}
    </div>`;
};

const RenderSubOptions = (subOptions) => {
  return `<div>
      ${
        subOptions
          ? `<ul>
        ${Object.keys(subOptions)
          .map((key) => {
            return `<li>${subOptions[key]}</li>`;
          })
          .join("")}
      </ul>`
          : ""
      }
    </div>`;
};

const RenderAnswer = (answerObject, answer) => {
  return `<div>
      <h4>Answer</h4>
      <div>
        ${
          answerObject[answer]
            ? `<span>${answerObject[answer]}</span>`
            : `<h4>N/A</h4>`
        }
      </div>
    </div>`;
};

const RenderCheckboxAnswer = (answerObject, checkBoxObject) => {
  const { header, options, answer } = checkBoxObject;
  const selectedAnswers = answerObject[answer]?.split(",") || [];
  return `
    <div>
      <h4>${header}</h4>
      ${options
        ?.map((option) => {
          const isChecked = selectedAnswers.includes(option.value);
          return `
            <div>
              <input type="checkbox" ${isChecked ? "checked" : "disabled"} />
              <label>${option.label}</label>
            </div>
          `;
        })
        .join("")}
    </div>`;
};

const RenderElplanation = (answerObject, explanation) => {
  return `<div>
      ${
        answerObject[explanation]
          ? `<h4>Explanation</h4>
         <span>${answerObject[explanation]}</span>`
          : ``
      }
    </div>`;
};

const RenderDocuments = (answerObject, documentHeader, documentName) => {
  return `<div>
      ${
        documentHeader && answerObject["documents"]?.length > 0
          ? `<h4>${documentHeader}</h4>
        ${answerObject["documents"]
          ?.map((docListItem) => {
            if (docListItem["document_name"] === documentName) {
              return `<div><a href=${docListItem[documentName]} target='_blank'>${docListItem["file_name"]}</a></div>`;
            }
          })
          .join("")}`
          : `<h4>No Documents Uploaded</h4>`
      }
    </div>`;
};

const RenderRiskAssessmentFirstQuestion = (questionObject, answerObject) => {
  const { question1 } = questionObject;
  const { text, answer, explanation, documentHeader, documentName } = question1;
  const sequence = 1;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderElplanation(answerObject, explanation)}
  ${RenderDocuments(answerObject, documentHeader, documentName)}
  </div>`;
};

const RenderRiskAssessmentSecondQuestion = (questionObject, answerObject) => {
  const { question2 } = questionObject;
  const { text, answer, subOptions, explanation } = question2;
  const sequence = 2;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderSubOptions(subOptions)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderElplanation(answerObject, explanation)}
  </div>`;
};

const RenderInformedConsentProcessFirstQuestion = (
  questionObject,
  answerObject
) => {
  const { question1 } = questionObject;
  const { text, answer, documentHeader, documentName } = question1;
  const sequence = 1;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderDocuments(answerObject, documentHeader, documentName)}
  </div>`;
};

const RenderInformedConsentProcessSecondQuestion = (
  questionObject,
  answerObject
) => {
  const { question2 } = questionObject;
  const { text, answer } = question2;
  const sequence = 2;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  </div>`;
};

const RenderInformedConsentThirdQuestion = (questionObject, answerObject) => {
  const { question3 } = questionObject;
  const { text, answer, explanation } = question3;
  const sequence = 3;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderElplanation(answerObject, explanation)}
  </div>`;
};

const RenderInformedConsentProcessFourthQuestion = (
  questionObject,
  answerObject
) => {
  const { question4 } = questionObject;
  const { text, answer, explanation } = question4;
  const sequence = 4;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderElplanation(answerObject, explanation)}
  </div>`;
};

const RenderInformedConsentFifthQuestion = (questionObject, answerObject) => {
  const { question5 } = questionObject;
  const {
    text,
    subOptions,
    answer,
    explanation,
    documentHeader,
    documentName,
  } = question5;
  const sequence = 5;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderSubOptions(subOptions)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderElplanation(answerObject, explanation)}
  ${RenderDocuments(answerObject, documentHeader, documentName)}
  </div>`;
};

const RenderInvestigatorInstuationInfoFirstQuestion = (
  questionObject,
  answerObject
) => {
  const { question1 } = questionObject;
  const { text, answer, checkboxes, documentHeader, documentName } = question1;
  const sequence = 1;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderCheckboxAnswer(answerObject, checkboxes)}
  ${RenderDocuments(answerObject, documentHeader, documentName)}
  </div>`;
};

const RenderInvestigatorInstuationInfoSecondQuestion = (
  questionObject,
  answerObject
) => {
  const { question2 } = questionObject;
  const { text, answer, explanation, documentHeader, documentName } = question2;
  const sequence = 2;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderElplanation(answerObject, explanation)}
  ${RenderDocuments(answerObject, documentHeader, documentName)}
  </div>`;
};

const RenderInvestigatorInstuationInfoThirdQuestion = (
  questionObject,
  answerObject
) => {
  const { question3 } = questionObject;
  const { text, answer, documentHeader, documentName, subTexts, checkboxes } =
    question3;
  const firstSubText = subTexts[0];
  const secoundSubText = subTexts[1];
  const sequence = 3;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderCheckboxAnswer(answerObject, checkboxes)}
  ${RenderTextOnly(secoundSubText.text)}
  ${RenderSubTextAnswer(answerObject, secoundSubText.answer)}
  ${RenderDocuments(answerObject, documentHeader, documentName)}
  ${RenderTextOnly(firstSubText.text)}
  ${RenderSubTextAnswer(answerObject, firstSubText.answer)}
  ${RenderElplanation(answerObject, firstSubText.explanation)}
  </div>`;
};

const RenderInvestigatorInstuationInfoFourthQuestion = (
  questionObject,
  answerObject
) => {
  const { question4 } = questionObject;
  const { text, answer, explanation, documentHeader, documentName } = question4;
  const sequence = 4;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderElplanation(answerObject, explanation)}
  ${RenderDocuments(answerObject, documentHeader, documentName)}
  </div>`;
};

const RenderInvestigatorInstuationInfoFifthQuestion = (
  questionObject,
  answerObject
) => {
  const { question5 } = questionObject;
  const { text, answer, explanation } = question5;
  const sequence = 5;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderElplanation(answerObject, explanation)}
  </div>`;
};

const RenderResearchProgressInfoFirstQuestion = (
  questionObject,
  answerObject
) => {
  const { question1 } = questionObject;
  const { text, answer } = question1;
  const sequence = 1;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  </div>`;
};

const RenderResearchProgressInfoSecondQuestion = (
  questionObject,
  answerObject
) => {
  const { question2 } = questionObject;
  const { text, answer, subTexts } = question2;
  const firstSubText = subTexts[0];
  const secoundSubText = subTexts[1];
  const thirstSubtext = subTexts[2];
  const fourthSubText = subTexts[3];
  const sequence = 2;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${RenderTextOnly(firstSubText.text)}
  ${RenderSubTextAnswer(answerObject, firstSubText.answer)}
  ${
    answerObject["sub_withdrew"] >= 1 &&
    `<div>
     ${RenderTextOnly(secoundSubText.text)}
     ${RenderSubTextAnswer(answerObject, secoundSubText.answer)}
    </div>`
  }
  ${RenderTextOnly(thirstSubtext.text)}
  ${RenderSubTextAnswer(answerObject, thirstSubtext.answer)}
  ${
    answerObject["sub_terminated_before_completion"] >= 1 &&
    `<div>
     ${RenderTextOnly(fourthSubText.text)}
     ${RenderSubTextAnswer(answerObject, fourthSubText.answer)}
    </div>`
  } 
  </div>`;
};

const RenderResearchProgressInfoThirdQuestion = (
  questionObject,
  answerObject
) => {
  const { question3 } = questionObject;
  const { text, answer, subTexts, documentHeader, documentName } = question3;
  const sequence = 3;
  const firstSubText = subTexts[0];
  const secoundSubText = subTexts[1];
  const thirdSubText = subTexts[2];
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  
  ${RenderTextOnly(firstSubText.text)}
  ${RenderSubTextAnswer(answerObject, firstSubText.answer)}

  ${
    answerObject["adverse_event_submission"] === "No" &&
    `<div>
    ${RenderTextOnly(secoundSubText.text)}
    ${RenderSubTextAnswer(answerObject, secoundSubText.answer)}

    ${RenderTextOnly(thirdSubText.text)}
    ${RenderSubTextAnswer(answerObject, thirdSubText.answer)}

    ${RenderDocuments(answerObject, documentHeader, documentName)}
  </div>`
  }

  </div>`;
};

const RenderResearchProgressInfoFourthQuestion = (
  questionObject,
  answerObject
) => {
  const { question4 } = questionObject;
  const { text, answer } = question4;
  const sequence = 4;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  </div>`;
};

const RenderResearchProgressInfoFifthQuestion = (
  questionObject,
  answerObject
) => {
  const { question5 } = questionObject;
  const { text, answer, explanation, subTexts } = question5;
  const firstSubText = subTexts[0];
  const sequence = 5;
  return `<div>
  ${RenderQuestion(sequence, text)}
  ${RenderAnswer(answerObject, answer)}
  ${
    answerObject["last_approval_change"] === "Yes" &&
    `<div>
     ${RenderTextOnly(firstSubText.text)}
     ${RenderSubTextAnswer(answerObject, firstSubText.answer)}
    </div>`
  }
  ${RenderElplanation(answerObject, explanation)}
  </div>`;
};

const continuingReviewHTMLTemplate = (templateProps) => {
  const { continuingReviewQuestions } = questionsToRender;
  const {
    riskAssessment,
    informedConsentProcess,
    investigatorInstuationInfo,
    researchProgressInfo,
  } = continuingReviewQuestions;
  const {
    risk_assessment,
    informed_consent_process,
    investigator_instuation_info,
    research_progress_info,
  } = templateProps;
  const children = `
      <main>
        <h1>
          ${templateProps.headerText} (${templateProps.protocolId})
        </h1>
        <div style="page-break-after: always;">
          ${renderHeader(riskAssessment)}
          ${RenderRiskAssessmentFirstQuestion(riskAssessment, risk_assessment)}
          ${RenderRiskAssessmentSecondQuestion(riskAssessment, risk_assessment)}
        </div>

        <div style="page-break-after: always;">
          ${renderHeader(informedConsentProcess)}
          ${RenderInformedConsentProcessFirstQuestion(
            informedConsentProcess,
            informed_consent_process
          )}
          ${RenderInformedConsentProcessSecondQuestion(
            informedConsentProcess,
            informed_consent_process
          )}
          ${RenderInformedConsentThirdQuestion(
            informedConsentProcess,
            informed_consent_process
          )}
          ${RenderInformedConsentProcessFourthQuestion(
            informedConsentProcess,
            informed_consent_process
          )}
          ${RenderInformedConsentFifthQuestion(
            informedConsentProcess,
            informed_consent_process
          )}
        </div>

        <div style="page-break-after: always;">
          ${renderHeader(investigatorInstuationInfo)}
          ${RenderInvestigatorInstuationInfoFirstQuestion(
            investigatorInstuationInfo,
            investigator_instuation_info
          )}
          ${RenderInvestigatorInstuationInfoSecondQuestion(
            investigatorInstuationInfo,
            investigator_instuation_info
          )}
          ${RenderInvestigatorInstuationInfoThirdQuestion(
            investigatorInstuationInfo,
            investigator_instuation_info
          )}
          ${RenderInvestigatorInstuationInfoFourthQuestion(
            investigatorInstuationInfo,
            investigator_instuation_info
          )}
          ${RenderInvestigatorInstuationInfoFifthQuestion(
            investigatorInstuationInfo,
            investigator_instuation_info
          )}
        </div>

        <div style="page-break-after: always;">
          ${renderHeader(researchProgressInfo)}
          ${RenderResearchProgressInfoFirstQuestion(
            researchProgressInfo,
            research_progress_info
          )}
          ${RenderResearchProgressInfoSecondQuestion(
            researchProgressInfo,
            research_progress_info
          )}
          ${RenderResearchProgressInfoThirdQuestion(
            researchProgressInfo,
            research_progress_info
          )}
          ${RenderResearchProgressInfoFourthQuestion(
            researchProgressInfo,
            research_progress_info
          )}
          ${RenderResearchProgressInfoFifthQuestion(
            researchProgressInfo,
            research_progress_info
          )}
        </div>
      </main>
   `;
  return RenderBody(children);
};

const ClinicalSiteHTMLTemplate = (templateProps) => {
  const { protocolDetails } = questionsToRender;
  const { clinicalReviewQuestions } = protocolDetails;
  const {
    headerText,
    protocolId,
    protocolType,
    protocol_information,
    investigator_information,
    study_information,
    informed_consent,
    protocol_procedure,
  } = templateProps;
  const children = `<main>
      <h1>Clinical Site</h1>
    </main>`;
  return RenderBody(children);
};

const MultiSiteSponsorHTMLTemplate = (templateProps) => {
  const { protocolDetails } = questionsToRender;
  const { multiSiteSponsorQuestions } = protocolDetails;
  const {
    headerText,
    protocolId,
    protocolType,
    protocol_information,
    contact_information,
    study_information,
    informed_consent,
    protocol_procedure,
  } = templateProps;
  const children = `<main>
      <h1>Multi Site Sponsor</h1>
    </main>`;
  return RenderBody(children);
};

const PrincipalInvestigatorHTMLTemplate = (templateProps) => {
  const { protocolDetails } = questionsToRender;
  const { principalInvestigatorQuestions } = protocolDetails;
  const {
    headerText,
    protocolId,
    protocolType,
    investigator_protocol_information,
    consent_information,
  } = templateProps;
  const children = `<main>
      <h1>Principal Investigator</h1>
    </main>`;
  return RenderBody(children);
};

const protocolAmendmentRequestHTMLTemplate = {
  ClinicalSiteHTMLTemplate,
  MultiSiteSponsorHTMLTemplate,
  PrincipalInvestigatorHTMLTemplate,
};

const htmlTemplates = {
  continuingReviewHTMLTemplate,
  protocolAmendmentRequestHTMLTemplate,
};

export default htmlTemplates;
