const accountModel = require("../models/accounts.model");
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
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId
    })

    if(!account){
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getAccountBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}


module.exports = {
    accountCreation,
    getUserAccounts,
    getAccountBalance
}