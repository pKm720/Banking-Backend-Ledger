const acctMode = require("../models/accounts.model")

async function accountCreation(req, res) {

    const user = req.user;

    const account = await acctMode.create({
        user: user._id
    })

    res.status(201).json(
        {
            account
        }
    )

}

async function getUserAccounts(req , res) {
    const accounts = await acctMode.find({user: req.user._id});

    res.status(200).json({
        accounts
    })
}

async function getAccountBalance(req, res) {
    
}


module.exports = {
    accountCreation,
    getUserAccounts,
    getAccountBalance
}