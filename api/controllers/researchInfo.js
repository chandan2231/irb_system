import { db } from '../connect.js'

export const saveProtocolInfo = (req, res) => {
  const selectQue = 'select * from protocol_information where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateQuery = `UPDATE protocol_information 
                SET protocol_title=?, 
                    protocol_number=?, 
                    study_duration=?,  
                    sponsor=?, 
                    disapproved_or_withdrawn=?, 
                    disapproved_or_withdrawn_explain=?, 
                    first_time_protocol=?, 
                    funding_source=?, 
                    oversite=?, 
                    oversite_explain=?, 
                    created_by=? 
                WHERE protocol_id=?`

      const updateValues = [
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
        req.body.protocol_id
      ]
      db.query(updateQuery, updateValues, (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Protocol Information has been updated successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into protocol_information (`protocol_id`,`protocol_title`, `protocol_number`, `study_duration`,  `sponsor`, `disapproved_or_withdrawn`, `disapproved_or_withdrawn_explain`, `first_time_protocol`,`funding_source`,`oversite`,`oversite_explain`, `created_by`) value (?)'
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
        req.body.created_by
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Protocol Information has been saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const saveInvestigatorInfo = (req, res) => {
  const selectQue =
    'select * from investigator_information where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateQuery = `UPDATE investigator_information 
                SET fda_audit=?,
                fda_audit_explain=?,
                fwa_number=?,
                investigator_email=?,
                investigator_name=?,
                investigator_research_number=?,
                investigators_npi=?,
                involved_years=?,
                pending_or_active_research=?,
                pending_or_active_research_explain=?,
                primary_contact=?,
                primary_contact_email=?,
                site_fwp=?,
                sub_investigator_email=?,
                sub_investigator_name=?,
                training_completed=?,
                training_completed_explain=?,
                created_by=?
                WHERE protocol_id=?`

      const updateValues = [
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
        req.body.protocol_id
      ]
      db.query(updateQuery, updateValues, (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Investigator Information has been updated successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into investigator_information (`protocol_id`,`fda_audit`,`fda_audit_explain`,`fwa_number`,`investigator_email`,`investigator_name`,`investigator_research_number`,`investigators_npi`,`involved_years`,`pending_or_active_research`,`pending_or_active_research_explain`,`primary_contact`,`primary_contact_email`,`site_fwp`,`sub_investigator_email`,`sub_investigator_name`,`training_completed`,`training_completed_explain`,`created_by`) value (?)'
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
        req.body.created_by
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Investigator Information has been saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const saveStydyInfo = (req, res) => {
  const selectQue = 'select * from study_information where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateQuery = `UPDATE study_information 
            SET research_type=?,
                research_type_explain=?,
                created_by=?
            WHERE protocol_id=?`

      const updateValues = [
        req.body.research_type,
        req.body.research_type_explain,
        req.body.created_by,
        req.body.protocol_id
      ]
      db.query(updateQuery, updateValues, (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Study Information has been updated successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into study_information (`protocol_id`,`research_type`,`research_type_explain`,`created_by`) value (?)'
      const values = [
        req.body.protocol_id,
        req.body.research_type,
        req.body.research_type_explain,
        req.body.created_by
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Study Information has been saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const saveInformedInfo = (req, res) => {
  const selectQue = 'select * from informed_consent where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateQuery = `UPDATE informed_consent 
                SET consent_type=?,
                include_icf=?,
                no_consent_explain=?,
                other_language_selection=?,
                participation_compensated=?,
                professional_translator=?,
                professional_translator_explain=?, 
                created_by=?
            WHERE protocol_id=?`
      const updateValues = [
        req.body.consent_type.toString(),
        req.body.include_icf,
        req.body.no_consent_explain,
        req.body.other_language_selection,
        req.body.participation_compensated,
        req.body.professional_translator,
        req.body.professional_translator_explain,
        req.body.created_by,
        req.body.protocol_id
      ]
      db.query(updateQuery, updateValues, (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Informed Consent has been updated successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into informed_consent (`protocol_id`,`consent_type`,`include_icf`,`no_consent_explain`,`other_language_selection`,`participation_compensated`,`professional_translator`,`professional_translator_explain`, `created_by`) value (?)'
      const values = [
        req.body.protocol_id,
        req.body.consent_type.toString(),
        req.body.include_icf,
        req.body.no_consent_explain,
        req.body.other_language_selection,
        req.body.participation_compensated,
        req.body.professional_translator,
        req.body.professional_translator_explain,
        req.body.created_by
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Informed Consent has been saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const saveProtocolProceduresInfo = (req, res) => {
  const selectQue = 'select * from protocol_procedure where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateQuery = `UPDATE protocol_procedure 
                SET enrolled_group=?,
                enrolled_group_explain=?,
                enrolled_study_type=?,
                enrolled_subject=?,
                enrolled_type_explain=?,
                future_research=?,
                future_research_explain=?,
                recurement_method=?,
                recurement_method_explain=?,
                research_place_name_address=?,
                study_excluded=?,
                study_excluded_explain=?,
                created_by=?
                WHERE protocol_id=?`

      const updateValues = [
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
        req.body.protocol_id
      ]
      db.query(updateQuery, updateValues, (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Protocol Procedure has been updated successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into protocol_procedure (`protocol_id`,`enrolled_group`,`enrolled_group_explain`,`enrolled_study_type`,`enrolled_subject`,`enrolled_type_explain`,`future_research`,`future_research_explain`,`recurement_method`,`recurement_method_explain`,`research_place_name_address`,`study_excluded`,`study_excluded_explain`,`created_by`) value (?)'
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
        req.body.created_by
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Protocol Procedure has been saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const saveContactInfo = (req, res) => {
  const selectQue = 'select * from contact_information where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateQuery = `UPDATE contact_information 
                SET title=?,
                    company_name=?,
                    address=?,
                    city=?,
                    state=?,
                    zip_code=?,
                    country=?,
                    phone_number=?,
                    email=?,
                    secondary_contact_name=?,
                    secondary_contact_title=?,
                    secondary_contact_phone_number=?,
                    secondary_contact_email=?,
                    created_by
                WHERE protocol_id=?`
      const updateValues = [
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
        req.body.protocol_id
      ]
      db.query(updateQuery, updateValues, (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Contact Information has been updated successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into contact_information (`protocol_id`,`name`,`title`,`company_name`,`address`,`city`,`state`,`zip_code`,`country`,`phone_number`,`email`,`secondary_contact_name`,`secondary_contact_title`,`secondary_contact_phone_number`,`secondary_contact_email`,`created_by`) value (?)'
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
        req.body.created_by
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Contact Information has been saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const saveInvestigatorAndProtocolInformation = (req, res) => {
  var datetime = new Date()
  const selectQue =
    'select * from investigator_protocol_information where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateQuery = `UPDATE investigator_protocol_information 
                SET investigator_name=?,
                    investigator_email=?,
                    sub_investigator_name=?,
                    sub_investigator_email=?,
                    additional_study_name=?,
                    additional_study_email=?,
                    site_name=?,
                    site_address=?,
                    more_site=?,
                    site_name_address=?,
                    protocol_title=?,
                    protocol_number=?,
                    study_criteria=?,
                    subject_number=?,
                    site_number=?,
                    disapproved_or_withdrawn=?,
                    disapproved_or_withdrawn_explain=?,
                    oversite=?,
                    oversite_explain=?,
                    immediate_family=?,
                    immediate_family_explain=?,
                    stock_ownership=?,
                    stock_ownership_explain=?,
                    property_interest=?,
                    property_interest_explain=?,
                    financial_agreement=?,
                    financial_agreement_explain=?,
                    server_position=?,
                    server_position_explain=?,
                    influence_conduct=?,
                    influence_conduct_explain=?,
                    interest_conflict=?,
                    interest_conflict_explain=?,
                    fda_audit=?,
                    fda_audit_explain=?,
                    involved_years=?,
                    investigators_npi=?,
                    training_completed=?,
                    training_completed_explain=?,
                    investigator_research_number=?,
                    pending_or_active_research=?,
                    pending_or_active_research_explain=?,
                    created_by=?
                WHERE protocol_id=?`

      const updateValues = [
        req.body.investigator_name,
        req.body.investigator_email,
        req.body.sub_investigator_name,
        req.body.sub_investigator_email,
        req.body.additional_study_name,
        req.body.additional_study_email,
        req.body.site_name,
        req.body.site_address,
        req.body.more_site,
        req.body.site_name_address,
        req.body.protocol_title,
        req.body.protocol_number,
        req.body.study_criteria,
        req.body.subject_number,
        req.body.site_number,
        req.body.disapproved_or_withdrawn,
        req.body.disapproved_or_withdrawn_explain,
        req.body.oversite,
        req.body.oversite_explain,
        req.body.immediate_family,
        req.body.immediate_family_explain,
        req.body.stock_ownership,
        req.body.stock_ownership_explain,
        req.body.property_interest,
        req.body.property_interest_explain,
        req.body.financial_agreement,
        req.body.financial_agreement_explain,
        req.body.server_position,
        req.body.server_position_explain,
        req.body.influence_conduct,
        req.body.influence_conduct_explain,
        req.body.interest_conflict,
        req.body.interest_conflict_explain,
        req.body.fda_audit,
        req.body.fda_audit_explain,
        req.body.involved_years,
        req.body.investigators_npi,
        req.body.training_completed.toString(),
        req.body.training_completed_explain,
        req.body.investigator_research_number,
        req.body.pending_or_active_research,
        req.body.pending_or_active_research_explain,
        req.body.created_by,
        req.body.protocol_id
      ]
      db.query(updateQuery, updateValues, (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg =
            'Investigator and Protocol Information has been updated successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into investigator_protocol_information (`protocol_id`,`investigator_name`,`investigator_email`,`sub_investigator_name`,`sub_investigator_email`,`additional_study_name`,`additional_study_email`,`site_name`,`site_address`,`more_site`,`site_name_address`,`protocol_title`,`protocol_number`,`study_criteria`,`subject_number`,`site_number`,`disapproved_or_withdrawn`,`disapproved_or_withdrawn_explain`,`oversite`,`oversite_explain`,`immediate_family`,`immediate_family_explain`,`stock_ownership`,`stock_ownership_explain`,`property_interest`,`property_interest_explain`,`financial_agreement`,`financial_agreement_explain`,`server_position`,`server_position_explain`,`influence_conduct`,`influence_conduct_explain`,`interest_conflict`,`interest_conflict_explain`,`fda_audit`,`fda_audit_explain`,`involved_years`,`investigators_npi`,`training_completed`,`training_completed_explain`,`investigator_research_number`,`pending_or_active_research`,`pending_or_active_research_explain`,`created_by`,`created_at`,`updated_at`) value (?)'
      const values = [
        req.body.protocol_id,
        req.body.investigator_name,
        req.body.investigator_email,
        req.body.sub_investigator_name,
        req.body.sub_investigator_email,
        req.body.additional_study_name,
        req.body.additional_study_email,
        req.body.site_name,
        req.body.site_address,
        req.body.more_site,
        req.body.site_name_address,
        req.body.protocol_title,
        req.body.protocol_number,
        req.body.study_criteria,
        req.body.subject_number,
        req.body.site_number,
        req.body.disapproved_or_withdrawn,
        req.body.disapproved_or_withdrawn_explain,
        req.body.oversite,
        req.body.oversite_explain,
        req.body.immediate_family,
        req.body.immediate_family_explain,
        req.body.stock_ownership,
        req.body.stock_ownership_explain,
        req.body.property_interest,
        req.body.property_interest_explain,
        req.body.financial_agreement,
        req.body.financial_agreement_explain,
        req.body.server_position,
        req.body.server_position_explain,
        req.body.influence_conduct,
        req.body.influence_conduct_explain,
        req.body.interest_conflict,
        req.body.interest_conflict_explain,
        req.body.fda_audit,
        req.body.fda_audit_explain,
        req.body.involved_years,
        req.body.investigators_npi,
        req.body.training_completed.toString(),
        req.body.training_completed_explain,
        req.body.investigator_research_number,
        req.body.pending_or_active_research,
        req.body.pending_or_active_research_explain,
        req.body.created_by,
        datetime.toISOString().slice(0, 10),
        datetime.toISOString().slice(0, 10)
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg =
            'Investigator and Protocol Information has been saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const saveClinicalInformedConsent = (req, res) => {
  var datetime = new Date()
  const selectQue =
    'select * from clinical_consent_information where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateQuery = `UPDATE clinical_consent_information
                SET principal_investigator_name=?,
                    site_address=?,
                    additional_site_address=?,
                    primary_phone=?,
                    always_primary_phone=?,
                    site_electronic_consent=?,
                    created_by=?
                WHERE protocol_id=?`

      const updateValues = [
        req.body.principal_investigator_name,
        req.body.site_address,
        req.body.additional_site_address,
        req.body.primary_phone,
        req.body.always_primary_phone,
        req.body.site_electronic_consent,
        req.body.created_by,
        req.body.protocol_id
      ]
      db.query(updateQuery, updateValues, (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg =
            'Informed Consent Information has been updated successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into clinical_consent_information (`protocol_id`,`principal_investigator_name`, `site_address`, `additional_site_address`,  `primary_phone`, `always_primary_phone`, `site_electronic_consent`, `created_by`,`created_at`,`updated_at`) value (?)'
      const values = [
        req.body.protocol_id,
        req.body.principal_investigator_name,
        req.body.site_address,
        req.body.additional_site_address,
        req.body.primary_phone,
        req.body.always_primary_phone,
        req.body.site_electronic_consent,
        req.body.created_by,
        datetime.toISOString().slice(0, 10),
        datetime.toISOString().slice(0, 10)
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg =
            'Informed Consent Information has been saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const saveMultiSiteProtocolProceduresInfo = (req, res) => {
  const selectQue =
    'select * from clinical_consent_information where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateVaues = [
        req.body.protocol_id,
        req.body.enrolled_study_type.toString(),
        req.body.enrolled_type_explain,
        req.body.enrolled_group.toString(),
        req.body.enrolled_group_explain,
        req.body.study_excluded,
        req.body.study_excluded_explain,
        req.body.enrolled_subject,
        req.body.recurement_method.toString(),
        req.body.recurement_method_explain,
        req.body.irb_approval,
        req.body.expected_number_sites,
        req.body.future_research,
        req.body.future_research_explain,
        req.body.created_by
      ]
      db.query(que, [updateVaues], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Protocol Procedure has been saved successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into protocol_procedure (`protocol_id`, `enrolled_study_type`,`enrolled_type_explain`,`enrolled_group`,`enrolled_group_explain`,`study_excluded`,`study_excluded_explain`,`enrolled_subject`,`recurement_method`,`recurement_method_explain`,`irb_approval`,`expected_number_sites`,`future_research`,`future_research_explain`,`created_by`) value (?)'
      const values = [
        req.body.protocol_id,
        req.body.enrolled_study_type.toString(),
        req.body.enrolled_type_explain,
        req.body.enrolled_group.toString(),
        req.body.enrolled_group_explain,
        req.body.study_excluded,
        req.body.study_excluded_explain,
        req.body.enrolled_subject,
        req.body.recurement_method.toString(),
        req.body.recurement_method_explain,
        req.body.irb_approval,
        req.body.expected_number_sites,
        req.body.future_research,
        req.body.future_research_explain,
        req.body.created_by
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'Protocol Procedure has been saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const saveClinicalSiteSubmission = (req, res) => {
  const que = 'UPDATE protocols SET status=2, allow_edit=1 WHERE protocol_id=?'
  db.query(que, [req.body.protocol_id], (err, data) => {
    if (err) {
      return res.status(500).json(err)
    } else {
      let result = {}
      result.status = 200
      result.msg = 'Clinical Site has been saved successfully'
      return res.json(result)
    }
  })
}

// export const saveClinicalSiteSubmission = (req, res) => {
//     var datetime = new Date();
//     const que = 'insert into protocol_submission (`protocol_id`, `protocol_type`,`created_by`, `created_at`, `updated_at`) value (?)';
//     const values = [
//         req.body.protocol_id,
//         req.body.protocol_type,
//         req.body.created_by,
//         datetime.toISOString().slice(0,10),
//         datetime.toISOString().slice(0,10),
//     ];
//     db.query(que, [values], (err, data) =>{
//         if (err) {
//             return res.status(500).json(err)
//         } else {
//             let result = {}
//             result.status = 200
//             result.msg = 'Clinical Site has been saved successfully'
//             return res.json(result)
//         }
//     })
// }

export const getClinicalSiteSavedProtocolType = (req, res) => {
  const protocolTypeObj = {}
  if (req.body.protocolType === 'Clinical Site') {
    const que1 = 'select * from protocol_information where protocol_id = ?'
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolTypeObj.protocol_information = data.length > 0 ? true : false
        const que2 =
          'select * from investigator_information where protocol_id = ?'
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolTypeObj.investigator_information =
              data.length > 0 ? true : false
            const que3 = 'select * from study_information where protocol_id = ?'
            db.query(que3, [req.body.protocolId], (err, data) => {
              if (data.length >= 0) {
                protocolTypeObj.study_information =
                  data.length > 0 ? true : false
                const que4 =
                  'select * from informed_consent where protocol_id = ?'
                db.query(que4, [req.body.protocolId], (err, data) => {
                  if (data.length >= 0) {
                    protocolTypeObj.informed_consent =
                      data.length > 0 ? true : false
                    const que5 =
                      'select * from protocol_procedure where protocol_id = ?'
                    db.query(que5, [req.body.protocolId], (err, data) => {
                      if (data.length >= 0) {
                        protocolTypeObj.protocol_procedure =
                          data.length > 0 ? true : false
                        let result = Object.keys(protocolTypeObj).map(
                          (key) => ({ form: key, filled: protocolTypeObj[key] })
                        )
                        return res.status(200).json(result)
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }
}
export const getDocumentReviewSavedProtocolType = (req, res) => {
  const protocolTypeObj = {}
  if (req.body.protocolType === 'Document Review') {
    const que1 = 'select * from protocol_information where protocol_id = ?'
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolTypeObj.protocol_information = data.length > 0 ? true : false
        const que2 =
          'select * from investigator_information where protocol_id = ?'
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolTypeObj.investigator_information =
              data.length > 0 ? true : false
            const que3 = 'select * from informed_consent where protocol_id = ?'
            db.query(que3, [req.body.protocolId], (err, data) => {
              if (data.length >= 0) {
                protocolTypeObj.document_review = data.length > 0 ? true : false
                let result = Object.keys(protocolTypeObj).map((key) => ({
                  form: key,
                  filled: protocolTypeObj[key]
                }))
                return res.status(200).json(result)
              }
            })
          }
        })
      }
    })
  }
}

// export const saveMultiSiteSubmission = (req, res) => {
//   const que = 'UPDATE protocols SET status=2, allow_edit=1 WHERE protocol_id=?'
//   db.query(que, [req.body.protocol_id], (err, data) => {
//     if (err) {
//       return res.status(500).json(err)
//     } else {
//       let result = {}
//       result.status = 200
//       result.msg = 'Multi-Site Sponsor has been saved successfully'
//       return res.json(result)
//     }
//   })
// }

export const saveMultiSiteSubmission = (req, res) => {
  const selectQue =
    'select * from external_monitor_protocol where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateQuery = `UPDATE external_monitor_protocol 
                SET external_monitor_id=? WHERE protocol_id=?`

      const updateValues = [req.body.external_monitor_id, req.body.protocol_id]
      db.query(updateQuery, updateValues, (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'External monitor assigned and saved successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into external_monitor_protocol (`protocol_id`, `protocol_type`, `created_by`, `external_monitor_id`, `created_at`, `updated_at`) value (?)'
      const values = [
        req.body.protocol_id,
        req.body.protocol_type,
        req.body.created_by,
        req.body.external_monitor_id,
        datetime.toISOString().slice(0, 10),
        datetime.toISOString().slice(0, 10)
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'External monitor assigned and saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const getMultiSiteSavedProtocolType = (req, res) => {
  const protocolTypeObj = {}
  if (req.body.protocolType === 'Multi-Site Sponsor') {
    const que1 = 'select * from protocol_information where protocol_id = ?'
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolTypeObj.protocol_information = data.length > 0 ? true : false
        const que2 = 'select * from contact_information where protocol_id = ?'
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolTypeObj.contact_information = data.length > 0 ? true : false
            const que3 = 'select * from study_information where protocol_id = ?'
            db.query(que3, [req.body.protocolId], (err, data) => {
              if (data.length >= 0) {
                protocolTypeObj.study_information =
                  data.length > 0 ? true : false
                const que4 =
                  'select * from informed_consent where protocol_id = ?'
                db.query(que4, [req.body.protocolId], (err, data) => {
                  if (data.length >= 0) {
                    protocolTypeObj.informed_consent =
                      data.length > 0 ? true : false
                    const que5 =
                      'select * from protocol_procedure where protocol_id = ?'
                    db.query(que5, [req.body.protocolId], (err, data) => {
                      if (data.length >= 0) {
                        protocolTypeObj.protocol_procedure =
                          data.length > 0 ? true : false
                        let result = Object.keys(protocolTypeObj).map(
                          (key) => ({ form: key, filled: protocolTypeObj[key] })
                        )
                        return res.status(200).json(result)
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }
}

// export const savePrincipalInvestigatorSubmission = (req, res) => {

//   const que = 'UPDATE protocols SET status=2, allow_edit=1 WHERE protocol_id=?'
//   db.query(que, [req.body.protocol_id], (err, data) => {
//     if (err) {
//       return res.status(500).json(err)
//     } else {
//       let result = {}
//       result.status = 200
//       result.msg = 'Principal Investigator has been saved successfully'
//       return res.json(result)
//     }
//   })
// }

export const savePrincipalInvestigatorSubmission = (req, res) => {
  const selectQue =
    'select * from external_monitor_protocol where protocol_id = ?'
  db.query(selectQue, [req.body.protocol_id], (err, data) => {
    if (data.length > 0) {
      const updateQuery = `UPDATE external_monitor_protocol 
                SET external_monitor_id=? WHERE protocol_id=?`

      const updateValues = [req.body.external_monitor_id, req.body.protocol_id]
      db.query(updateQuery, updateValues, (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'External monitor assigned and saved successfully'
          return res.json(result)
        }
      })
    } else {
      const que =
        'insert into external_monitor_protocol (`protocol_id`, `protocol_type`, `created_by`, `external_monitor_id`, `created_at`, `updated_at`) value (?)'
      const values = [
        req.body.protocol_id,
        req.body.protocol_type,
        req.body.created_by,
        req.body.external_monitor_id,
        datetime.toISOString().slice(0, 10),
        datetime.toISOString().slice(0, 10)
      ]
      db.query(que, [values], (err, data) => {
        if (err) {
          return res.status(500).json(err)
        } else {
          let result = {}
          result.status = 200
          result.msg = 'External monitor assigned and saved successfully'
          return res.json(result)
        }
      })
    }
  })
}

export const getPrincipalInvestigatorSavedProtocolType = (req, res) => {
  const protocolTypeObj = {}
  if (req.body.protocolType === 'Principal Investigator') {
    const que1 =
      'select * from investigator_protocol_information where protocol_id = ?'
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolTypeObj.investigator_protocol_information =
          data.length > 0 ? true : false
        const que2 =
          'select * from clinical_consent_information where protocol_id = ?'
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolTypeObj.consent_information = data.length > 0 ? true : false
            let result = Object.keys(protocolTypeObj).map((key) => ({
              form: key,
              filled: protocolTypeObj[key]
            }))
            return res.status(200).json(result)
          }
        })
      }
    })
  }
}
