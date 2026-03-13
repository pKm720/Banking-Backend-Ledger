const express = require("express")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.route")
const accountRouter = require("./routes/account.route")
const transactionRouter = require("./routes/transaction.route")
const rateLimit = require("express-rate-limit")
const app = express()
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: process.env.NODE_ENV === "development" ? 1000 : 100, // 100 requests per 15 mins
    message: {
        message: "Too many requests, please try again later"
    }
})

app.use(helmet())
app.use(morgan("dev"))
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(limiter)

app.use("/api/auth",authRouter)
app.use("/api/account",accountRouter)
app.use("/api/transaction",transactionRouter)

app.use((req, res) => {
    return res.status(404).json({
        message: `Route ${req.method} ${req.url} not found`
    })
})

module.exports = app