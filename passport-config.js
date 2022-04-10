const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/User')

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        console.log(req.body)

        User.findOne({ email })
            .then(async user => {
                if (!user) {
                    const user = await new User(req.body)
                    await user.save()
                        .then(user => {
                            // res.cookie("userData", user)
                            // console.log("User added successfully")
                            // res.redirect('/home')
                            return done(user, true);
                        })
                } else {
                    if (!user.validatePassword(password)) {
                        return done(null, false, { message: "Email or password is incorrect" });
                    }
                    return done(user, true)
                }
            })
            .catch(done)
    }
))