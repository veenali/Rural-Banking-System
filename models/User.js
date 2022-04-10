const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
})

userSchema.methods.validatePassword = function(password) {
    return this.password === password;
}

const User = mongoose.model("User", userSchema)
module.exports = User