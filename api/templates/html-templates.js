import questionsToRender from "./constant.js";

const renderHeader = (props) => {
  const { title } = props;
  return `<h3>${title}</h3>`;
};

const RenderQuestionAndAnswer = (sequence, question, answerObject) => {
  const {
    text,
    subOptions,
    answer,
    explanation,
    documentHeader,
    documentName,
  } = question;
  return `<div>
      <h4>Question ${sequence}</h4>
      ${text ? `<span>${text}</span>` : ``}
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
      <div>
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
          : `No Documents Uploaded`
      }
    </div>
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
            ${RenderQuestionAndAnswer(
              1,
              riskAssessment.question1,
              risk_assessment
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              2,
              riskAssessment.question2,
              risk_assessment
            )}
          </div>
        </div>

        <div style="page-break-after: always;">
           <div>${renderHeader(informedConsentProcess)}</div>
          <div>
            ${RenderQuestionAndAnswer(
              1,
              informedConsentProcess.question1,
              informed_consent_process
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              2,
              informedConsentProcess.question2,
              informed_consent_process
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              3,
              informedConsentProcess.question3,
              informed_consent_process
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              4,
              informedConsentProcess.question4,
              informed_consent_process
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              5,
              informedConsentProcess.question5,
              informed_consent_process
            )}
          </div>
        </div>

        <div style="page-break-after: always;">
          <div>${renderHeader(investigatorInstuationInfo)}</div>
          <div>
            ${RenderQuestionAndAnswer(
              1,
              investigatorInstuationInfo.question1,
              investigator_instuation_info
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              2,
              investigatorInstuationInfo.question2,
              investigator_instuation_info
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              3,
              investigatorInstuationInfo.question3,
              investigator_instuation_info
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              4,
              investigatorInstuationInfo.question4,
              investigator_instuation_info
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              5,
              investigatorInstuationInfo.question5,
              investigator_instuation_info
            )}
          </div>
        </div>

        <div style="page-break-after: always;">
          <div>${renderHeader(researchProgressInfo)}</div>
          <div>
            ${RenderQuestionAndAnswer(
              1,
              researchProgressInfo.question1,
              research_progress_info
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              2,
              researchProgressInfo.question2,
              research_progress_info
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              3,
              researchProgressInfo.question3,
              research_progress_info
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              4,
              researchProgressInfo.question4,
              research_progress_info
            )}
          </div>
          <div>
            ${RenderQuestionAndAnswer(
              5,
              researchProgressInfo.question5,
              research_progress_info
            )}
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
