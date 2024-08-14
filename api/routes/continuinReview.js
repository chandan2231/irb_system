import express from "express";
import { saveRiskAssessment, saveInformedConsent, saveInvestigatorAndinstuation, saveResearchProcess } from "../controllers/continuinReview.js";
const router = express.Router()

router.post('/riskAssessmentSave', saveRiskAssessment)
router.post('/informedConsentSave', saveInformedConsent)
router.post('/investigatorAndinstuationSave', saveInvestigatorAndinstuation)
router.post('/researchProcessSave', saveResearchProcess)


export default router