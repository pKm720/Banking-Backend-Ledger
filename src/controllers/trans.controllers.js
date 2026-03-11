const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")

async function creatTransAction(req,res) {
    const {fromAccount, toAccount, amount , idempotencyKey} = req.body
}

module.exports = {
    creatTransAction
}