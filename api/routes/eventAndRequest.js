import express from "express";
import { saveStudyCloseoutRequest, saveProtocolAmendmentRequest,  savePromptlyReportableEvent, saveAdverseEvent} from "../controllers/eventAndRequest.js";
const router = express.Router()

router.post('/createStudyCloseoutRequest', saveStudyCloseoutRequest)
router.post('/createPromptlyReportableEvent', savePromptlyReportableEvent)
router.post('/createProtocolAmendmentRequest', saveProtocolAmendmentRequest)
router.post('/createAdverseEvent', saveAdverseEvent)


export default router