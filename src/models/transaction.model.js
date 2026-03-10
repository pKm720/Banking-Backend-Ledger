const mongoose = require("mongoose");

const transactionModel = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
        required: [true,"Transaction must be linked to a From account"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
        required: [true,"Transaction must be linked to a To account"],
        index: true
    },
    status: {
        type: String,
        enum :{
            values: ["PENDING","COMPLETED","FAILED","REVERSED"],
            message: ["The transaction staus can only be  PENDING,COMPLETED,FAILED,REVERSED"]
        },
        default: "PENDING"

    },
    ammount: {
        type:Number,
        required: [true,"Ammount is required to create a transaction"],
        min:[0,"The transaction ammount can't be negative"]
    },
    idempotencyKey: {
        type:String,
        required :[true,"idempotency Key is required for a transaction"],
        index: true,
        unique: true
    }
},{
    timestamps: true
})

const transaction = mongoose.model("transaction",transactionModel)

module.exports = transaction