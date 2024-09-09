import express from "express";
import { upload } from "../utils/middleware.js";
import { saveFile, continueinReviewGeneratePdf, protocolGeneratePdf } from "../controllers/protocol.js";
import { getProtocolList, createProtocol } from "../controllers/protocol.js";

const router = express.Router()
router.post('/list', getProtocolList)
router.post('/create', createProtocol)
router.post("/upload/file", upload.single("file"), saveFile)
router.post("/continuein/generate/pdf", continueinReviewGeneratePdf)
router.post("/protocol/generate/pdf", protocolGeneratePdf)


export default router