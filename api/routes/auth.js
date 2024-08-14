import express from "express";
import { login, register, logout, verifyToken  } from "../controllers/auth.js";
const router = express.Router()
router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.get('/', verifyToken, (req, res) => {
    res.status(200).json("Welcome to the your Dashboard!");
})


export default router