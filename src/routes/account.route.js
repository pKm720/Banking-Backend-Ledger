const express = require("express")
const acctMiddleware = require("../middlewares/auth.middleware")
const acctController = require("../controllers/acct.controllers")

const router = express.Router()

/**
 * @swagger
 * /api/account:
 *   post:
 *     summary: Create a new account for the logged-in user
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Account successfully created
 *       401:
 *         description: Unauthorized
 */
router.post("/",acctMiddleware.verifyToken,acctController.accountCreation)

/**
 * @swagger
 * /api/account:
 *   get:
 *     summary: Get all accounts for the logged-in user
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of user accounts
 */
router.get("/",acctMiddleware.verifyToken,acctController.getUserAccounts)

/**
 * @swagger
 * /api/account/balance/{accountId}:
 *   get:
 *     summary: Get the specific account balance
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account
 *     responses:
 *       200:
 *         description: Returns the account balance
 *       403:
 *         description: Unauthorized, account does not belong to user
 *       404:
 *         description: Account not found
 */
router.get("/balance/:accountId",acctMiddleware.verifyToken,acctController.getAccountBalance)


module.exports = router