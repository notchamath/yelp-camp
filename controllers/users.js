const User = require('../models/user');
const passport = require('passport');

module.exports.getRegister = (req, res) => {
    res.render('users/register');
}

module.exports.postRegister = async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const newUser = new User({email, username});
        const registerUser = await User.register(newUser, password);
    
        req.login(registerUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
   
}

module.exports.getLogin = (req, res) => {
    res.render('users/login');
}

module.exports.postLogin = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Log out complete');
    res.redirect('/campgrounds');
}