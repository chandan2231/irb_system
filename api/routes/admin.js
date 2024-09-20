import express from "express";
import { 
    getProtocolList, 
    getAllUsers, 
    getContinuinDetailsById, 
    getProtocolDetailsById,
    getStudyCloseoutRequestList,
    getPromptlyReportableEventList,
    getAdverseEventList,
    getProtocolAmendmentRequestList,
    getStudyCloseoutDetailsById,
    getPromptlyReportableEventById,
    getAdverseEventById,
    getProtocolAmendmentRequestById,
    allowProtocolEditByAdmin,
} from "../controllers/admin.js";

const router = express.Router()

router.get('/protocol/list', getProtocolList)
router.post('/protocol/allowEdit', allowProtocolEditByAdmin)
router.get('/users/list', getAllUsers)
router.post('/continuinDetailsById', getContinuinDetailsById)
router.post('/protocolDetailsById', getProtocolDetailsById)
router.post('/eventAndRequest/getStudyCloseoutRequest', getStudyCloseoutRequestList)
router.post('/studyCloseoutDetailsById', getStudyCloseoutDetailsById)
router.post('/eventAndRequest/getPromptlyReportableEvent', getPromptlyReportableEventList)
router.post('/promptlyReportableEventById', getPromptlyReportableEventById)
router.post('/eventAndRequest/getAdverseEvent', getAdverseEventList)
router.post('/adverseEventById', getAdverseEventById)
router.post('/eventAndRequest/getProtocolAmendmentRequest', getProtocolAmendmentRequestList)
router.post('/protocolAmendmentRequestById', getProtocolAmendmentRequestById)

export default router