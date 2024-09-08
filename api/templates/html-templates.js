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
            <h4>Answer</h4>
          </div>
          <div>
            ${RenderQuestion(2, riskAssessment.question2)}
          </div>
        </div>

        <div style="page-break-after: always;">
           <div>${renderHeader(informedConsentProcess)}</div>
          <div>
            ${RenderQuestion(1, informedConsentProcess.question1)}
          </div>
          <div>
            ${RenderQuestion(2, informedConsentProcess.question2)}
          </div>
          <div>
            ${RenderQuestion(3, informedConsentProcess.question3)}
          </div>
          <div>
            ${RenderQuestion(4, informedConsentProcess.question4)}
          </div>
          <div>
            ${RenderQuestion(5, informedConsentProcess.question5)}
          </div>
        </div>

        <div style="page-break-after: always;">
          <div>${renderHeader(investigatorInstuationInfo)}</div>
          <div>
            ${RenderQuestion(1, investigatorInstuationInfo.question1)}
          </div>
          <div>
            ${RenderQuestion(2, investigatorInstuationInfo.question2)}
          </div>
          <div>
            ${RenderQuestion(3, investigatorInstuationInfo.question3)}
          </div>
          <div>
            ${RenderQuestion(4, investigatorInstuationInfo.question4)}
          </div>
          <div>
            ${RenderQuestion(5, investigatorInstuationInfo.question5)}
          </div>
        </div>

        <div style="page-break-after: always;">
          <div>${renderHeader(researchProgressInfo)}</div>
          <div>
            ${RenderQuestion(1, researchProgressInfo.question1)}
          </div>
          <div>
            ${RenderQuestion(2, researchProgressInfo.question2)}
          </div>
          <div>
            ${RenderQuestion(3, researchProgressInfo.question3)}
          </div>
          <div>
            ${RenderQuestion(4, researchProgressInfo.question4)}
          </div>
          <div>
            ${RenderQuestion(5, researchProgressInfo.question5)}
          </div>
        </div>
      </main>
    </body>`;
};

const htmlTemplates = {
  continuingReviewHTMLTemplate,
};

export default htmlTemplates;
