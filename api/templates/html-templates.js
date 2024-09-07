const continuingReviewHTMLTemplate = (templateProps) => {
  return `<body>
      <main>
        <h1>
          ${templateProps.headerText} (${templateProps.protocolId})
        </h1>
        <div style="page-break-after: always;">
          <h3>Risk Assessment</h3>
          <div>
            <h4>Question 1</h4>
            <span>
              Since the date of the last approval, has any regulatory agency
              including, but not limited to, the sponsor, statistical agency,
              medical monitor, data safety monitoring board (DSMB), or a data
              monitoring committee (DMC) provided any correspondence that has
              not yet been reported to the IRB?
            </span>
          </div>
          <div>
            <h4>Question 2</h4>
            <span>
              Since the date of the last approval, have you encountered any
              unanticipated problems? Unanticipated problems involve risks to
              subjects or others and include any incident, experience, or
              outcome that meets all of the following criteria:{" "}
            </span>
            <ul>
              <li>
                1. is unexpected (in terms of nature, severity, or frequency)
                given (a) the research procedures that are described in the
                protocol-related documents, such as the IRB-approved research
                protocol and informed consent document; and (b) the
                characteristics of the subject population being studied:
              </li>
              <li>
                2. is related or possibly related to a subject’s participation
                in the research; and
              </li>
              <li>
                3. suggests that the research places subjects or others at a
                greater risk of harm (including physical, psychological,
                economic, or social harm) related to the research than was
                previously known or recognized.
              </li>
            </ul>
          </div>
        </div>

        <div style="page-break-after: always;">
          <h3>Informed Consent Process</h3>
          <div>
            <h4>Question 1</h4>
            <span>Which version of the ICF are you currently using?</span>
          </div>
          <div>
            <h4>Question 2</h4>
            <span>Who is performing the informed consent at your site?</span>
          </div>
          <div>
            <h4>Question 3</h4>
            <span>
              Have there been any challenges faced to the consenting process?
            </span>
          </div>
          <div>
            <h4>Question 4</h4>
            <span>
              Have there been any changes to the consent form that have not been
              reported to the IRB?
            </span>
          </div>
          <div>
            <h4>Question 5</h4>
            <span>Are you ensuring that:</span>
            <ul>
              <li>
                1. The participants are made aware that their participation is
                voluntary and that they may choose to withdraw at any time?
              </li>
              <li>
                2. The participants are provided with a copy of the informed
                consent form to take home?
              </li>
              <li>
                3. The participants are provided with the most up-to-date
                contact information for study staff?
              </li>
              <li>
                4. The investigator is providing the most current information
                regarding the study that may affect the participants’
                willingness to participate in the study?{" "}
              </li>
              <li>
                5. All participants have been consented or re-consented, where
                necessary, with the most current approved informed consent form?
              </li>
            </ul>
          </div>
        </div>

        <div style="page-break-after: always;">
          <h3>Investigator and Institution Information</h3>
          <div>
            <h4>Question 1</h4>
            <span>
              Have there been any changes in the investigator’s situation or
              qualifications?
            </span>
          </div>
          <div>
            <h4>Question 2</h4>
            <span>
              Have there been any investigation of or complaints related to the
              investigator’s conduct of research?
            </span>
          </div>
          <div>
            <h4>Question 3</h4>
            <span>
              Have there been any changes in the facility’s ability to
              adequately support the research protocol?
            </span>
          </div>
          <div>
            <h4>Question 4</h4>
            <span>
              Have there been any changes in facility regulations, standard
              operating procedures, or standards of professional conduct?
            </span>
          </div>
          <div>
            <h4>Question 5</h4>
            <span>
              Have there been any changes to state or local law regarding
              research that affects the conduct of research?
            </span>
          </div>
        </div>

        <div style="page-break-after: always;">
          <h3>Research Progress</h3>
          <div>
            <h4>Question 1</h4>
            <span>Total Subjects Enrolled</span>
          </div>
          <div>
            <h4>Question 2</h4>
            <span>
              How many subjects have discontinued their participation?
            </span>
          </div>
          <div>
            <h4>Question 3</h4>
            <span>
              How many adverse events have occurred since the last approval?
            </span>
          </div>
          <div>
            <h4>Question 4</h4>
            <span>How many subject have completed the study per protocol?</span>
          </div>
          <div>
            <h4>Question 5</h4>
            <span>
              Have there been any updates/changes to the protocol since the last
              approval?
            </span>
          </div>
        </div>
      </main>
    </body>`;
};

const htmlTemplates = {
  continuingReviewHTMLTemplate,
};

export default htmlTemplates;
