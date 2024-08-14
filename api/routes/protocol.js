import express from "express";

import { getProtocolList, createProtocol } from "../controllers/protocol.js";

const router = express.Router()
router.post('/list', getProtocolList)
router.post('/create', createProtocol)


export default router