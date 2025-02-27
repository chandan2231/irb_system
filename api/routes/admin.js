import express from 'express'
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
  allowProtocolEdit,
  getMemberList,
  createMember,
  changeMemberStatus,
  changeMemberPassword,
  changeUserStatus,
  changeUserPassword,
  getUnderReviewProtocolList,
  getRejectedProtocolList,
  getCreatedProtocolList,
  allowProtocolWaiveFee,
  getEventPriceList,
  createEventPrice,
  changeEventPrice,
  changeEventPriceStatus,
  getActiveVotingMemberList,
  createMemberEvent,
  memberEventList,
  assignProtocolToMembers,
  assignedMembersList,
  assignedMembersProtocolList,
  votingMemberApprovalProtocol,
  approvedProtocolsByMembersList,
  chairCommitteeApprovalProtocol,
  getContinueinProtocolList,
  getAllProtocolList,
  getMasterDataListByType,
  getUnderReviewProtocolAllList,
  getMemberListForSuperAdmin
} from '../controllers/admin.js'

const router = express.Router()
router.post(
  '/member/chairCommitteeApprovalProtocol',
  chairCommitteeApprovalProtocol
)
router.post(
  '/member/approvedProtocolsByMembersList',
  approvedProtocolsByMembersList
)
router.post(
  '/member/votingMemberApprovalProtocol',
  votingMemberApprovalProtocol
)
router.get('/continuein/protocol/list', getContinueinProtocolList)
router.post('/member/assignedMembersProtocolList', assignedMembersProtocolList)
router.post('/member/assignedMembers', assignedMembersList)
router.post('/member/assignProtocolToMembers', assignProtocolToMembers)
router.get('/member/eventList', memberEventList)
router.post('/member/createEvent', createMemberEvent)
router.get('/active/votingmember/list', getActiveVotingMemberList)
router.post('/eventprice/status/change', changeEventPriceStatus)
router.post('/eventprice/update', changeEventPrice)
router.post('/eventprice/create', createEventPrice)
router.get('/eventprice/list', getEventPriceList)
router.post('/user/reset/password', changeUserPassword)
router.post('/member/reset/password', changeMemberPassword)
router.post('/user/status/change', changeUserStatus)
router.post('/member/status/change', changeMemberStatus)
router.post('/member/create', createMember)
router.get('/member/list', getMemberList)
router.get('/super/member/list', getMemberListForSuperAdmin)
router.get('/all-protocol/list', getAllProtocolList)
router.post('/approved-protocol/list', getApprovedProtocolList)
router.post('/under-review/protocol/list', getUnderReviewProtocolList)
router.post('/rejected/protocol/list', getRejectedProtocolList)
router.post('/created/protocol/list', getCreatedProtocolList)
router.post('/protocol/allowEdit', allowProtocolEdit)
router.post('/protocol/waiveFee', allowProtocolWaiveFee)
router.get('/users/list', getAllUsers)
router.post('/continuinDetailsById', getContinuinDetailsById)
router.post('/protocolDetailsById', getProtocolDetailsById)
router.post(
  '/eventAndRequest/getStudyCloseoutRequest',
  getStudyCloseoutRequestList
)
router.post('/studyCloseoutDetailsById', getStudyCloseoutDetailsById)
router.post(
  '/eventAndRequest/getPromptlyReportableEvent',
  getPromptlyReportableEventList
)
router.post('/promptlyReportableEventById', getPromptlyReportableEventById)
router.post('/eventAndRequest/getAdverseEvent', getAdverseEventList)
router.post('/adverseEventById', getAdverseEventById)
router.post(
  '/eventAndRequest/getProtocolAmendmentRequest',
  getProtocolAmendmentRequestList
)
router.post('/protocolAmendmentRequestById', getProtocolAmendmentRequestById)
router.post('/master/list', getMasterDataListByType)
router.get('/under-review/protocol/all/list', getUnderReviewProtocolAllList)

export default router
