const mongoose = require('mongoose')
const Schema = mongoose.Schema

const historySchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        required: true
    },
    fromEmail: {
        type: String,
        required: true
    },
    to: {
        type: Schema.Types.ObjectId
    },
    toEmail: {
        type: String
    },
    type: {
        type: String
    },
    message: {
        type: String,
        required: true
    }
})

const TransactionHistory = mongoose.model("TransactionHistory", historySchema)
module.exports = TransactionHistory