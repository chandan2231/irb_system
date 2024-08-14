import express from "express";
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import researchRoutes from './routes/researchInfo.js'
import protocolRoutes from './routes/protocol.js'
import continuinReviewRoutes from './routes/continuinReview.js'

import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    next();
})
// middlewares
app.use(express.json())
app.use(cors({origin: 'http://localhost:5173'}))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/researchInfo", researchRoutes)
app.use("/api/protocol", protocolRoutes)
app.use("/api/continuinReview", continuinReviewRoutes)

app.listen(8800, () => {
    console.log("API Working!")
})