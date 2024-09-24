import express from "express";
import { 
    getApprovedProtocolList, 
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
    changeMemberStatus,
    changeMemberPassword,
    changeUserStatus,
    changeUserPassword,
    getUnderReviewProtocolList,
} from "../controllers/admin.js";

const router = express.Router()


router.post('/user/reset/password', changeUserPassword)
router.post('/member/reset/password', changeMemberPassword)
router.post('/user/status/change', changeUserStatus)
router.post('/member/status/change', changeMemberStatus)
router.post('/member/create', createMemberByAdmin)
router.get('/member/list', getMemberList)
router.get('/approved-protocol/list', getApprovedProtocolList)
router.get('/under-review/protocol/list', getUnderReviewProtocolList)
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