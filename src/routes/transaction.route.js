const express = require("express")
const router = express.Router()
const authMiddleWare = require("../middlewares/auth.middleware")
const transactionController = require("../controllers/trans.controllers")

router.post("/",authMiddleWare.verifyToken, transactionController.creatTransAction)

router.post("/system/initial-funds",authMiddleWare.authSystemMiddleware, transactionController.createSystemTransaction)


module.exports = router