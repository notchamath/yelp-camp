module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must login first!');
        return res.redirect('/login');
    }
    next();
}