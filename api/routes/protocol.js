import express from "express";
import { upload } from "../utils/middleware.js";
import { saveFile } from "../controllers/protocol.js";
import { getProtocolList, createProtocol } from "../controllers/protocol.js";

const router = express.Router()
router.post('/list', getProtocolList)
router.post('/create', createProtocol)
router.post("/upload/file", upload.single("file"), saveFile)


export default router