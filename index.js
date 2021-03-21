const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campgrounds');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {joiSchemaCampground} = require('./joiSchemas');
const {joiSchemaReview} = require('./joiSchemas');
const Review = require('./models/review');
const campgrounds = require('./router/campgroundsRoutes');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost:27017/YelpCampV1', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false })
    .then(() => {
        console.log('mongoDB is online with mongoose!');
    }).catch(e => {
        console.log('Error connecting to Mongoose! :::' + e);
});

const validateCampground = (req, res, next) => {
    const {error} = joiSchemaCampground.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const{error} = joiSchemaReview.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.use('/campgrounds', campgrounds);

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