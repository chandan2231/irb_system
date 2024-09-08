import questionsToRender from "./constant.js";

const renderHeader = (props) => {
  const { title } = props;
  return `<h3>${title}</h3>`;
};

const RenderQuestion = (sequence, question) => {
  return `<div>
      ${sequence && `<h4>Question ${sequence}</h4>`}
      ${question.text ? `<span>${question.text}</span>` : ``}
      ${
        question.subOptions
          ? `<ul>
              ${Object.keys(question.subOptions)
                .map((key) => {
                  return `<li>${question.subOptions[key]}</li>`;
                })
                .join("")}
            </ul>`
          : ""
      }
    </div>`;
};

const RenderAnswer = (answerObject, mappedKeys) => {
  const { answer, explanation = "", pdfLink = "" } = mappedKeys;
  return `<div>
      <h4>Answer</h4>
      ${
        answerObject[answer]
          ? `<span>${answerObject[answer]}</span>`
          : `<span>No Answer Submitted</span>`
      }
      ${
        answerObject[explanation]
          ? `<h4>Explanation</h4>
             <span>${answerObject[explanation]}</span>`
          : ``
      }
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
  return `<body>
      <main>
        <h1>
          ${templateProps.headerText} (${templateProps.protocolId})
        </h1>
        <div style="page-break-after: always;">
          <div>${renderHeader(riskAssessment)}</div>  
          <div>
            ${RenderQuestion(1, riskAssessment.question1)}
            ${RenderAnswer(risk_assessment, {
              answer: "irb_report",
              explanation: "irb_report_explain",
            })}
          </div>
          <div>
            ${RenderQuestion(2, riskAssessment.question2)}
             ${RenderAnswer(risk_assessment, {
               answer: "criteria_report",
               explanation: "criteria_report_explain",
             })}
          </div>
        </div>

        <div style="page-break-after: always;">
           <div>${renderHeader(informedConsentProcess)}</div>
          <div>
            ${RenderQuestion(1, informedConsentProcess.question1)}
            ${RenderAnswer(informed_consent_process, {
              answer: "icf_version",
              pdfLink: "",
            })}
          </div>
          <div>
            ${RenderQuestion(2, informedConsentProcess.question2)}
            ${RenderAnswer(informed_consent_process, {
              answer: "performing_consent",
            })}
          </div>
          <div>
            ${RenderQuestion(3, informedConsentProcess.question3)}
            ${RenderAnswer(informed_consent_process, {
              answer: "challenges_faced",
              explanation: "challenges_faced_explain",
            })}
          </div>
          <div>
            ${RenderQuestion(4, informedConsentProcess.question4)}
            ${RenderAnswer(informed_consent_process, {
              answer: "changes_consent",
              explanation: "changes_consent_explain",
            })}
          </div>
          <div>
            ${RenderQuestion(5, informedConsentProcess.question5)}
            ${RenderAnswer(informed_consent_process, {
              answer: "ensuring_list",
              explanation: "ensuring_list_explain",
              pdfLink: "",
            })}
          </div>
        </div>

        <div style="page-break-after: always;">
          <div>${renderHeader(investigatorInstuationInfo)}</div>
          <div>
            ${RenderQuestion(1, investigatorInstuationInfo.question1)}
            ${RenderAnswer(investigator_instuation_info, {
              answer: "inv_sit_quali",
            })}
          </div>
          <div>
            ${RenderQuestion(2, investigatorInstuationInfo.question2)}
            ${RenderAnswer(investigator_instuation_info, {
              answer: "inv_or_comp",
              explanation: "inv_or_comp_explain",
            })}
          </div>
          <div>
            ${RenderQuestion(3, investigatorInstuationInfo.question3)}
            ${RenderAnswer(investigator_instuation_info, {
              answer: "facility_changes",
            })}
          </div>
          <div>
            ${RenderQuestion(4, investigatorInstuationInfo.question4)}
            ${RenderAnswer(investigator_instuation_info, {
              answer: "facility_any_changes",
              explanation: "facility_any_changes_explain",
            })}
          </div>
          <div>
            ${RenderQuestion(5, investigatorInstuationInfo.question5)}
            ${RenderAnswer(investigator_instuation_info, {
              answer: "changes_law",
              explanation: "changes_law_explain",
            })}
          </div>
        </div>

        <div style="page-break-after: always;">
          <div>${renderHeader(researchProgressInfo)}</div>
          <div>
            ${RenderQuestion(1, researchProgressInfo.question1)}
            ${RenderAnswer(research_progress_info, {
              answer: "subjects_enrolled",
            })}
          </div>
          <div>
            ${RenderQuestion(2, researchProgressInfo.question2)}
            ${RenderAnswer(research_progress_info, {
              answer: "discontinued_subjects",
            })}
          </div>
          <div>
            ${RenderQuestion(3, researchProgressInfo.question3)}
            ${RenderAnswer(research_progress_info, {
              answer: "occured_adverse_event",
            })}
          </div>
          <div>
            ${RenderQuestion(4, researchProgressInfo.question4)}
            ${RenderAnswer(research_progress_info, {
              answer: "subjecte_completed",
            })}
          </div>
          <div>
            ${RenderQuestion(5, researchProgressInfo.question5)}
            ${RenderAnswer(research_progress_info, {
              answer: "last_approval_change",
            })}
          </div>
        </div>
      </main>
    </body>`;
};

const protocolAmendmentRequestHTMLTemplate = () => {
  return `<div>Hello World</div>`;
};

const htmlTemplates = {
  continuingReviewHTMLTemplate,
  protocolAmendmentRequestHTMLTemplate,
};

export default htmlTemplates;
