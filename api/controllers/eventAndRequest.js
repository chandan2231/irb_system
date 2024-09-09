import { db } from "../connect.js"

export const saveStudyCloseoutRequest = (req, res) => {
    // console.log('req.body', req.body)
    // return;
    var datetime = new Date();
    const que = 'insert into study_closeout_request (`protocol_id`, `protocol_number`, `pi_name`,  `study_completion_date`, `study_closeout_reason`,`study_closeout_reason_other`,`subject_enrolled_number`,`subject_withdrew_number`,`subject_withdrew_by_other`,`subject_fails`,`subject_lost_followup`,`subject_completed`,`subject_complaints_review`,`subject_complaints_review_explain`,`not_reported_irb`,`not_reported_irb_explain`,`promptly_reportable_info`,`adverse_event_info`,`your_name`,`created_by`,`created_at`,`updated_at`) value (?)';
    const values = [
        req.body.protocol_id, 
        req.body.protocol_number, 
        req.body.pi_name, 
        req.body.study_completion_date, 
        req.body.study_closeout_reason,
        req.body.study_closeout_reason_other,
        req.body.subject_enrolled_number,
        req.body.subject_withdrew_number,
        req.body.subject_withdrew_by_other,
        req.body.subject_fails,
        req.body.subject_lost_followup,
        req.body.subject_completed,
        req.body.subject_complaints_review,
        req.body.subject_complaints_review_explain,
        req.body.not_reported_irb,
        req.body.not_reported_irb_explain,
        req.body.promptly_reportable_info,
        req.body.adverse_event_info,
        req.body.your_name,
        req.body.created_by,
        datetime.toISOString().slice(0,10),
        datetime.toISOString().slice(0,10),
        
    ];
    db.query(que, [values], (err, data) =>{
        if (err) {
            let result = {}
            result.status = 500
            result.msg = err
            return res.json(result)
        } else {
            let result = {}
            result.status = 200
            result.msg = 'Study Closeout Request has been saved successfully'
            return res.json(result)
        }
    }) 
}

export const savePromptlyReportableEvent = (req, res) => {
    // console.log(req.body)
    // return
    var datetime = new Date();
    const que = 'insert into promptly_reportable_event (`protocol_id`, `submitter_type`, `irb_protocol_number`, `sponsor_name`, `described_category`, `described_category_explain`, `involved_subject`, `date_problem_discovered`,`date_of_occurrence`, `date_reported_to_sponsor`, `describe_problem`, `action_taken`, `plan_action_taken`, `subject_harmed`, `protocol_change`,`question_not_covered`,`person_name`,`email`,`phone`,`your_name`,`created_by`, `created_at`, `updated_at`) value (?)';
    const values = [
        req.body.protocol_id, 
        req.body.submitter_type, 
        req.body.irb_protocol_number,
        req.body.sponsor_name, 
        req.body.described_category, 
        req.body.described_category_explain,
        req.body.involved_subject,
        req.body.date_problem_discovered,
        req.body.date_of_occurrence,
        req.body.date_reported_to_sponsor,
        req.body.describe_problem,
        req.body.action_taken,
        req.body.plan_action_taken,
        req.body.subject_harmed,
        req.body.protocol_change,
        req.body.question_not_covered,
        req.body.person_name,
        req.body.email,
        req.body.phone,
        req.body.your_name,
        req.body.created_by,
        datetime.toISOString().slice(0,10),
        datetime.toISOString().slice(0,10),
    ];
    db.query(que, [values], (err, data) =>{
        if (err) {
            let result = {}
            result.status = 500
            result.msg = err
            return res.json(result)
        } else {
            let result = {}
            result.status = 200
            result.msg = 'Protocol Reportable Event has been saved successfully'
            return res.json(result)
        }
    }) 
}

export const saveProtocolAmendmentRequest = (req, res) => {
    var datetime = new Date();
    const que = 'insert into informed_consent_process (`protocol_id`, `challenges_faced`, `challenges_faced_explain`, `changes_consent`, `changes_consent_explain`, `ensuring_list`, `ensuring_list_explain`, `icf_version`,`performing_consent`, `created_at`, `updated_at`,`created_by`) value (?)';
    const values = [
        req.body.protocol_id, 
        req.body.challenges_faced, 
        req.body.challenges_faced_explain, 
        req.body.changes_consent, 
        req.body.changes_consent_explain,
        req.body.ensuring_list,
        req.body.ensuring_list_explain,
        req.body.icf_version,
        req.body.performing_consent,
        datetime.toISOString().slice(0,10),
        datetime.toISOString().slice(0,10),
        req.body.created_by,
    ];
    db.query(que, [values], (err, data) =>{
        if (err) {
            return res.status(500).json(err)
        } else {
            let result = {}
            result.status = 200
            result.msg = 'Informed Consent Process has been saved successfully'
            return res.json(result)
        }
    }) 
    
}


export const saveAdverseEvent = (req, res) => {
    console.log(req.body)
    // return
    var datetime = new Date();
    const que = 'insert into adverse_event (`protocol_id`, `protocol_number`, `adverse_event_criteria`, `participant_id_number`, `event_start_date`, `event_end_date`, `event_aware_date`, `irb_report_date`,`severity_level`, `unexpected_event`, `unexpected_event_explain`, `event_nature`, `date_of_death`, `event_nature_explain`, `event_description`,`event_study_relationship`,`study_discontinued`,`study_discontinued_explain`,`person_name`,`email`,`phone`,`your_name`,`created_by`,`created_at`,`updated_at`) value (?)';
    const values = [
        req.body.protocol_id, 
        req.body.protocol_number, 
        req.body.adverse_event_criteria, 
        req.body.participant_id_number, 
        req.body.event_start_date,
        req.body.event_end_date,
        req.body.event_aware_date,
        req.body.irb_report_date,
        req.body.severity_level,
        req.body.unexpected_event,
        req.body.unexpected_event_explain,
        req.body.event_nature,
        req.body.date_of_death,
        req.body.event_nature_explain,
        req.body.event_description,
        req.body.event_study_relationship,
        req.body.study_discontinued,
        req.body.study_discontinued_explain,
        req.body.person_name,
        req.body.email,
        req.body.phone,
        req.body.your_name,
        req.body.created_by,
        datetime.toISOString().slice(0,10),
        datetime.toISOString().slice(0,10),
    ];
    db.query(que, [values], (err, data) =>{
        if (err) {
            let result = {}
            result.status = 500
            result.msg = err
            return res.json(result)
        } else {
            let result = {}
            result.status = 200
            result.msg = 'Advers Event has been saved successfully'
            return res.json(result)
        }
    }) 
}
