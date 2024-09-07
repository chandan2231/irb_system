// reqreqreq { protocolId: 'IRB578940', researchType: 'Clinical Site' }
// continuinReviewDetailObj {
//   risk_assessment: {
//     id: 1,
//     protocol_id: 'IRB578940',
//     criteria_report: 'Yes',
//     criteria_report_explain: 'Since the date of the last approval, have you encountered any unanticipated problems? Unanticipated problems involve risks to subjects or others and include any incident, experience, or outcome that meets all of the following criteria:\n' +
//       '1. is unexpected (in terms of nature, severity, or frequency) given (a) the research procedures that are described in the protocol-related documents, such as the IRB-approved research protocol and informed consent document; and (b) the characteristics of the subject population being studied:\n' +
//       '2. is related or possibly related to a subject’s participation in the research; and\n' +
//       '3. suggests that the research places subjects or others at a greater risk of harm (including physical, psychological, economic, or social harm) related to the research than was previously known or recognized.',
//     irb_report: 'Yes',
//     irb_report_explain: 'Since the date of the last approval, has any regulatory agency including, but not limited to, the sponsor, statistical agency, medical monitor, data safety monitoring board (DSMB), or a data monitoring committee (DMC) provided any correspondence that has not yet been reported to the IRB?',
//     created_at: 2024-08-29T18:30:00.000Z,
//     updated_at: 2024-08-29T18:30:00.000Z,
//     created_by: 2,
//     documents: [ [Object] ]
//   },
//   informed_consent_process: {
//     id: 2,
//     protocol_id: 'IRB578940',
//     challenges_faced: 'Yes',
//     challenges_faced_explain: 'Test2',
//     changes_consent: 'Yes',
//     changes_consent_explain: 'Test2',
//     ensuring_list: 'Yes',
//     ensuring_list_explain: 'Test2',
//     icf_version: 'Test2',
//     performing_consent: 'Test2',
//     created_at: 2024-08-27T18:30:00.000Z,
//     updated_at: 2024-08-27T18:30:00.000Z,
//     created_by: '2',
//     documents: [ [Object], [Object] ]
//   },
//   investigator_instuation_info: {
//     id: 1,
//     protocol_id: 'IRB578940',
//     changes_explain: 'Please describe the changes and explain in as much detail as possible. Please provide any solutions, whether temporary or permanent, work-arounds, and/or protocol adjustments',
//     changes_law: 'Yes',
//     changes_law_explain: 'Have there been any changes to state or local law regarding research that affects the conduct of research',
//     changes_reported: 'Yes',
//     changes_reported_explain: '',
//     facility_any_changes: 'Yes',
//     facility_any_changes_explain: 'Have there been any changes in facility regulations, standard operating procedures, or standards of professional conduct?',
//     facility_change_item: '1,2,3,4,5',
//     facility_changes: 'Yes',
//     inv_or_comp: 'Yes',
//     inv_or_comp_explain: 'sdfdsfsdf',
//     inv_sit_quali: 'Yes',
//     investigator_changes: '1,2,3',
//     created_at: 2024-08-29T18:30:00.000Z,
//     updated_at: 2024-08-29T18:30:00.000Z,
//     created_by: 2,
//     documents: [ [Object], [Object], [Object], [Object] ]
//   },
//   research_progress_info: {
//     id: 2,
//     protocol_id: 'IRB578940',
//     adverse_event_explain: 'qwewqewqewq',
//     adverse_event_not_reported_explain: 'qwewqewqewq',
//     adverse_event_submission: 'No',
//     changes_not_reported_to_irb: 'qweqweqwewqewqe',
//     discontinued_subjects: 'wqewqewq',
//     last_approval_change: 'Yes',
//     last_approval_change_report: 'No',
//     occured_adverse_event: 'qweqwewq',
//     sub_terminated_before_completion: '2',
//     sub_withdrew: '2',
//     subjecte_completed: 'qwewqewqewq',
//     subjects_enrolled: 'weqwewqe',
//     termination_reason_explain: 'qwewqewqe',
//     withdrawal_reason_explain: 'wqewqewq',
//     created_at: 2024-08-03T18:30:00.000Z,
//     updated_at: 2024-08-03T18:30:00.000Z,
//     created_by: 1,
//     documents: [ [Object] ]
//   }
// }

//   <html>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Continuing Review Details (${protocolId})</h1>
//         </div>
//         <div class="content">
//           <h2>Risk Assessment</h2>
//           <table>
//             <tr>
//               <th>Question 1</th>
//               <td>${continuinReviewDetailObj.risk_assessment.irb_report}</td>
//             </tr>
//             <tr>
//               <th>Question 2</th>
//               <td>
//                 ${continuinReviewDetailObj.risk_assessment.criteria_report}
//               </td>
//             </tr>
//           </table>
//           <h2>Informed Consent Process</h2>
//           <table>
//             <tr>
//               <th>Challenges Faced</th>
//               <td>
//                 $
//                 {
//                   continuinReviewDetailObj.informed_consent_process
//                     .challenges_faced
//                 }
//               </td>
//             </tr>
//             <tr>
//               <th>Changes Consent</th>
//               <td>
//                 $
//                 {
//                   continuinReviewDetailObj.informed_consent_process
//                     .changes_consent
//                 }
//               </td>
//             </tr>
//           </table>
//           <h2>Investigator and Institution Information</h2>
//           <table>
//             <tr>
//               <th>Changes Explain</th>
//               <td>
//                 $
//                 {
//                   continuinReviewDetailObj.investigator_instuation_info
//                     .changes_explain
//                 }
//               </td>
//             </tr>
//             <tr>
//               <th>Changes Law</th>
//               <td>
//                 $
//                 {
//                   continuinReviewDetailObj.investigator_instuation_info
//                     .changes_law
//                 }
//               </td>
//             </tr>
//           </table>
//           <h2>Research Progress</h2>
//           <table>
//             <tr>
//               <th>Adverse Event Explain</th>
//               <td>
//                 $
//                 {
//                   continuinReviewDetailObj.research_progress_info
//                     .adverse_event_explain
//                 }
//               </td>
//             </tr>
//             <tr>
//               <th>Adverse Event Not Reported Explain</th>
//               <td>
//                 $
//                 {
//                   continuinReviewDetailObj.research_progress_info
//                     .adverse_event_not_reported_explain
//                 }
//               </td>
//             </tr>
//           </table>
//         </div>
//       </div>
//     </body>
//   </html>;

// let file = {
//     content: `
//         <div style='page-break-after: always;'>
//             <h3>Risk Assessment</h3>
            // <div>
            //     <h4>Question 1</h4>
            //     <br />
            //     <span>Answer One</span></h3>
            //     <h3>Question Two: <span>Answer Two</span></h3>
            //     <h3>Question Three: <span>Answer Three</span></h3>
            // </div>
//         </div>
//         <div style='page-break-after: always;'>
//             <h1 style='text-align: center'>Title of Page 2</h1>
//             <div>
//                 <h3>Question One: <span>Answer One</span></h3>
//                 <h3>Question Two: <span>Answer Two</span></h3>
//                 <h3>Question Three: <span>Answer Three</span></h3>
//             </div>
//         </div>
//     `
// };
