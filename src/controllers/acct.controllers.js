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

module.exports = {
    accountCreation
}