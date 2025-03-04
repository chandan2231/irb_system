import { db } from '../connect.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendEmail from '../emailService.js'
import { v4 as uuidv4 } from 'uuid'

export const login = (req, res) => {
  const query = 'SELECT * FROM users WHERE email = ? AND status = ?'

  db.query(query, [req.body.email, 1], (err, data) => {
    if (err) {
      console.error('Database Error:', err)
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: 'Email not found! Try with a valid email.' })
    }

    const user = data[0]
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Wrong password!' })
    }

    if (!user.verified) {
      return res.status(400).json({ error: 'Please verify your email first.' })
    }
    const token = jwt.sign(
      { userId: user.id, userType: user.user_type },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    )

    const { password, ...otherUserData } = user

    const usersData = {
      name: user.name,
      email: user.email,
      id: user.id,
      user_type: user.user_type,
      token: token
    }

    res.status(200).json({
      message: 'Login successful',
      user: usersData
    })
  })
}

export const emailVerification = (req, res) => {
  const { token } = req.body

  db.query(
    'UPDATE users SET verified = 1 WHERE verification_token = ?',
    [token],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      if (result.affectedRows === 0)
        return res.status(400).json({ error: 'Invalid or expired token' })

      res.json({ message: 'Email verified successfully!' })
    }
  )
}

export const resetPassword = (req, res) => {
  const { token, password } = req.body
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ msg: 'Invalid or expired token' })
    const userId = decoded.id
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)
    db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId],
      (err) => {
        if (err) return res.status(500).json({ error: err.msg })
        res.json({ msg: 'Password reset successful!' })
      }
    )
  })
}

export const forgetPasswordVerifyEmail = (req, res) => {
  try {
    const { email } = req.body
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, result) => {
        if (err) {
          console.error('Database error:', err)
          return res.status(500).json({ error: err.message })
        }

        if (result.length === 0) {
          return res.status(200).json({ msg: 'User not found!' })
        }

        const user = result[0]
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '30m'
        })
        const resetLink = `${process.env.DOMAIN}reset-password/${encodeURIComponent(token)}`

        const to = email
        const subject = 'IRBHUB Password Reset Link'
        const greetingHtml = `<p>Dear ${user.name || 'User'},</p>`
        const bodyHtml = `<h2>Click the link to reset your password</h2>
               <a href="${resetLink}">Reset Password</a>`
        const emailHtml = `<div>${greetingHtml}${bodyHtml}</div>`

        try {
          await sendEmail(to, subject, emailHtml, emailHtml)
          return res.status(200).json({
            msg: 'A password reset email has been sent successfully. Please check your inbox to reset your password.'
          })
        } catch (emailError) {
          console.error('Error sending email:', emailError)
          return res
            .status(500)
            .json({ status: 500, msg: 'User found but failed to send email.' })
        }
      }
    )
  } catch (err) {
    console.error('Error:', err)
    return res.status(500).json({ status: 500, msg: 'Internal server error.' })
  }
}

export const register = async (req, res) => {
  try {
    // Check if the email already exists
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?'
    const existingUserData = await new Promise((resolve, reject) => {
      db.query(checkEmailQuery, [req.body.email], (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
    const existingUser = Array.isArray(existingUserData)
      ? existingUserData
      : [existingUserData]
    // If email exists, return an error
    if (existingUser.length > 0) {
      return res
        .status(200)
        .json('Email already exists. Please try with another email.')
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)
    const verificationToken = uuidv4()
    // Insert new user into the database
    const insertQuery = `
      INSERT INTO users (name, mobile, email, password, researcher_type, user_type, verified, verification_token) 
      VALUES (?)`
    const values = [
      req.body.name,
      req.body.mobile,
      req.body.email,
      hashedPassword,
      'user',
      'user',
      0,
      verificationToken
    ]

    const insertResult = await new Promise((resolve, reject) => {
      db.query(insertQuery, [values], (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
    const verifyLink = `${process.env.DOMAIN}verify-email/${verificationToken}`
    const to = req.body.email
    const subject = 'Verify Your Email for IRBHUB'
    const greetingHtml = `<p>Dear ${req.body.name},</p>`
    const bodyHtml = `<h2>You have successfully registered with IRBHUB.</h2>
                      <br>
                      <h4>Click the link below to verify your email</h4>
                      <a href="${verifyLink}">Verify Email</a>`
    const emailHtml = `
      <div>
        ${greetingHtml}
        ${bodyHtml}
      </div>`
    const text = emailHtml
    const html = emailHtml

    try {
      await sendEmail(to, subject, text, html)
      return res
        .status(200)
        .json(
          'User has been created and email verification sent to registered email.'
        )
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      return res
        .status(500)
        .json({ status: 500, msg: 'User created but failed to send email.' })
    }
  } catch (err) {
    console.error('Error during registration:', err)
    return res.status(500).json({ status: 500, msg: 'Internal server error.' })
  }
}

// export const login = (req, res) => {
//   const que = 'select * from users where email=? AND status=?'
//   db.query(que, [req.body.email, 1], (err, data) => {
//     if (err) return res.status(500).json(err)
//     if (data.length === 0)
//       return res.status(404).json('Email not found! Try with valid email')
//     const checkpassword = bcrypt.compareSync(
//       req.body.password,
//       data[0].password
//     )
//     if (!checkpassword) return res.status(400).json('Wrong password or email!')
//     if (!data[0].verified)
//       return res.status(400).json({ error: 'Please verify your email first.' })

//     const token = jwt.sign({ id: data[0].id }, 'secretkey')
//     const { password, ...others } = data[0]
//     res
//       .cookie('accessToken', token, { httpOnly: false })
//       .status(200)
//       .json(others)
//   })
// }

export const logout = (req, res) => {
  res
    .clearCookie('accessToken', {
      secure: true,
      sameSite: 'none'
    })
    .status(200)
    .json('User has been logged out.')
  res.end()
}

export const validateUserToken = (req, res, next) => {
  try {
    const authHeader = req.headers.token // get the session cookie from request header
    if (!authHeader) return res.sendStatus(401) // if there is no cookie from request header, send an unauthorized response.
    const cookie = authHeader // If there is, split the cookie string to get the actual jwt
    // Verify using jwt to see if token has been tampered with or if it has expired.
    // that's like checking the integrity of the cookie
    jwt.verify(cookie, 'secretkey', async (err, decoded) => {
      if (err) {
        // if token has been altered or has expired, return an unauthorized error
        return res.status(401).json('This session has expired. Please login')
      }
      const { id } = decoded // get user id from the decoded token
      req.userId = id // put the data object into req.user
      next()
    })
  } catch (err) {
    res.status(500).json('Internal Server Error')
  }
}
