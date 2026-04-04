const express = require("express")
const router = express.Router()
const authMiddleWare = require("../middlewares/auth.middleware")
const transactionController = require("../controllers/trans.controllers")
const validate = require("../middlewares/validate.middleware")
const createTransactionSchema = require("../validators/transaction.validator")

/**
 * @swagger
 * /api/transaction:
 *   post:
 *     summary: Create a new transaction between two accounts
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromAccount
 *               - toAccount
 *               - amount
 *               - idempotencyKey
 *             properties:
 *               fromAccount:
 *                 type: string
 *               toAccount:
 *                 type: string
 *               amount:
 *                 type: number
 *               idempotencyKey:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction completed successfully
 *       400:
 *         description: Validation or insufficient balance errors
 *       200:
 *         description: Transaction already processed or pending
 */
router.post("/", authMiddleWare.verifyToken, validate(createTransactionSchema), transactionController.creatTransAction)

/**
 * @swagger
 * /api/transaction/system/initial-funds:
 *   post:
 *     summary: System route to add initial funds to an account
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toAccount
 *               - amount
 *               - idempotencyKey
 *             properties:
 *               toAccount:
 *                 type: string
 *               amount:
 *                 type: number
 *               idempotencyKey:
 *                 type: string
 *     responses:
 *       201:
 *         description: Funds added successfully
 *       400:
 *         description: Account not found or missing fields
 */

router.post("/system/initial-funds", authMiddleWare.authSystemMiddleware, transactionController.createSystemTransaction)


module.exports = router