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
} from "../controllers/admin.js";

const router = express.Router()

router.get('/protocol/list', getProtocolList)
router.get('/users/list', getAllUsers)
router.post('/continuinDetailsById', getContinuinDetailsById)
router.post('/protocolDetailsById', getProtocolDetailsById)
router.post('/eventAndRequest/getStudyCloseoutRequest', getStudyCloseoutRequestList)
router.post('/eventAndRequest/getPromptlyReportableEvent', getPromptlyReportableEventList)
router.post('/eventAndRequest/getAdverseEvent', getAdverseEventList)
router.post('/eventAndRequest/getProtocolAmendmentRequest', getProtocolAmendmentRequestList)


export default router