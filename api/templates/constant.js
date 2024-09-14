const continuingReviewQuestions = {
  riskAssessment: {
    title: `Risk Assessment`,
    question1: {
      text: `Since the date of the last approval, has any regulatory agency
                including, but not limited to, the sponsor, statistical agency,
                medical monitor, data safety monitoring board (DSMB), or a data
                monitoring committee (DMC) provided any correspondence that has
                not yet been reported to the IRB?`,
      answer: "irb_report",
      explanation: "irb_report_explain",
      documentHeader: "Uploaded supporting documents",
      documentName: "supporting_document",
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
      answer: "criteria_report",
      explanation: "criteria_report_explain",
    },
  },
  informedConsentProcess: {
    title: `Informed Consent Process`,
    question1: {
      text: `Which version of the ICF are you currently using?`,
      answer: "icf_version",
      documentHeader: "Uploaded the most recent ICF",
      documentName: "icf_file",
    },
    question2: {
      text: `Who is performing the informed consent at your site?`,
      answer: "performing_consent",
    },
    question3: {
      text: `Have there been any challenges faced to the consenting process?`,
      answer: "challenges_faced",
      explanation: "challenges_faced_explain",
    },
    question4: {
      text: `Have there been any changes to the consent form that have not been
                reported to the IRB?`,
      answer: "changes_consent",
      explanation: "changes_consent_explain",
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
      answer: "ensuring_list",
      explanation: "ensuring_list_explain",
      documentHeader: "Uploaded new informed consent form",
      documentName: "consent_form",
    },
  },
  investigatorInstuationInfo: {
    title: `Investigator and Institution Information`,
    question1: {
      text: `Have there been any changes in the investigator’s situation or
                qualifications?`,
      answer: "inv_sit_quali",
      checkboxes: {
        header: "Mark all that apply",
        answer: "investigator_changes",
        options: [
          { label: "suspension of hospital privileges", value: "1" },
          { label: "change in medical license status", value: "2" },
          {
            label:
              "increase in number of research studies conducted by the investigator",
            value: "3",
          },
          {
            label: "expired or updated human research protections training",
            value: "4",
          },
        ],
      },
      documentHeader: "Uploaded supporting documents here",
      documentName: "q1_supporting_documents",
    },
    question2: {
      text: `Have there been any investigation of or complaints related to the
                investigator’s conduct of research?`,
      answer: "inv_or_comp",
      explanation: "inv_or_comp_explain",
      documentHeader: "Uploaded supporting documents here",
      documentName: "q2_supporting_documents",
    },
    question3: {
      text: `Have there been any changes in the facility’s ability to
                adequately support the research protocol?`,
      answer: "facility_changes",
      checkboxes: {
        header: "Mark all that apply",
        answer: "facility_change_item",
        options: [
          { label: "Personnel changes", value: "1" },
          { label: "Financial resource changes", value: "2" },
          { label: "Change in facility address", value: "3" },
          {
            label:
              "Change in facility resources (ie: loss of laboratory space or licensure, loss of adequate storage space, structural damage or changes to the physical facility)",
            value: "4",
          },
          { label: "Other", value: "5" },
        ],
      },
      documentHeader: `Uploaded supporting documents here if applicable
(ie: new informed consent with facility address change, updated protocol to reflect facility changes, updated delegation of authority log, etc.)`,
      documentName: "q3_supporting_documents",
      subTexts: [
        {
          text: "Have these changes been reported to the IRB?",
          answer: "changes_reported",
          explanation: "changes_reported_explain",
        },
        {
          text: "Please describe the changes and explain in as much detail as possible. Please provide any solutions, whether temporary or permanent, work-arounds, and/or protocol adjustments",
          answer: "changes_explain",
        },
      ],
    },
    question4: {
      text: `Have there been any changes in facility regulations, standard
                operating procedures, or standards of professional conduct?`,
      answer: "facility_any_changes",
      explanation: "facility_any_changes_explain",
      documentHeader: "Uploaded supporting documents here",
      documentName: "q4_supporting_documents",
    },
    question5: {
      text: `Have there been any changes to state or local law regarding
                research that affects the conduct of research?`,
      answer: "changes_law",
      explanation: "changes_law_explain",
    },
  },
  researchProgressInfo: {
    title: `Research Progress`,
    question1: {
      text: `Total Subjects Enrolled`,
      answer: "subjects_enrolled",
    },
    question2: {
      text: `How many subjects have discontinued their participation?`,
      answer: "discontinued_subjects",
      subTexts: [
        {
          text: "Out of that number, how many subjects withdrew of their own accord",
          answer: "sub_withdrew",
        },
        {
          text: "Describe the reasons for withdrawal",
          answer: "withdrawal_reason_explain",
        },
        {
          text: "how many subjects were terminated before completion of the protocol by the decision of the PI, Sponsor, or other contracted research personnel",
          answer: "sub_terminated_before_completion",
        },
        {
          text: "Describe the reasons for termination ",
          answer: "termination_reason_explain",
        },
      ],
    },
    question3: {
      text: `How many adverse events have occurred since the last approval?`,
      answer: "occured_adverse_event",
      subTexts: [
        {
          text: "Have these events been reported to the IRB?",
          answer: "adverse_event_submission",
        },
        {
          text: "What was the reason the adverse events were not reported to the IRB?",
          answer: "adverse_event_not_reported_explain",
        },
        {
          text: "Please describe the adverse events including what occurred, the timeline in which it occurred, and the time at which the study personnel became aware of the adverse event",
          answer: "adverse_event_explain",
        },
      ],
      documentHeader: "Uploaded any supporting documents",
      documentName: "q3_supporting_documents",
    },
    question4: {
      text: `How many subject have completed the study per protocol?`,
      answer: "subjecte_completed",
    },
    question5: {
      text: `Have there been any updates/changes to the protocol since the last
                approval?`,
      answer: "last_approval_change",
      subTexts: [
        {
          text: "Have these changes been reported to the IRB?",
          answer: "last_approval_change_report",
        },
      ],
      explanation: "changes_not_reported_to_irb",
    },
  },
};

const clinicalReviewQuestions = {};

const multiSiteSponsorQuestions = {};

const principalInvestigatorQuestions = {};

const protocolDetails = {
  clinicalReviewQuestions,
  multiSiteSponsorQuestions,
  principalInvestigatorQuestions,
};

const questionsToRender = {
  continuingReviewQuestions,
  protocolDetails,
};

export default questionsToRender;
