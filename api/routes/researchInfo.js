import express from 'express'

import {
  saveProtocolInfo,
  saveInvestigatorInfo,
  saveStydyInfo,
  saveInformedInfo,
  saveProtocolProceduresInfo,
  saveContactInfo,
  saveInvestigatorAndProtocolInformation,
  saveClinicalInformedConsent,
  saveMultiSiteProtocolProceduresInfo,
  saveClinicalSiteSubmission,
  getClinicalSiteSavedProtocolType,
  saveMultiSiteSubmission,
  getMultiSiteSavedProtocolType,
  getPrincipalInvestigatorSavedProtocolType,
  savePrincipalInvestigatorSubmission,
  getDocumentReviewSavedProtocolType,
  saveDocumentReview,
  saveDocumentSubmission
} from '../controllers/researchInfo.js'

const router = express.Router()

router.post('/saveProtocolInfo', saveProtocolInfo)
router.post('/saveInvestigatorInfo', saveInvestigatorInfo)
router.post('/saveStydyInfo', saveStydyInfo)
router.post('/saveInformedInfo', saveInformedInfo)

router.post('/saveProtocolProceduresInfo', saveProtocolProceduresInfo)
router.post(
  '/saveMultiSiteProtocolProceduresInfo',
  saveMultiSiteProtocolProceduresInfo
)
router.post('/saveContactInfo', saveContactInfo)
router.post(
  '/saveInvestigatorAndProtocolInformation',
  saveInvestigatorAndProtocolInformation
)
router.post('/saveClinicalInformedConsent', saveClinicalInformedConsent)
router.post('/saveClinicalSiteSubmission', saveClinicalSiteSubmission)
router.post(
  '/getClinicalSiteSavedProtocolType',
  getClinicalSiteSavedProtocolType
)
router.post('/saveMultiSiteSubmission', saveMultiSiteSubmission)
router.post('/getMultiSiteSavedProtocolType', getMultiSiteSavedProtocolType)
router.post(
  '/savePrincipalInvestigatorSubmission',
  savePrincipalInvestigatorSubmission
)
router.post(
  '/getPrincipalInvestigatorSavedProtocolType',
  getPrincipalInvestigatorSavedProtocolType
)
router.post(
  '/getDocumentReviewSavedProtocolType',
  getDocumentReviewSavedProtocolType
)
router.post('/saveDocumentReview', saveDocumentReview)
router.post('/saveDocumentSubmission', saveDocumentSubmission)

export default router
