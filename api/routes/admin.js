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
    getMemberList,
    createMemberByAdmin,
    changeMemberStatus
} from "../controllers/admin.js";

const router = express.Router()


router.post('/member/status/change', changeMemberStatus)
router.post('/member/create', createMemberByAdmin)
router.get('/member/list', getMemberList)
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