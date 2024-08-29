import express from "express";
import { getProtocolList, getAllUsers, getContinuinDetailsById, getProtocolDetailsById } from "../controllers/admin.js";

const router = express.Router()

router.get('/protocol/list', getProtocolList)
router.get('/users/list', getAllUsers)
router.post('/continuinDetailsById', getContinuinDetailsById)
router.post('/protocolDetailsById', getProtocolDetailsById)


export default router