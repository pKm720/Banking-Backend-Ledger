const accountModel = require("../models/accounts.model");
async function accountCreation(req, res) {
    try {
        const user = req.user;
        const account = await accountModel.createAccount({ user_id: user.id });
        return res.status(201).json({ account });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}
async function getUserAccounts(req, res) {
    const accounts = await accountModel.findByUserId(req.user.id);
    return res.status(200).json({ accounts });
}
async function getAccountBalance(req, res) {
    try {
        const { accountId } = req.params;
        const account = await accountModel.findById(accountId);
        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }
        // UUID comparison: plain string equality (no .toString() needed)
        if (account.user_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized: This account does not belong to you"
            });
        }
        const balance = await accountModel.getBalance(account.id);
        return res.status(200).json({
            accountId: account.id,
            balance
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}
module.exports = {
    accountCreation,
    getUserAccounts,
    getAccountBalance
};