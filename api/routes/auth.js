import express from 'express'
import {
  login,
  register,
  logout,
  validateUserToken,
  forgetPasswordVerifyEmail,
  resetPassword
} from '../controllers/auth.js'
const router = express.Router()
router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.post('/verify/username', forgetPasswordVerifyEmail)
router.post('/password/reset/', resetPassword)
router.get('/', validateUserToken, (req, res) => {
  res.status(200).json('Welcome to the your Dashboard!')
})

export default router
