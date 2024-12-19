import express from 'express'
import authRoutes from './routes/auth.js'
import researchRoutes from './routes/researchInfo.js'
import protocolRoutes from './routes/protocol.js'
import continuinReviewRoutes from './routes/continuinReview.js'
import adminRoutes from './routes/admin.js'
import eventAndRequest from './routes/eventAndRequest.js'

import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// middlewares
//app.use(cors());
app.use(express.json())

// Define allowed origins for production
const allowedOrigins = ['https://app.irbhub.com'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow credentials (cookies, HTTP authentication, etc.)
  preflightContinue: false, // Don't pass preflight request to the next handler
};

// Use the cors middleware
app.use(cookieParser())
// Apply CORS middleware
app.use(cors(corsOptions));


app.use('/api/auth', authRoutes)
app.use('/api/researchInfo', researchRoutes)
app.use('/api/protocol', protocolRoutes)
app.use('/api/continuinReview', continuinReviewRoutes)
app.use('/api/eventAndRequest', eventAndRequest)
app.use('/api/admin', adminRoutes)

app.listen(8000, () => {
  console.log('API Working!')
})
