module.exports.isAuthenticated = (req, res, next) => {
    const isAuth = req.cookies.userDate ? req.cookies.userDate : ""
    console.log(req.cookies);
    if (isAuth) return next()
}