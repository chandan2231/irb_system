import { db } from '../connect.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {
    const que = "select * from users where email = ?"
    db.query(que, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length > 0 ) {
            return res.status(409).json('Email already exist try with other email')
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        const que = 'insert into users (`name`, `mobile`, `email`,  `password`, `researcher_type`, `user_type`, `city`) value (?)';
        const values = [
            req.body.name, 
            req.body.mobile, 
            req.body.email, 
            hashedPassword, 
            'user',
            'user',
            req.body.city,
        ];
        db.query(que, [values], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json('User has been created.')
        }) 
    })
}

export const login = (req, res) => {
    const que = 'select * from users where email=? AND status=?';
    db.query(que, [req.body.email, 1], (err, data) => {
        if (err) return res.status(500).json(err)
        if(data.length === 0) return res.status(404).json("Email not found! Try with valid email");
        const checkpassword = bcrypt.compareSync(req.body.password, data[0].password);
        if(!checkpassword) return res.status(400).json('Wrong password or email!');
        const token = jwt.sign({id: data[0].id}, 'secretkey');
        const { password, ...others } = data[0];
        res.cookie('accessToken', token, {
          httpOnly: true,       // Prevents access to the cookie via JavaScript (XSS protection)
          secure: true, // Only send cookies over HTTPS in production
          sameSite: 'None',     // For cross-origin cookies
          maxAge: 3600000,      // 1 hour expiration
        });
        res.status(200).json(others);

    })
}

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

export const verifyToken = (req, res, next) => {
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
