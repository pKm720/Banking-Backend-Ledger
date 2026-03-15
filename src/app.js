const express = require("express")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.route")
const accountRouter = require("./routes/account.route")
const transactionRouter = require("./routes/transaction.route")
const rateLimit = require("express-rate-limit")
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./config/swagger")
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
    origin: function (origin, callback) {
        // Allow requests with no origin, localhost, and the render domain
        const allowedOrigins = [
            "http://localhost:3000",
            process.env.FRONTEND_URL,
            "https://banking-backend-ledger.onrender.com"
        ];
        
        // If no origin (like mobile/curl) or it's in our allowed list, permit it
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Temporarily, let's allow all origins during testing to ensure Swagger works
        // Remove this in strict production environments
         return callback(null, true); 
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'accept']
}))
app.use(express.json())
app.use(cookieParser())
app.use(limiter)


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})

app.use("/api/auth", authRouter)
app.use("/api/account", accountRouter)
app.use("/api/transaction", transactionRouter)

app.use((req, res) => {
    return res.status(404).json({
        message: `Route ${req.method} ${req.url} not found`
    })
})

module.exports = app