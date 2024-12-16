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
app.use(express.json())

app.use(cors({
  origin: 'https://irbhub.com', // the frontend URL
  credentials: true,
}));

app.options('*', cors());
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/researchInfo', researchRoutes)
app.use('/api/protocol', protocolRoutes)
app.use('/api/continuinReview', continuinReviewRoutes)
app.use('/api/eventAndRequest', eventAndRequest)
app.use('/api/admin', adminRoutes)

app.listen(8000, () => {
  console.log('API Working!')
})
