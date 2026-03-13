const express = require("express")
const authController = require("../controllers/auth.controllers")
const rateLimit = require("express-rate-limit")
const router = express.Router()


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: process.env.NODE_ENV === "development" ? 1000 : 5, // 5 requests per 15 mins
    message: {
        message: "Too many requests, please try again later"
    }
})

router.post("/register",authController.userRegisterController)
router.post("/login",limiter,authController.userLoginController)
router.post("/logout", authController.userLogoutController)

module.exports = router