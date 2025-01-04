// user.js - User Info Fetching
import { db } from '../api/connect.js'

// Function to fetch user data by user ID from the database
export async function fetchUserById(userId) {
  try {
    const user = await new Promise((resolve, reject) => {
      db.query(
        'SELECT name, email FROM users WHERE id = ?',
        [userId],
        (err, results) => {
          if (err) {
            reject(err)
            return
          }
          if (results.length > 0) {
            resolve({
              id: userId,
              name: results[0].name,
              email: results[0].email
            })
          } else {
            reject(new Error('User not found'))
          }
        }
      )
    })

    return user
  } catch (err) {
    throw new Error(`Error fetching user: ${err.message}`)
  }
}

// Function to get user info globally (cached) - In this case, avoid global cache
export async function getUserInfo(userId) {
  try {
    const userInfo = await fetchUserById(userId)
    return userInfo
  } catch (err) {
    throw new Error(`Error retrieving user info: ${err.message}`)
  }
}
