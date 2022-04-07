const express = require('express')
const app = express()
var cookieParser = require('cookie-parser')
const User = require('./models/User')

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/RuralBanking')
    .catch(err => console.log(err))

const { isAuthenticated } = require('./middlewares/Authentication');

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/home', async(req, res, next) => {
    const { email } = req.cookies.userData
    const user = await User.findOne({ email })
    if (user)
        res.render('pages/home', { user })
})

app.post('/login', async(req, res) => {
    console.log(req.body);
    const { email, password } = req.body
    await User.findOne({ email })
        .then(async user => {
            if (!user) {
                const user = await new User(req.body)
                await user.save()
                    .then(user => {
                        res.cookie("userData", user)
                        console.log("User added successfully")
                        res.redirect('/home')
                    })
            } else {
                if (user.password === password) {
                    res.cookie("userData", user)
                    console.log("User Logged in successfully")
                    res.redirect('/home')
                } else {
                    res.send("Invalid password")
                }
            }
        })
})

app.post('/withdraw', async(req, res, next) => {
    const { email } = req.cookies.userData
    const { withdrawAmount } = req.body
    const user = await User.findOne({ email })
    if (user) {
        const balance = user.balance
        if (balance > withdrawAmount) {
            const newAmount = balance - parseInt(withdrawAmount);
            const updatedUser = await User.findOneAndUpdate({ email }, { balance: newAmount }, { new: true })
            if (updatedUser) {
                console.log(updatedUser);
                res.send(`Amount withdrawed : ${withdrawAmount}. Remaining balance : ${updatedUser.balance}`)
            }
        } else {
            res.send("Not enough amount")
        }
    } else {
        res.redirect('/')
    }
})

app.post('/deposit', async(req, res, next) => {
    const { email } = req.cookies.userData
    const { depositAmount } = req.body
    const user = await User.findOne({ email })
    if (user) {
        const newBalance = user.balance + parseInt(depositAmount)
        const updateUser = await User.findOneAndUpdate({ email }, { balance: newBalance }, { new: true })
        if (updateUser) res.send(`Amount deposited : ${depositAmount}. Balance: ${updateUser.balance}`)
    } else {
        res.redirect('/')
    }
})

app.post('/moneytrans', async(req, res, next) => {
    const { email } = req.cookies.userData
    const receiverEmail = req.body.email
    const transferAmount = req.body.transferAmount
    const sender = await User.findOne({ email })
    const receiver = await User.findOne({ email: receiverEmail })
    if (sender && receiver) {
        const senderBalance = sender.balance
        if (senderBalance > transferAmount) {
            const newAmount = senderBalance - parseInt(transferAmount)
            const updatedSender = await User.findOneAndUpdate({ email }, { balance: newAmount }, { new: true })
            const newReceiverAmount = receiver.balance + parseInt(transferAmount)
            const updatedReciever = await User.findOneAndUpdate({ email: receiverEmail }, { balance: newReceiverAmount }, { new: true })
            if (updatedSender && updatedReciever) res.send("Transfer completed successfully")
            else
                res.send("Something went wrong!!")
        } else
            res.send("Not enough balance")
    } else
        res.send("Can't find receiver")
    res.send(req.body)
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})