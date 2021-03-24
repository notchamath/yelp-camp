const express = require('express');
const router = express.Router();;
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users')


router.get('/register', users.getRegister);

router.post('/register', catchAsync(users.postRegister));

router.get('/login', users.getLogin);

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.postLogin);

router.get('/logout', users.logout);

module.exports = router;