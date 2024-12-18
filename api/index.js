import express from 'express'
import authRoutes from './routes/auth.js'
import researchRoutes from './routes/researchInfo.js'
import protocolRoutes from './routes/protocol.js'
import continuinReviewRoutes from './routes/continuinReview.js'
import adminRoutes from './routes/admin.js'
import eventAndRequest from './routes/eventAndRequest.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config({ path: `.env`, override: true })

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  next()
})
// middlewares
app.use(express.json())

app.use(cookieParser())
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: 'http://localhost:5173' }))
} else {
  // Define allowed origins for production
  const allowedOrigins = ['https://irbhub.org']
  const corsOptions = {
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials (cookies, HTTP authentication, etc.)
    preflightContinue: false // Don't pass preflight request to the next handler
  }
  // Use the cors middleware
  app.use(cors(corsOptions))
}

app.use('/api/auth', authRoutes)
app.use('/api/researchInfo', researchRoutes)
app.use('/api/protocol', protocolRoutes)
app.use('/api/continuinReview', continuinReviewRoutes)
app.use('/api/eventAndRequest', eventAndRequest)
app.use('/api/admin', adminRoutes)

app.listen(8800, () => {
  console.log('API Working!')
})
