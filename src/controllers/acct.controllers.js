const acctMode = require("../models/accounts.model")

async function accountCreation(req, res) {
    try {
        const user = req.user;
        const account = await acctMode.create({
            user: user._id
        })

        return res.status(201).json(
            {
                account
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }

}

async function getUserAccounts(req, res) {
    const accounts = await acctMode.find({ user: req.user._id });

    return res.status(200).json({
        accounts
    })
}

async function getAccountBalance(req, res) {
    try {
        const { accountId } = req.params;
        const account = await acctMode.findOne({
            _id: accountId
        })

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            })
        }

        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized: This account does not belong to you"
            })
        }

        const balance = await account.getBalance();

        return res.status(200).json({
            accountId: account._id,
            balance: balance
        })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
}


module.exports = {
    accountCreation,
    getUserAccounts,
    getAccountBalance
}