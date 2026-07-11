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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       422:
 *         description: User email already exists
 */

router.post("/register", authController.userRegisterController)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", limiter, authController.userLoginController)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and blacklist token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post("/logout", authController.userLogoutController)

module.exports = router