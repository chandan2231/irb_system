import express from "express";

import { saveProtocolInfo, saveInvestigatorInfo, saveStydyInfo, saveInformedInfo, saveProtocolProceduresInfo, saveContactInfo } from "../controllers/researchInfo.js";

const router = express.Router()

router.post('/saveProtocolInfo', saveProtocolInfo)
router.post('/saveInvestigatorInfo', saveInvestigatorInfo)
router.post('/saveStydyInfo', saveStydyInfo)
router.post('/saveInformedInfo', saveInformedInfo)
router.post('/saveProtocolProceduresInfo', saveProtocolProceduresInfo)
router.post('/saveContactInfo', saveContactInfo)


export default router