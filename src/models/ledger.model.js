const moongoose = require("mongoose")
const transaction = require("./transaction.model")

const ledgerModel = new moongoose.Schema({
    account:{
        type: moongoose.Schema.Types.ObjectId,
        ref:"account",
        required: [true,"Ledger must be associated with an account"],
        index: true,
        immutable: true
    },
    ammount:{
        type:Number,
        required:[true,"Ammount is required for entry in ledgery"],
        immutable: true
    },
    transaction:{
        type: moongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true,"A transaction must occur for entry in ledger"],
        index: true,
        immutable: true,
    },
    type:{
        type: String,
        enum: {
            values:["CREDIT","DEBIT"],
            message: "Type can be either be nDREDIT or DEBIT"
        },
        required: [true,"Ledger type is required"],
        immutable: true
    }
})


function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or delete")
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);

const ledgerSchema = moongoose.model("ledger",ledgerModel)

module.exports = ledgerModel