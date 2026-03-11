const express = require("express")
const acctMiddleware = require("../middlewares/auth.middleware")
const acctController = require("../controllers/acct.controllers")

const router = express.Router()


router.post("/",acctMiddleware.verifyToken,acctController.accountCreation)
router.get("/",acctMiddleware.verifyToken,acctController.getUserAccounts)
router.get("/balance/:accountID",acctMiddleware.verifyToken,acctController.getAccountBalance)


module.exports = router