import { db } from "../connect.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



export const saveProtocolInfo = (req, res) => {
    // console.log('req', req)
    // console.log('res', res)
    // return;
    const que = 'insert into protocol_information (`protocol_id`,`protocol_title`, `protocol_number`, `study_duration`,  `sponsor`, `disapproved_or_withdrawn`, `disapproved_or_withdrawn_explain`, `first_time_protocol`,`funding_source`,`oversite`,`oversite_explain`, `created_by`) value (?)';
    const values = [
        req.body.protocol_id,
        req.body.protocol_title, 
        req.body.protocol_number, 
        req.body.study_duration, 
        req.body.sponsor, 
        req.body.disapproved_or_withdrawn,
        req.body.disapproved_or_withdrawn_explain,
        req.body.first_time_protocol,
        req.body.funding_source,
        req.body.oversite,
        req.body.oversite_explain,
        req.body.created_by,
    ];
    db.query(que, [values], (err, data) =>{
        if (err) return res.status(500).json(err)
        return res.status(200).json('Protocol Information has been saved successfully.')
    }) 
}

export const saveInvestigatorInfo = (req, res) => {
    // console.log('req', req)
    // console.log('res', res)
    // return;
    const que = 'insert into investigator_information (`protocol_id`,`fda_audit`,`fda_audit_explain`,`fwa_number`,`investigator_email`,`investigator_name`,`investigator_research_number`,`investigators_npi`,`involved_years`,`pending_or_active_research`,`pending_or_active_research_explain`,`primary_contact`,`primary_contact_email`,`site_fwp`,`sub_investigator_email`,`sub_investigator_name`,`training_completed`,`training_completed_explain`,`created_by`) value (?)';
    const values = [
        req.body.protocol_id,
        req.body.fda_audit, 
        req.body.fda_audit_explain, 
        req.body.fwa_number, 
        req.body.investigator_email, 
        req.body.investigator_name,
        req.body.investigator_research_number,
        req.body.investigators_npi,
        req.body.involved_years,
        req.body.pending_or_active_research,
        req.body.pending_or_active_research_explain,
        req.body.primary_contact,
        req.body.primary_contact_email,
        req.body.site_fwp,
        req.body.sub_investigator_email,
        req.body.sub_investigator_name,
        req.body.training_completed.toString(),
        req.body.training_completed_explain,
        req.body.created_by,
    ];
    db.query(que, [values], (err, data) =>{
        if (err) return res.status(500).json(err)
        return res.status(200).json('Investigator Information has been saved successfully.')
    }) 
}

export const saveStydyInfo = (req, res) => {
    const que = 'insert into study_information (`protocol_id`,`research_type`,`research_type_explain`,`created_by`) value (?)';
    const values = [
        req.body.protocol_id,
        req.body.research_type, 
        req.body.research_type_explain,
        req.body.created_by,
    ];
    db.query(que, [values], (err, data) =>{
        if (err) return res.status(500).json(err)
        return res.status(200).json('Study Information has been saved successfully.')
    }) 
}

export const saveInformedInfo = (req, res) => {
    const que = 'insert into informed_consent (`protocol_id`,`consent_type`,`include_icf`,`no_consent_explain`,`other_language_selection`,`participation_compensated`,`professional_translator`,`professional_translator_explain`, `created_by`) value (?)';
    const values = [
        req.body.protocol_id, 
        req.body.consent_type.toString(), 
        req.body.include_icf,
        req.body.no_consent_explain, 
        req.body.other_language_selection, 
        req.body.participation_compensated, 
        req.body.professional_translator, 
        req.body.professional_translator_explain,
        req.body.created_by,
    ];
    db.query(que, [values], (err, data) =>{
        if (err) return res.status(500).json(err)
        return res.status(200).json('Informed Consent has been saved successfully.')
    }) 
}

export const saveProtocolProceduresInfo = (req, res) => {
    const que = 'insert into protocol_procedure (`protocol_id`,`enrolled_group`,`enrolled_group_explain`,`enrolled_study_type`,`enrolled_subject`,`enrolled_type_explain`,`future_research`,`future_research_explain`,`recurement_method`,`recurement_method_explain`,`research_place_name_address`,`study_excluded`,`study_excluded_explain`,`created_by`) value (?)';
    const values = [
        req.body.protocol_id, 
        req.body.enrolled_group.toString(), 
        req.body.enrolled_group_explain, 
        req.body.enrolled_study_type.toString(), 
        req.body.enrolled_subject, 
        req.body.enrolled_type_explain, 
        req.body.future_research, 
        req.body.future_research_explain,
        req.body.recurement_method.toString(), 
        req.body.recurement_method_explain, 
        req.body.research_place_name_address, 
        req.body.study_excluded, 
        req.body.study_excluded_explain,
        req.body.created_by,
    ];
    db.query(que, [values], (err, data) =>{
        if (err) return res.status(500).json(err)
        return res.status(200).json('Protocol Procedure has been saved successfully.')
    }) 
}

export const saveContactInfo = (req, res) => {
    const que = 'insert into contact_information (`protocol_id`,`name`,`title`,`company_name`,`address`,`city`,`state`,`zip_code`,`country`,`phone_number`,`email`,`secondary_contact_name`,`secondary_contact_title`,`secondary_contact_phone_number`,`secondary_contact_email`,`created_by`) value (?)';
    const values = [
        req.body.protocol_id, 
        req.body.name,
        req.body.title, 
        req.body.company_name, 
        req.body.address, 
        req.body.city, 
        req.body.state,
        req.body.zip_code, 
        req.body.country, 
        req.body.phone_number, 
        req.body.email, 
        req.body.secondary_contact_name,
        req.body.secondary_contact_title,
        req.body.secondary_contact_phone_number,
        req.body.secondary_contact_email,
        req.body.created_by,
    ];
    db.query(que, [values], (err, data) =>{
        if (err) return res.status(500).json(err)
        return res.status(200).json('Contact Information has been saved successfully.')
    }) 
}