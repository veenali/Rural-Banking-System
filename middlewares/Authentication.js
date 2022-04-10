module.exports.isAuthenticated = (req, res, next) => {
    if (req.cookies.userData) return next()
    return res.redirect('/')
}

module.exports.isLoggedIn = (req, res, next) => {
    if (req.cookies.userData) return res.redirect('/home')
    return next()
}