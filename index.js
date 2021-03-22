const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundsRoutes = require('./router/campgroundsRoutes');
const reviewsRoutes = require('./router/reviewsRoutes');
const userRoutes = require('./router/user')

mongoose.connect('mongodb://localhost:27017/YelpCampV1', { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useFindAndModify: false })
    .then(() => {
        console.log('mongoDB is online with mongoose!');
    }).catch(e => {
        console.log('Error connecting to Mongoose! :::' + e);
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'NeedBettersecrets!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 6.048e+8,
        maxAge: 6.048e+8
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home');    
});

app.all('*', (req, res, next) =>{
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const{statusCode = 500, message = 'Something went wrong!'} = err;
res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
    console.log('Online on Port 3000');
})