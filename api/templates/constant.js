const continuingReviewQuestions = {
  riskAssessment: {
    title: `Risk Assessment`,
    question1: {
      text: `Since the date of the last approval, has any regulatory agency
                including, but not limited to, the sponsor, statistical agency,
                medical monitor, data safety monitoring board (DSMB), or a data
                monitoring committee (DMC) provided any correspondence that has
                not yet been reported to the IRB?`,
    },
    question2: {
      text: `Since the date of the last approval, have you encountered any
                unanticipated problems? Unanticipated problems involve risks to
                subjects or others and include any incident, experience, or
                outcome that meets all of the following criteria:`,
      subOptions: {
        option1: `1. is unexpected (in terms of nature, severity, or frequency)
                  given (a) the research procedures that are described in the
                  protocol-related documents, such as the IRB-approved research
                  protocol and informed consent document; and (b) the
                  characteristics of the subject population being studied:`,
        option2: `2. is related or possibly related to a subject’s participation
                  in the research; and`,
        option3: `3. suggests that the research places subjects or others at a
                  greater risk of harm (including physical, psychological,
                  economic, or social harm) related to the research than was
                  previously known or recognized.`,
      },
    },
  },
  informedConsentProcess: {
    title: `Informed Consent Process`,
    question1: {
      text: `Which version of the ICF are you currently using?`,
    },
    question2: {
      text: `Who is performing the informed consent at your site?`,
    },
    question3: {
      text: `Have there been any challenges faced to the consenting process?`,
    },
    question4: {
      text: `Have there been any changes to the consent form that have not been
                reported to the IRB?`,
    },
    question5: {
      text: `Are you ensuring that:`,
      subOptions: {
        option1: `1. The participants are made aware that their participation is
                  voluntary and that they may choose to withdraw at any time?`,
        option2: `2. The participants are provided with a copy of the informed
                  consent form to take home?`,
        option3: `3. The participants are provided with the most up-to-date
                  contact information for study staff?`,
        option4: `4. The investigator is providing the most current information
                  regarding the study that may affect the participants’
                  willingness to participate in the study?`,
        option5: `5. All participants have been consented or re-consented, where
                  necessary, with the most current approved informed consent form?`,
      },
    },
  },
  investigatorInstuationInfo: {
    title: `Investigator and Institution Information`,
    question1: {
      text: `Have there been any changes in the investigator’s situation or
                qualifications?`,
    },
    question2: {
      text: `Have there been any investigation of or complaints related to the
                investigator’s conduct of research?`,
    },
    question3: {
      text: `Have there been any changes in the facility’s ability to
                adequately support the research protocol?`,
    },
    question4: {
      text: `Have there been any changes in facility regulations, standard
                operating procedures, or standards of professional conduct?`,
    },
    question5: {
      text: `Have there been any changes to state or local law regarding
                research that affects the conduct of research?`,
    },
  },
  researchProgressInfo: {
    title: `Research Progress`,
    question1: {
      text: `Total Subjects Enrolled`,
    },
    question2: {
      text: `How many subjects have discontinued their participation?`,
    },
    question3: {
      text: `How many adverse events have occurred since the last approval?`,
    },
    question4: {
      text: `How many subject have completed the study per protocol?`,
    },
    question5: {
      text: `Have there been any updates/changes to the protocol since the last
                approval?`,
    },
  },
};

const protocolDetails = {};

const questionsToRender = {
  continuingReviewQuestions,
  protocolDetails,
};

export default questionsToRender;
