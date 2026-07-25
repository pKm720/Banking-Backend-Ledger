const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/accounts.model");
const emailService = require("../services/email.service");
const { db } = require("../config/db");

async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    // Fetch both accounts in a single query
    const accounts = await accountModel.findByIds([fromAccount, toAccount]);

    const fromUserAccount = accounts.find(acc => acc.id === fromAccount);
    const toUserAccount = accounts.find(acc => acc.id === toAccount);

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "One or both accounts do not exist"
        });
    }

    if (fromUserAccount.user_id !== req.user.id) {
        return res.status(403).json({
            message: "Unauthorized: This account does not belong to you"
        });
    }

    // Idempotency check
    const existingTransaction = await transactionModel.findByIdempotencyKey(idempotencyKey);

    if (existingTransaction) {
        if (existingTransaction.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is being processed"
            });
        }

        if (existingTransaction.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: existingTransaction
            });
        }

        if (existingTransaction.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed, please retry"
            });
        }

        if (existingTransaction.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            });
        }
    }

    if (
        fromUserAccount.status !== "ACTIVE" ||
        toUserAccount.status !== "ACTIVE"
    ) {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        });
    }

    const balance = await accountModel.getBalance(fromAccount);

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
        });
    }

    let transaction;

    try {
        // Knex transaction replaces mongoose.startSession()
        await db.transaction(async (trx) => {

            // 1. Create transaction record (PENDING)
            transaction = await transactionModel.createTransaction(
                {
                    from_account_id: fromAccount,
                    to_account_id: toAccount,
                    amount,
                    idempotency_key: idempotencyKey,
                    status: "PENDING"
                },
                trx
            );

            // 2. Create ledger entries (double-entry bookkeeping)
            await ledgerModel.createEntries(
                [
                    {
                        account_id: fromAccount,
                        transaction_id: transaction.id,
                        amount,
                        type: "DEBIT"
                    },
                    {
                        account_id: toAccount,
                        transaction_id: transaction.id,
                        amount,
                        type: "CREDIT"
                    }
                ],
                trx
            );

            // 3. Mark transaction COMPLETED
            transaction = await transactionModel.updateStatus(
                transaction.id,
                "COMPLETED",
                trx
            );
        });

        // If any step throws, Knex automatically rolls back

    } catch (error) {
        return res.status(500).json({
            message: "Transaction failed due to an internal error, please retry later"
        });
    }

    // Send email outside the transaction for performance
    emailService
        .sendTransactionEmail(
            req.user.email,
            req.user.name,
            amount,
            toAccount
        )
        .catch(err => {
            console.error("Email service error:", err);
        });

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction
    });
}

async function createSystemTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    const toUserAccount = await accountModel.findById(toAccount);

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Destination account not found"
        });
    }

    // System user's account (the logged-in system user's account)
    const accounts = await accountModel.findByUserId(req.user.id);
    const fromUserAccount = accounts[0];

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System account not found"
        });
    }

    let transaction;

    try {
        await db.transaction(async (trx) => {

            // 1. Create transaction record (PENDING)
            transaction = await transactionModel.createTransaction(
                {
                    from_account_id: fromUserAccount.id,
                    to_account_id: toAccount,
                    amount,
                    idempotency_key: idempotencyKey,
                    status: "PENDING"
                },
                trx
            );

            // 2. Create ledger entries
            await ledgerModel.createEntries(
                [
                    {
                        account_id: fromUserAccount.id,
                        transaction_id: transaction.id,
                        amount,
                        type: "DEBIT"
                    },
                    {
                        account_id: toAccount,
                        transaction_id: transaction.id,
                        amount,
                        type: "CREDIT"
                    }
                ],
                trx
            );

            // 3. Mark transaction COMPLETED
            transaction = await transactionModel.updateStatus(
                transaction.id,
                "COMPLETED",
                trx
            );
        });

    } catch (error) {
        return res.status(500).json({
            message: "System transaction failed due to an internal error"
        });
    }

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction
    });
}

module.exports = {
    createTransaction,
    createSystemTransaction
};