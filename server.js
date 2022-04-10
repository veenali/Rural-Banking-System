const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const User = require('./models/User')
const session = require('express-session')
require('dotenv').config()

// const passport = require('passport')
// require('./passport-config.js')

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set('view engine', 'ejs');
app.use(session({
        secret: 'itsasecret',
        resave: false,
        saveUninitialized: true
    }))
    // app.use(passport.initialize())
    // app.use(passport.session())

const mongoose = require('mongoose');
const dbURL = process.env.MONGO_URL
mongoose.connect(dbURL)
    .then(() => console.log("Database connection successful"))
    .catch(err => console.log(err))

const { isAuthenticated, isLoggedIn } = require('./middlewares/Authentication');
const TransactionHistory = require('./models/TransactionHistory');


app.use((req, res, next) => {
    res.locals.userData = req.cookies.userData ? req.cookies.userData : ""
    next()
})

app.get('/test', isAuthenticated, (req, res, next) => {
    res.send("TEST DONE")
})

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/home', isAuthenticated, async(req, res, next) => {
    const { email } = req.cookies.userData
    const user = await User.findOne({ email })
    const history = await TransactionHistory.find({ from: user._id })
    if (user)
        res.render('pages/home', { user, history })
})

app.post('/logout', isAuthenticated, async(req, res, next) => {
    res.clearCookie('userData')
    res.redirect('/')
})

app.post('/login', isLoggedIn, async(req, res) => {
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

app.post('/withdraw', isAuthenticated, async(req, res, next) => {
    const { email } = req.cookies.userData
    const { withdrawAmount } = req.body
    const user = await User.findOne({ email })
    if (user) {
        const balance = user.balance
        if (balance > withdrawAmount) {
            const newAmount = balance - parseInt(withdrawAmount);
            const history = {
                from: user._id,
                fromEmail: user.email,
                type: 'withdraw',
                message: `Amount withdrawn ${withdrawAmount}`
            }
            const updatedUser = await User.findOneAndUpdate({ email }, { balance: newAmount }, { new: true })
            if (updatedUser) {
                console.log(updatedUser);
                const transHistory = await new TransactionHistory(history)
                await transHistory.save()
                res.send(`Amount withdrawed : ${withdrawAmount}. Remaining balance : ${updatedUser.balance}`)
            }
        } else {
            res.send("Not enough amount")
        }
    } else {
        res.redirect('/')
    }
})

app.post('/deposit', isAuthenticated, async(req, res, next) => {
    const { email } = req.cookies.userData
    const { depositAmount } = req.body
    const user = await User.findOne({ email })
    if (user) {
        const history = {
            from: user._id,
            fromEmail: user.email,
            type: 'deposit',
            message: `Amount deposited ${depositAmount}`
        }
        const newBalance = user.balance + parseInt(depositAmount)
        const updateUser = await User.findOneAndUpdate({ email }, { balance: newBalance }, { new: true })
        if (updateUser) {
            const transHistory = await new TransactionHistory(history)
            await transHistory.save()
            res.send(`Amount deposited : ${depositAmount}. Balance: ${updateUser.balance}`)
        }
    } else {
        res.redirect('/')
    }
})

app.post('/moneytrans', isAuthenticated, async(req, res, next) => {
    const { email } = req.cookies.userData
    const receiverEmail = req.body.email
    const transferAmount = req.body.transferAmount
    const sender = await User.findOne({ email })
    const receiver = await User.findOne({ email: receiverEmail })
    if (sender && receiver && (sender.email !== receiver.email)) {
        const history = {
            from: sender._id,
            fromEmail: sender.email,
            to: receiver._id,
            toEmail: receiver.email,
            type: 'moneytrans',
            message: `Transferred ${transferAmount} Rs. to ${receiver.email}`
        }
        const senderBalance = sender.balance
        if (senderBalance > transferAmount) {
            const newAmount = senderBalance - parseInt(transferAmount)
            const updatedSender = await User.findOneAndUpdate({ email }, { balance: newAmount }, { new: true })
            const newReceiverAmount = receiver.balance + parseInt(transferAmount)
            const updatedReciever = await User.findOneAndUpdate({ email: receiverEmail }, { balance: newReceiverAmount }, { new: true })
            if (updatedSender && updatedReciever) {
                const transHistory = await new TransactionHistory(history)
                await transHistory.save()
                res.send("Transfer completed successfully")
            } else
                res.send("Something went wrong!!")
        } else
            res.send("Not enough balance")
    } else {
        res.send("Something went wrong. Please check your details carefully")
        res.end()
    }
    // res.send(req.body)
})

const port = 8080 | process.env.PORT
app.listen(8080, () => {
    console.log(`Listening on port ${port}`);
})